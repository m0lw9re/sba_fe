import {
  Button,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  Upload,
  UploadProps,
  message,
} from "antd";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import React, { ChangeEvent, useState } from "react";
import { newItem, formCreateNewAgreeFeeFileSchema } from "./config";
import { useFormik } from "formik";
import {
  LegalDocumentTypeType,
  AppraisalFileLegalDocumentType,
} from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import Icons from "assets/icons";
import "pages/AppraisalFileDetail/component/GeneralInfo/component/CreateNewModal/style.scss";
import { useCustomerDocumentType } from "utils/request";
import type { UploadFile, RcFile } from "antd/es/upload/interface";
import { ecmFileApi } from "apis/ecmFile";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
import { useParams } from "react-router-dom";
import { randomId } from "utils";
import { checkFileSizeBeforeUpload } from "utils/fileReader";
import { FILE_SIZE_CONFIG } from "constant/common";
import { FeeContentAgreeFeeFileCreateType } from "constant/types/appraisalFilesDetail";
import dayjs from "dayjs";

type Props = {
  index?: number,
  isOpen: boolean;
  closeModal: () => void;
  addNew: (pr : any) => void;
};

const { TEXT_AREA, DATE_PICKER } = TYPE_FIELD;

const initialValue: FeeContentAgreeFeeFileCreateType & {
  filesLength: number;
} = {
  ...newItem,
  filesLength: 0,
};

const CreateNewModal: React.FC<Props> = ({
  index,
  isOpen,
  closeModal,
  addNew,
}) => {
  let { id }: { id?: string } = useParams();

  const formCreateNewData = useFormik({
    initialValues: {
      ...initialValue,
    },
    validationSchema: formCreateNewAgreeFeeFileSchema,
    validateOnChange: true,
    onSubmit: (data: any) => {
      if(index !== undefined){
        handleUploadFileEcm(index);
      }
    },
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleUploadFileEcm = (index : number) => {
    addNew({
      ...formCreateNewData.values,
      index,
      fileNameAgreeFee : fileList[0]
    })
    handleCloseModal();
  };

  const handleCloseModal = () => {
    closeModal();
    formCreateNewData.resetForm();
    setFileList([]);
  };

  const props: UploadProps = {
    onRemove: () => {
      formCreateNewData.setFieldValue("filesLength", 0);
      setFileList([]);
    },
    beforeUpload: async (file) => {
      checkFileSizeBeforeUpload(file, FILE_SIZE_CONFIG.FILE);

      formCreateNewData.setValues({
        ...formCreateNewData.values,
        // mediaTypeAgreeFee: file?.type,
        filesLength: 1,
      });
      setFileList([file]);
      return false;
    },
    fileList,
    accept: ".pdf",
  };

  const handleChangeContent = (event: ChangeEvent<HTMLInputElement>) => {
    formCreateNewData.setFieldValue("noteAgreeFee", event.target.value);
  };

  const handleChangeValue = (data: any) => {
    formCreateNewData.setValues({
      ...formCreateNewData.values,
      ...data,
    });
  };

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const labelCol = { xs: 5, sm: 5, md: 8, lg: 8, xl: 8 };
  const wrapperCol = { xs: 19, sm: 19, md: 16, lg: 16, xl: 16 };

  const inputs: InputFiledParams[] = [
    {
      key: 1,
      type: TEXT_AREA,
      span: 24,
      error: formCreateNewData.errors.noteAgreeFee,
      touched: formCreateNewData.touched.noteAgreeFee,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      css: css,
      label: "Nội dung",
      value: formCreateNewData.values.noteAgreeFee,
      onChange: handleChangeContent,
    },
    {
      key: 2,
      label: "Ngày upload chứng từ XNP",
      type: DATE_PICKER,
      showTime: true,
      placeholder: DATE_TIME_FORMAT.dateTimeFull,
      formatDatetime: DATE_TIME_FORMAT.dateTimeFull,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: formCreateNewData.values.dateAgreeFee
        ? dayjs(formCreateNewData.values.dateAgreeFee)
        : null,
      error: formCreateNewData.errors.dateAgreeFee,
      touched: formCreateNewData.touched.dateAgreeFee,
      onChange: (value: any) => {
        handleChangeValue({ dateAgreeFee: value ? dayjs(value).toISOString() : null });
      },
    },
  ];
  return (
    <div>
      <Modal
        className="modal-create-new-sba-appraisal-file-container"
        open={isOpen}
        onCancel={closeModal}
        title={
          <Typography.Text className="modal-title">
            Upload chứng từ XNP
          </Typography.Text>
        }
        footer={
          <Row justify={"end"}>
            <Space>
              <ButtonCustom
                type="default"
                size="middle"
                style={{ width: "100px" }}
                label="Hủy"
                onClick={handleCloseModal}
              />
              <ButtonCustom
                type="primary"
                size="middle"
                style={{ width: "100px" }}
                label="Xác nhận"
                onClick={() => {
                  formCreateNewData.submitForm();
                }}
                htmlType="submit"
              />
            </Space>
          </Row>
        }
      >
        <Divider style={{ margin: "10px" }} />
        <Form
          size="small"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          labelAlign="left"
          requiredMark={false}
          labelWrap
          colon={false}
        >
          <Row gutter={[24, 16]} style={{ width: "100%" }}>
            <InputFields data={inputs} />
            <Col xs={css.xs} sm={css.sm} lg={css.lg} md={css.md} xl={css.xl}>
              <Form.Item
                label="File tài liệu"
                required
                labelCol={labelCol}
                wrapperCol={wrapperCol}
                validateStatus={
                  formCreateNewData.touched.filesLength &&
                  formCreateNewData.errors.filesLength
                    ? "error"
                    : ""
                }
                // help={
                //   formCreateNewData.touched.filesLength &&
                //   formCreateNewData.errors.filesLength
                // }
              >
                <Upload {...props} maxCount={1}>
                  <Button icon={<Icons.upload />}>Chọn file</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateNewModal;
