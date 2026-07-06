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
import React, { ChangeEvent, useEffect, useState } from "react";
import { newItem, formEditSbaAppraisalFileSchema } from "./config";
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

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  dataInit: AppraisalFileLegalDocumentType | undefined;
  handleEdit: (data: AppraisalFileLegalDocumentType, key: string) => void;
};

const { TEXT_AREA, SELECT } = TYPE_FIELD;

const initialValue: AppraisalFileLegalDocumentType & {
  filesLength: number;
} = {
  ...newItem,
  filesLength: 0,
};

const EditLegalModal: React.FC<Props> = ({
  isOpen,
  closeModal,
  handleEdit,
  dataInit,
}) => {
  const formEditData = useFormik({
    initialValues: {
      ...initialValue,
    },
    validationSchema: formEditSbaAppraisalFileSchema,
    validateOnChange: true,
    onSubmit: (data: any) => {
      handleUploadFileEcm();
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
          name: dataInit.filename || "",
          fileName: dataInit.filename || "",
        },
      ]);
    }
  }, [dataInit]);

  const handleUploadFileEcm = async () => {
    if (isReplaceFile) {
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
          const { filesLength, ...rest } = formEditData.values;
          handleEdit &&
            dataInit?.key &&
            id &&
            handleEdit(
              {
                ...rest,
                mediaType: responseUploadEcm?.data.body.mediaType,
                appraisalFileId: id,
                ecmId: responseUploadEcm?.data.body.ecmId,
                filename: responseUploadEcm?.data.body.filename,
                whoUpload: responseUploadEcm?.data.body.whoUpload,
                dateUpload: responseUploadEcm?.data.body.dateUpload,
              },
              dataInit.key
            );
        } else message.error(responseUploadEcm.data?.body?.message);
      } catch {
        message.error("Lỗi khi upload dữ liệu!");
      }
    } else {
      const { filesLength, ...rest } = formEditData.values;
      handleEdit &&
        dataInit?.key &&
        handleEdit(
          {
            ...rest,
          },
          dataInit.key
        );
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
          name: dataInit.filename || "",
          fileName: dataInit.filename || "",
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
    formEditData.setFieldValue("documentContent", event.target.value);
  };

  const handleChangeLegalDoc = (value: number) => {
    if (value) {
      const foundLegalDocType =
        data?.find(
          (el: LegalDocumentTypeType) => el.legalDocumentTypeId === value
        ) || null;
      if (!foundLegalDocType) return;
      formEditData.setValues({
        ...formEditData.values,
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
      error: formEditData.errors.legalDocumentTypeId,
      label: "Loại tài liệu",
      options:
        data?.map((item: LegalDocumentTypeType) => {
          return {
            label: item.name,
            value: item.legalDocumentTypeId,
          };
        }) || [],
      value: formEditData.values.legalDocumentTypeId,
      onChange: handleChangeLegalDoc,
    },
    {
      key: 2,
      type: TEXT_AREA,
      span: 24,
      error: formEditData.errors.documentContent,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      css: css,
      label: "Nội dung",
      value: formEditData.values.documentContent,
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
            Cập nhật loại tài liệu
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
                help={
                  formEditData.touched.filesLength &&
                  formEditData.errors.filesLength
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

export default EditLegalModal;
