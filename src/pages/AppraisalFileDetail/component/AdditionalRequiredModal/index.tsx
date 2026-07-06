import { CloseOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Row, Space, message } from 'antd';
import { appraisalFilesApi } from 'apis/appraisalFiles';
import ButtonCustom from 'components/ButtonCustom';
import CardTitleCustomUpdate from 'components/CardTitleCustomUpdate';
import InputFields from 'components/InputFields';
import { TYPE_FIELD } from 'constant/enums';
import { AdditionalRequiredData } from 'constant/types';
import { InputFiledParams } from 'constants/types/Form_Field_type';
import { useFormik } from 'formik';
import useAppraisalFileFunction from 'hooks/useAppraisalFileFunction';
import { useEffect, useState } from 'react';
import { useAdditionRequired, useAppraisalFileDetail, useCustomerDocumentType } from 'utils/request';
import * as Yup from 'yup';
import AdditionalRequiredTable from './AdditionalRequiredTable';
import './style.scss';
import { APPRAISAL_FILE_STATUS, ROLES } from 'constant/common';
import { isContainRole } from 'utils/common';

const { SELECT, TEXT_AREA } = TYPE_FIELD;

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  customerTypeId: number | null;
  assetLevelTwoId: number | null;
  appraisalFileId: string;
  fileStatus: number;
  disableBtnSave?: boolean;
};

type AdditionalRequiredBasicData = {
  legalDocumentTypeId?: number;
  reasonOfRequired?: string;
};

const initialFormData: AdditionalRequiredData = {
  legalDocumentTypeId: null,
  reasonOfRequired: '',
};
const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
const formSchema = Yup.object().shape({
  reasonOfRequired: Yup.string()
    .nullable()
    .required('Phải nhập nội dung lý do yêu cầu bổ sung hồ sơ'),
});

const AdditionalRequiredModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  customerTypeId,
  assetLevelTwoId,
  appraisalFileId,
  fileStatus,
  disableBtnSave,
}) => {
  const { mutate: mutateAppraisalFile } = useAppraisalFileDetail(appraisalFileId);
  const { mutate } = useAdditionRequired(appraisalFileId);
  const { isCompletedAppraisalFromLos, isUserCanNotUpdate } = useAppraisalFileFunction({
    appraisalId: appraisalFileId,
  });
  const [loading, setLoading] = useState<boolean>(false)
  const isRoleCBTM = isContainRole(ROLES.CBTM);
  const isCannotEdit = isUserCanNotUpdate() || fileStatus === APPRAISAL_FILE_STATUS.SIX;
  

  const handleChangeAdditionalRequiredData = (
    basicData: AdditionalRequiredBasicData,
  ) => {
    formAdditionalRequiredData.setValues(state => ({
      ...state,
      ...basicData,
    }));
  };

  const formAdditionalRequiredData = useFormik({
    initialValues: initialFormData,
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: async (data: AdditionalRequiredData) => {
      setLoading(true);
      try {
        const response = await appraisalFilesApi.getAdditionalRequired(
          data,
          appraisalFileId!,
        );
        if (response.data.code === 200) {
          message.success(response.data.message);
          mutate();
          mutateAppraisalFile();
          formAdditionalRequiredData.resetForm();
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error: any) {
        message.error('Yêu cầu bổ sung hồ sơ thất bại');
      } finally {
        setLoading(false);
      }
    },
  });
  const inputFields: InputFiledParams[] = [
    {
      key: 2,
      label: 'Pháp lý cần bổ sung',
      css: css,
      labelCol: { xs: 8, sm: 8, md: 8, lg: 6, xl: 6 },
      wrapperCol: { xs: 16, sm: 16, md: 16, lg: 18, xl: 18 },
      type: TEXT_AREA,
      value: formAdditionalRequiredData.values.reasonOfRequired,
      require: true,
      error: formAdditionalRequiredData.errors.reasonOfRequired,
      touched: formAdditionalRequiredData.touched.reasonOfRequired,
      onChange: (e: any) =>
        handleChangeAdditionalRequiredData({
          reasonOfRequired: e.target.value,
        }),
    },
  ];
  useEffect(() => {
    if (isOpenModal) {
      if (isCompletedAppraisalFromLos())
        message.info('Vui lòng hoàn thành tiếp nhận trước.');
    }
  }, [isOpenModal]);
  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className='modalAdditionRequired'
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      <Space direction='vertical' size={'small'} className='space-assignment'>
        <Row
          justify={'space-between'}
          align={'middle'}
          className='modalAdditionRequired-header'
        >
          <CardTitleCustomUpdate title='Yêu cầu bổ sung hồ sơ' />
          <Button
            shape='circle'
            icon={<CloseOutlined />}
            onClick={() => {
              formAdditionalRequiredData.resetForm();
              closeModal();
            }}
            size='small'
          />
        </Row>
        {
          !isRoleCBTM && (
            !isCannotEdit && (
              <Form labelAlign='left' labelWrap size='small'>
                <Row gutter={[24, 4]}>
                  <InputFields data={inputFields} />
                </Row>
                <Row
                  justify={'end'}
                  style={{ padding: '8px 0' }}
                  className='button-row'
                >
                  <Space>
                    <ButtonCustom
                      label='Hủy bỏ'
                      onClick={() => {
                        formAdditionalRequiredData.resetForm();
                        closeModal();
                      }}
                    />
                    <ButtonCustom
                      label='Xác nhận'
                      type='primary'
                      loading={loading}
                      className='required-action-button'
                      disabled={isCompletedAppraisalFromLos() || disableBtnSave}
                      onClick={formAdditionalRequiredData.submitForm}
                    />
                  </Space>
                </Row>
              </Form>
            )
          )
        }
        <div className='table-addition' style={{ padding: '0 8px' }}>
          <AdditionalRequiredTable appraisalFileId={appraisalFileId} />
        </div>
      </Space>
    </Modal>
  );
};
export default AdditionalRequiredModal;
