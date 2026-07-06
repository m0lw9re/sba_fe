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
import React, { ChangeEvent, useEffect, useState } from "react";
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
import "pages/AppraisalFileDetail/component/GeneralInfo/component/EditLegalModal/style.scss";
import { useCustomerDocumentType } from "utils/request";
import type { UploadFile, RcFile } from "antd/es/upload/interface";
import { ecmFileApi } from "apis/ecmFile";
import { randomId } from "utils/string";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
import { useParams } from "react-router-dom";
import { FILE_SIZE_CONFIG } from "constant/common";
import { checkFileSizeBeforeUpload } from "utils/fileReader";
import { FeeContentAgreeFeeFileType } from "constant/types/appraisalFilesDetail";
import dayjs from "dayjs";

type Props = {
  index?: number,
  isOpen: boolean;
  closeModal: () => void;
  dataInit: FeeContentAgreeFeeFileType | undefined;
  handleEdit: (pr : any) => void;
};

const { TEXT_AREA, DATE_PICKER } = TYPE_FIELD;

const initialValue: FeeContentAgreeFeeFileType & {
  filesLength: number;
} = {
  ...newItem,
  filesLength: 0,
};

const EditLegalModal: React.FC<Props> = ({
  index,
  isOpen,
  closeModal,
  handleEdit,
  dataInit,
}) => {
  const formEditData = useFormik({
    initialValues: {
      ...initialValue,
    },
    validationSchema: formCreateNewAgreeFeeFileSchema,
    validateOnChange: true,
    onSubmit: (data: any) => {
      if(index !== undefined){
        handleUploadFileEcm(index);
      }
      handleCloseModal();
    },
  });

  let { id }: { id?: string } = useParams();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [isReplaceFile, setIsReplaceFile] = useState<boolean>(false);

  useEffect(() => {
    if (dataInit) {
      setIsReplaceFile(false);
      formEditData.setValues({
        ...formEditData.values,
        ...dataInit,
        filesLength: 1,
      });
      setFileList([
        {
          uid: randomId(),
          name: dataInit.fileNameAgreeFee || "",
          fileName: dataInit.fileNameAgreeFee || "",
        },
      ]);
    }
  }, [dataInit]);

  const handleUploadFileEcm = async (index : number) => {
    if (isReplaceFile) {
      handleEdit({
        ...formEditData.values,
        index,
        fileNameAgreeFee : fileList[0]
      })
    } else {
    //   const { filesLength, ...rest } = formEditData.values;
    //   handleEdit &&
    //     dataInit?.key &&
    //     handleEdit(
    //       {
    //         ...rest,
    //       },
    //       dataInit.key
    //     );
    }
  };

  const handleCloseModal = () => {
    if (dataInit) {
      setIsReplaceFile(false);
      formEditData.setValues({
        ...formEditData.values,
        ...dataInit,
        filesLength: 1,
      });
      setFileList([
        {
          uid: randomId(),
          name: dataInit.fileNameAgreeFee || "",
          fileName: dataInit.fileNameAgreeFee || "",
        },
      ]);
    }
    closeModal();
  };

  const props: UploadProps = {
    onRemove: () => {
      formEditData.setFieldValue("filesLength", 0);
      setFileList([]);
    },
    beforeUpload: async (file) => {
      checkFileSizeBeforeUpload(file, FILE_SIZE_CONFIG.FILE);

      formEditData.setValues({
        ...formEditData.values,
        filesLength: 1,
      });
      setFileList([file]);
      setIsReplaceFile(true);
      return false;
    },
    fileList,
  };

  const handleChangeContent = (event: ChangeEvent<HTMLInputElement>) => {
    formEditData.setFieldValue("noteAgreeFee", event.target.value);
  };

  const handleChangeValue = (data: any) => {
    formEditData.setValues({
      ...formEditData.values,
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
      error: formEditData.errors.noteAgreeFee,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      css: css,
      label: "Nội dung",
      value: formEditData.values.noteAgreeFee,
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
      value: formEditData.values.dateAgreeFee
        ? dayjs(formEditData.values.dateAgreeFee)
        : null,
      error: formEditData.errors.dateAgreeFee,
      touched: formEditData.touched.dateAgreeFee,
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
                  formEditData.submitForm();
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
                  formEditData.touched.filesLength &&
                  formEditData.errors.filesLength
                    ? "error"
                    : ""
                }
                // help={
                //   formEditData.touched.filesLength &&
                //   formEditData.errors.filesLength
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

export default EditLegalModal;
