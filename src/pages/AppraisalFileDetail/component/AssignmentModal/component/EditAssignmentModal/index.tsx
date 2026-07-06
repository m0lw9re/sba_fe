import { CloseOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Row, Space, message } from "antd";
import { assignmentApi } from "apis/asignment";
import { categoryApi } from "apis/category";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import {
  UpdateAssignmentType
} from "constant/types/assignment";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import "./style.scss";
const { SELECT, MULTI_SELECT_SEARCH } = TYPE_FIELD;

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  appraisalFileId: string;
  appraisalUnit: number | null;
  assignment: any;
  mutate: () => void;
};

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };

const formSchema = Yup.object().shape({
  staffs: Yup.string().nullable().required("Phải chọn nhân viên phân công"),
  jobTypeId: Yup.number().nullable().required("Phải chọn bước thực hiện"),
  priorityLevel: Yup.number().nullable().required("Phải chọn độ ưu tiên"),
});

const EditAssignmentModal: React.FC<Props> = ({
  isOpenModal,
  assignment,
  closeModal,
  mutate,
}) => {
  const globalSliceData = useSelector((state: RootState) => state.globalSlice);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [staffs, setStaffs] = useState<Array<any>>([]);

  const form = useFormik({
    initialValues: {
      appraisalFileId: "",
      assignmentId: null,
      companyBranch: {
        companyBranchId: null,
        companyBranchName: "",
        address: "",
        code: "",
      },
      companyBranchId: null,
      jobAssigner: "",
      jobType: { jobTypeId: null, jobTypeName: "" },
      jobTypeId: null,
      priorityLevel: null,
      staffs: "",
      status: null,
      timeAssigned: "",
      timeEnd: "",
    } as any,
    validationSchema: formSchema,
    onSubmit: async (data: UpdateAssignmentType | any) => {
      try {
        setIsLoading(true);
        const responseUpdate = await assignmentApi.update({
          ...data,
          staffs: data.staffs ? JSON.parse(data.staffs || "[]") : [],
        });
        if (responseUpdate.data.code === 200) {
          message.success(responseUpdate.data.message);
          mutate();
          closeModal();
        } else message.error(responseUpdate.data.message);
        form.resetForm();
        setIsLoading(false);
      } catch (error: any) {
        message.error("Sửa phân giao không thành công");
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (assignment) {
      form.setValues({
        ...assignment,
        staffs: assignment.staffs.length > 0 ? JSON.stringify(assignment.staffs) : "",
      });
    }
  }, [assignment]);

  useEffect(() => {
    const getStaffForAssign = async () => {
      try {
        if (form.values.jobTypeId && form.values.companyBranchId) {
          const res = await categoryApi.getStaffForAssign(
            form.values.jobTypeId,
            form.values.companyBranchId
          );
          setStaffs(
            res.data.map((item: any) => ({
              label: item.username,
              value: item.username,
            }))
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
      label: "Bước",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      disable: true,
      value: form.values.jobTypeId,
      onChange: (value: number) => {
        form.setValues({ ...form.values, jobTypeId: value, staffs: "" });
      },
      options: globalSliceData.jobTypeOptions,
      error:
        form.errors.jobTypeId && form.touched.jobTypeId
          ? form.errors.jobTypeId
          : "",
    },
    {
      key: 1,
      label: "Chi nhánh SBA",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: form.values.companyBranchId,
      onChange: (value: number) => {
        form.setValues({ ...form.values, companyBranchId: value });
      },
      options: globalSliceData.branchOptions,
    },
    {
      key: 1,
      label: "Cán bộ phụ trách",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: MULTI_SELECT_SEARCH,
      value: form.values.staffs ? JSON.parse(form.values.staffs || "[]") : [],
      error: form.errors.staffs,
      touched: form.touched.staffs,
      onChange: (value: string[]) => {
        form.setValues({ ...form.values, staffs: value.length > 0 ?  JSON.stringify(value) : "" });
      },
      options: staffs || [],
      disable: form.values.jobTypeId ? false : true,
      require: true,
    },
    {
      key: 1,
      label: "Độ ưu tiên",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: form.values.priorityLevel,
      onChange: (value: number) => {
        form.setValues({ ...form.values, priorityLevel: value });
      },
      options: globalSliceData.priorityLevelOptions,
      error: form.errors.priorityLevel,
      touched: form.touched.priorityLevel,
      require: true,
      allowClear: true,
    },
  ];
  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalEditAssignment"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalEditAssignment-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Cập nhật phân giao" color="#FFF" />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={closeModal}
            size="small"
          />
        </Row>
        <Form labelAlign="left" labelWrap size="small">
          <Row gutter={[24, 4]}>
            <InputFields data={inputFields} />
          </Row>
        </Form>
        <Row
          justify={"end"}
          style={{ padding: "0 8px 8px 0" }}
          className="button-row"
        >
          <Space style={{ width: "14%" }}>
            <ButtonCustom label="Hủy bỏ" onClick={closeModal} />
            <ButtonCustom
              disabled={isLoading}
              label="Cập nhật"
              type="primary"
              onClick={form.submitForm}
              bgColor="rgba(40, 98, 175, 1)"
            />
          </Space>
        </Row>
      </Space>
    </Modal>
  );
};
export default EditAssignmentModal;
