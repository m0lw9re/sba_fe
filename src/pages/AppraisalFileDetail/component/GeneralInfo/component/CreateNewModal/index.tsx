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
import { TYPE_FIELD } from "constant/enums";
import React, { ChangeEvent, useState } from "react";
import { newItem, formCreateNewSbaAppraisalFileSchema } from "./config";
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

type Props = {
  isOpen: boolean;
  type: number;
  closeModal: () => void;
  addNew: (data: AppraisalFileLegalDocumentType) => void;
};

const { TEXT_AREA, SELECT } = TYPE_FIELD;

const initialValue: AppraisalFileLegalDocumentType & {
  filesLength: number;
} = {
  ...newItem,
  filesLength: 0,
};

const CreateNewModal: React.FC<Props> = ({
  isOpen,
  type,
  closeModal,
  addNew,
}) => {
  let { id }: { id?: string } = useParams();

  const formCreateNewData = useFormik({
    initialValues: {
      ...initialValue,
    },
    validationSchema: formCreateNewSbaAppraisalFileSchema,
    validateOnChange: true,
    onSubmit: (data: any) => {
      handleUploadFileEcm();
    },
  });

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleUploadFileEcm = async () => {
    const formData = new FormData();
    formData.append("file", fileList[0] as RcFile);
    try {
      const responseUploadEcm = await ecmFileApi.uploadECMFile(formData, {
        fileType: "legalDocument",
      });
      if (
        responseUploadEcm.data?.statusCodeValue === 200 &&
        !responseUploadEcm.data?.body?.code
      ) {
        const { filesLength, ...rest } = formCreateNewData.values;
        id &&
          addNew({
            ...rest,
            key: randomId(),
            type: type,
            mediaType: responseUploadEcm?.data.body.mediaType,
            appraisalFileId: id,
            ecmId: responseUploadEcm?.data.body.ecmId,
            filename: responseUploadEcm?.data.body.filename,
            whoUpload: responseUploadEcm?.data.body.whoUpload,
            dateUpload: responseUploadEcm?.data.body.dateUpload,
          });
          handleCloseModal();
      } else message.error(responseUploadEcm.data?.body?.message);
    } catch {
      message.error("Lỗi khi upload tài liệu! Vui lòng thử lại!");
    }
  };

  const appraisalFileState = useSelector(
    (state: RootState) => state.appraisalFileDetailSlice
  );

  const { data } = useCustomerDocumentType({
    // customerTypeId: customerTypeId,
    assetLevelTwoId: appraisalFileState.assetLevelTwoId,
  });

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
        mediaType: file?.type,
        filesLength: 1,
      });
      setFileList([file]);
      return false;
    },
    fileList,
    accept: ".pdf",
  };

  const handleChangeContent = (event: ChangeEvent<HTMLInputElement>) => {
    formCreateNewData.setFieldValue("documentContent", event.target.value);
  };

  const handleChangeLegalDoc = (value: number) => {
    if (value) {
      const foundLegalDocType =
        data?.find(
          (el: LegalDocumentTypeType) => el.legalDocumentTypeId === value
        ) || null;
      if (!foundLegalDocType) return;
      formCreateNewData.setValues({
        ...formCreateNewData.values,
        legalDocumentTypeId: value,
        legalDocumentType: foundLegalDocType,
      });
    }
  };

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const labelCol = { xs: 5, sm: 5, md: 8, lg: 8, xl: 8 };
  const wrapperCol = { xs: 19, sm: 19, md: 16, lg: 16, xl: 16 };

  const inputs: InputFiledParams[] = [
    {
      key: 1,
      type: SELECT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      error: formCreateNewData.errors.legalDocumentTypeId,
      touched: formCreateNewData.touched.legalDocumentTypeId,
      label: "Loại tài liệu",
      options:
        data?.map((item: LegalDocumentTypeType) => {
          return {
            label: item.name,
            value: item.legalDocumentTypeId,
          };
        }) || [],
      value: formCreateNewData.values.legalDocumentTypeId,
      onChange: handleChangeLegalDoc,
    },
    {
      key: 2,
      type: TEXT_AREA,
      span: 24,
      error: formCreateNewData.errors.documentContent,
      touched: formCreateNewData.touched.documentContent,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      css: css,
      label: "Nội dung",
      value: formCreateNewData.values.documentContent,
      onChange: handleChangeContent,
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
            Thêm mới loại tài liệu
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
                help={
                  formCreateNewData.touched.filesLength &&
                  formCreateNewData.errors.filesLength
                }
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
