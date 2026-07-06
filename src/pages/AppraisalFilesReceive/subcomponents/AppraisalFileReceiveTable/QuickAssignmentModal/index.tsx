import { CloseOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Row, Space, message } from 'antd';
import { assignmentApi } from 'apis/asignment';
import { categoryApi } from 'apis/category';
import ButtonCustom from 'components/ButtonCustom';
import CardTitleCustomUpdate from 'components/CardTitleCustomUpdate';
import InputFields from 'components/InputFields';
import { TYPE_FIELD } from 'constant/enums';
import { CreateAssignmentType } from 'constant/types/assignment';
import { InputFiledParams } from 'constants/types/Form_Field_type';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import './style.scss';
const { SELECT, MULTI_SELECT_SEARCH } = TYPE_FIELD;

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  onOk: () => void;
  companyBranchId?: number | null;
  selectedAppraisalFiles: string[];
};

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };

const formSchema = Yup.object().shape({
  staffs: Yup.string().nullable().required('Phải chọn nhân viên phân công'),
  jobTypeId: Yup.number().nullable().required('Phải chọn bước thực hiện'),
  priorityLevel: Yup.number().nullable().required('Phải chọn độ ưu tiên'),
});

const QuickAssignmentModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  onOk,
  companyBranchId,
  selectedAppraisalFiles,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [companyBranchs, setCompanyBranchs] = useState<Array<any>>([]);
  const [jobTypes, setJobTypes] = useState<Array<any>>([]);
  const [priorityLevels, setPriorityLevels] = useState<Array<any>>([]);
  const [staffs, setStaffs] = useState<Array<any>>([]);

  // disable chuyển giao chi nhánh
  const [disableBranchEdit, setDisableBranchEdit] = useState<boolean>(true);

  const form = useFormik({
    initialValues: {
      staffs: null,
      jobTypeId: null,
      priorityLevel: null,
      companyBranchId,
      note: '',
    } as CreateAssignmentType,
    validationSchema: formSchema,
    onSubmit: async (data: CreateAssignmentType) => {
      try {
        setIsLoading(true);
        // Nếu chọn bước chuyển giao chi nhánh
        if (!disableBranchEdit && data.companyBranchId) {
          // const res = await branchsApi.updateBranchAppraisalFile({
          //   appraisalFileId: 'doi lai di ba',
          //   companyBranchId: data.companyBranchId,
          // });
          // if (res.data.code === 200) message.success(res.data.message);
          // else message.error(res.data.message);
        } else {
          const dataCreate: any = selectedAppraisalFiles.map(id => {
            return {
              appraisalFileId: id,
              staffs: data.staffs !== null ? JSON.parse(data.staffs) : [],
              jobTypeId: data.jobTypeId,
              companyBranchId: data.companyBranchId,
              priorityLevel: data.priorityLevel,
              note: data.note,
            };
          });
          const res = await assignmentApi.multiCreate(dataCreate);
          if (res.data.code === 200) {
            message.success(res.data.message);
            closeModal();
            onOk();
          } else message.error(res.data.message);
          // mutateAssignment();
          form.resetForm();
        }
        setIsLoading(false);
      } catch (error: any) {
        message.error('Phân giao không thành công.');
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const getCompanyBranchs = async () => {
      try {
        const res = await categoryApi.getCompanyBranchs();
        setCompanyBranchs(
          res.data.map((item: any) => ({
            label: item.companyBranchName,
            value: item.companyBranchId,
          })),
        );
      } catch (error) {}
    };
    const getJobTypes = async () => {
      try {
        const res = await categoryApi.getJobTypes();
        setJobTypes(
          res.data
            .filter((item: any) => item.jobTypeId !== 7)
            .map((item: any) => ({
              label: item.jobTypeName,
              value: item.jobTypeId,
            })),
        );
      } catch (error) {}
    };
    const getPriorityLevels = async () => {
      try {
        const res = await categoryApi.getPriorityLevels();
        setPriorityLevels(
          res.data.map((item: any) => ({
            label: item.name,
            value: item.id,
          })),
        );
      } catch (error) {}
    };
    getCompanyBranchs();
    getJobTypes();
    getPriorityLevels();
  }, []);
  useEffect(() => {
    if (companyBranchId) {
      form.setValues({ ...form.values, companyBranchId });
    }
  }, [companyBranchId]);

  useEffect(() => {
    const getStaffForAssign = async () => {
      try {
        if (form.values.jobTypeId && form.values.companyBranchId) {
          const res = await categoryApi.getStaffForAssign(
            form.values.jobTypeId,
            form.values.companyBranchId,
          );
          setStaffs(
            res.data.map((item: any) => {
              // 05/01/2024 - haipham - fix hiện cụ thể số lượng hồ sơ
              if (form.values.jobTypeId == 2) {
                // 2: Phân công khảo sát
                return ({
                  label: item.username + " (" + item.waitAssignment + ")",
                  value: item.username,
                });
              } else if (form.values.jobTypeId == 3) {
                // 3: Khảo sát
                return ({
                  label: item.username + " (" + item.assignmentWork + "/" + item.assignment + ")",
                  value: item.username,
                });
              } else {
                return ({
                  label: item.username,
                  value: item.username,
                });
              }
            }),
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    getStaffForAssign();
  }, [form.values.jobTypeId, form.values.companyBranchId]);
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: 'Bước',
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: form.values.jobTypeId,
      onChange: (value: number) => {
        form.setValues({ ...form.values, jobTypeId: value, staffs: '' });
        // Kiểm tra có phải bước chuyển chi nhánh không
        if (value === 7) {
          // Cho phép thay đổi chi nhánh
          setDisableBranchEdit(false);
        }
      },
      options: jobTypes,
      error:
        form.errors.jobTypeId && form.touched.jobTypeId
          ? form.errors.jobTypeId
          : '',
    },
    {
      key: 2,
      label: 'Chi nhánh SBA',
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: form.values.companyBranchId,
      // disable: !isNaN(Number(form.values.companyBranchId)),
      disable: disableBranchEdit,
      onChange: (value: number) => {
        form.setValues({ ...form.values, companyBranchId: value });
      },
      options: companyBranchs,
    },
    {
      key: 3,
      label: 'Cán bộ phụ trách',
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: MULTI_SELECT_SEARCH,
      value: form.values.staffs ? JSON.parse(form.values.staffs || '[]') : [],
      error: form.errors.staffs,
      touched: form.touched.staffs,
      onChange: (value: string[]) => {
        form.setValues({
          ...form.values,
          staffs: value.length > 0 ? JSON.stringify(value) : '',
        });
      },
      options: staffs,
      disable: form.values.jobTypeId ? false : true,
      require: true,
    },
    {
      key: 4,
      label: 'Độ ưu tiên',
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: form.values.priorityLevel,
      onChange: (value: number) => {
        form.setValues({ ...form.values, priorityLevel: value });
      },
      options: priorityLevels,
      error: form.errors.priorityLevel,
      touched: form.touched.priorityLevel,
    },
  ];
  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className='modalAssignment'
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      <Space direction='vertical' size={'small'} className='space-assignment'>
        <Row
          justify={'space-between'}
          align={'middle'}
          className='modalAssignment-header'
          style={{ width: '100%' }}
        >
          <CardTitleCustomUpdate title='Phân giao' color='#FFF' />
          <Button
            shape='circle'
            icon={<CloseOutlined />}
            onClick={closeModal}
            size='small'
          />
        </Row>
        <Form labelAlign='left' labelWrap size='small'>
          <Row gutter={[24, 4]}>
            <InputFields data={inputFields} />
          </Row>
        </Form>
        <Row
          justify={'end'}
          style={{ padding: '0 8px', marginBottom: '12px' }}
          className='button-row'
        >
          <Space style={{ width: '11%' }}>
            <ButtonCustom
              label='Hủy bỏ'
              onClick={() => {
                form.resetForm();
                closeModal();
              }}
            />
            <ButtonCustom
              label='Lưu'
              loading={isLoading}
              type='primary'
              onClick={form.submitForm}
              bgColor='rgba(40, 98, 175, 1)'
              style={{ color: '#fff' }}
            />
          </Space>
        </Row>
      </Space>
    </Modal>
  );
};
export default QuickAssignmentModal;
