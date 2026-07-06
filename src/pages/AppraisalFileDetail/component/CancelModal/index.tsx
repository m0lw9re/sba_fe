/* eslint-disable react-hooks/exhaustive-deps */
import {
  CloseOutlined,
  DownloadOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import { appraisalFilesApi } from "apis/appraisalFiles";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { useFormik } from "formik";
import "./style.scss";
// import { CommonGetAllParams } from "constants/types/common.type";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { AppraisalFileType } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { Fragment, useEffect, useState } from "react";
import * as Yup from "yup";
import { CancelAppraisalFileData } from "constant/types/appraisalFile";
import { useListAppraisalFileReplace } from "utils/request";
import { ecmFileApi } from "apis/ecmFile";
import { RcFile } from "antd/es/upload";
import { APPRAISAL_FILE_STATUS } from "constant/common";
import { saveAs } from "file-saver";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  appraisalFileData: AppraisalFileType;
  mutateAppraisalFileDetail: any;
};

type FormType = CancelAppraisalFileData & {
  replaceByAppraisalFileCode?: string | null;
  replaceToAppraisalFileCode?: string | null;
};

const initialFormData: FormType = {
  note: "",
  appraisalFileIdWillBeReplaced: null,
  appraisalFileId: null,
  listDocument: [],
};

const formSchema = Yup.object().shape({
  note: Yup.string().nullable(),
  appraisalFileIdWillBeReplaced: Yup.string()
    .nullable()
    .required("Phải chọn hồ sơ thay thế"),
});

const { TEXT_AREA, SELECT, INPUT } = TYPE_FIELD;

const CancelModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  appraisalFileData,
  mutateAppraisalFileDetail,
}) => {
  const handleChangeRefuseToPriceData = (basicData: any) => {
    formCancel.setValues((state) => ({
      ...state,
      ...basicData,
    }));
  };

  const {
    data: listAppraisalFileReplace,
  }: {
    data: any;
    isLoading: boolean;
    error: any;
    mutate: () => void;
  } = useListAppraisalFileReplace({
    customerId: appraisalFileData.customerId,
    branchId:
      appraisalFileData.branchCode || appraisalFileData.transOfficeCode || "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  const formCancel = useFormik({
    initialValues: initialFormData,
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: async (data: FormType) => {
      setLoading(true);
      try {
        //upload file
        const formData = new FormData();
        for (let i = 0; i < fileList.length; i++) {
          formData.append("files", fileList[i].originFileObj as RcFile);
        }

        const resUpload = await ecmFileApi.uploadMultiECMFileReplace(formData);

        if (resUpload.data?.statusCodeValue === 200) {
          const resultFileList = resUpload.data?.body || [];

          const response = await appraisalFilesApi.cancelAppraisalFile({
            ...data,
            appraisalFileId: appraisalFileData.appraisalFileId,
            listDocument: resultFileList.map((el: any) => ({
              ...el,
              commonDocumentId: null,
            })),
          });
          if (response.data.code === 200) {
            message.success("Thay thế hồ sơ thành công");
            setFileList([]);
            formCancel.resetForm();
            mutateAppraisalFileDetail();
            closeModal();
          } else {
            message.error(response.data.message);
          }
        } else {
          message.error("Upload file hồ sơ thay thế thất bại.");
        }
      } catch (error) {
        message.error("Thay thế hồ sơ không thành công");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (appraisalFileData && isOpenModal) {
      if (
        appraisalFileData.replaceByAppraisalFileCode ||
        appraisalFileData.replaceToAppraisalFileCode
      ) {
        formCancel.setValues({
          appraisalFileIdWillBeReplaced:
            appraisalFileData.replaceByAppraisalFileId,
          note: appraisalFileData.cancelNote || "",
          listDocument: appraisalFileData.replaceDocuments || [],
          replaceByAppraisalFileCode:
            appraisalFileData?.replaceByAppraisalFileCode,
          replaceToAppraisalFileCode:
            appraisalFileData?.replaceToAppraisalFileCode,
        });
        setIsDisable(true);
      }
    }
  }, [appraisalFileData, isOpenModal]);

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const labelCol = { xs: 5, sm: 5, md: 8, lg: 8, xl: 8 };
  const wrapperCol = { xs: 19, sm: 19, md: 16, lg: 16, xl: 16 };

  const inputFields: InputFiledParams[] = [
    isDisable
      ? {
          key: 1,
          label:
            appraisalFileData.fileStatus !== APPRAISAL_FILE_STATUS.FORTY_ONE
              ? "HS được thay thế"
              : "Hồ sơ thay thế",
          placeholder: "Hồ sơ thay thế",
          type: INPUT,
          disable: isDisable,
          value:
            appraisalFileData.fileStatus !== APPRAISAL_FILE_STATUS.FORTY_ONE
              ? formCancel.values.replaceByAppraisalFileCode
              : formCancel.values.replaceToAppraisalFileCode,
          labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
          wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
          css: css,
          require: true,
        }
      : {
          key: 1,
          label: "Chọn HS thay thế",
          placeholder: "Chọn hồ sơ thay thế",
          type: SELECT,
          options: listAppraisalFileReplace?.body
            ?.filter(
              (el: any) =>
                el.appraisalFileId !== appraisalFileData.appraisalFileId
            )
            ?.map((item: { reportCode: string; appraisalFileId: string }) => ({
              value: item.appraisalFileId,
              label: item.reportCode,
            })),
          disable: isDisable,
          value: formCancel.values.appraisalFileIdWillBeReplaced,
          error: formCancel.errors.appraisalFileIdWillBeReplaced,
          touched: formCancel.touched.appraisalFileIdWillBeReplaced,
          labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
          wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
          css: css,
          require: true,
          onChange: (value: any) =>
            handleChangeRefuseToPriceData({
              appraisalFileIdWillBeReplaced: value,
            }),
        },
    {
      key: 2,
      label: "Ghi chú",
      placeholder: "Nhập",
      type: TEXT_AREA,
      value: formCancel.values.note,
      disable: isDisable,
      error: formCancel.errors.note,
      touched: formCancel.touched.note,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) =>
        handleChangeRefuseToPriceData({ note: e.target.value }),
    },
  ];

  const uploadProps = {
    multiple: true,
    showUploadList: true,
    onRemove: (file: any) => {
      const newFileList = fileList.filter((item: any) => item.uid !== file.uid);
      setFileList(newFileList);
    },
    beforeUpload: (file: any) => {
      const isPDF = file.type === "application/pdf";
      if (!isPDF) {
        message.error("Chỉ chấp nhận tệp PDF!");
        return false;
      }
      // formCancel.setValues({
      //   ...formCancel.values,
      //   filesLength: 1,
      // });
      setFileList((prev) => [...prev, file]);
      return false;
    },
    fileList,
    accept: ".pdf",
  };

  const onChangeFiles: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
  };

  const handleDisplay = async (ecmId: string, filename: string) => {
    if (ecmId && filename) {
      try {
        const res = await ecmFileApi.downloadECMFileFromNotification({
          ecmId,
          filename,
          mediaType: "application/pdf",
        });

        const pdfUrl = URL.createObjectURL(res.data);
        setPdfUrl(pdfUrl);
      } catch {
        message.error("Xem file thất bại!");
      }
    } else message.error("Xem file thất bại!");
  };

  const handleDownload = async (ecmId: string, filename: string) => {
    if (ecmId && filename) {
      try {
        const res = await ecmFileApi.downloadECMFileFromNotification({
          ecmId,
          filename,
          mediaType: "application/pdf",
        });

        saveAs(res.data, filename);
      } catch {
        message.error("Tải file thất bại");
      }
    } else message.error("Tải file thất bại");
  };

  return (
    <Fragment>
      <Modal
        open={isOpenModal}
        closable={false}
        footer={null}
        onCancel={closeModal}
        className="modalCancel"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Space direction="vertical" size={"small"} className="space-assignment">
          <Row
            justify={"space-between"}
            align={"middle"}
            className="modalCancel-header"
          >
            <CardTitleCustomUpdate title="Hồ sơ được thay thế" />
            <Button
              shape="circle"
              icon={<CloseOutlined />}
              onClick={() => {
                formCancel.resetForm();
                closeModal();
              }}
              size="small"
            />
          </Row>

          <Form labelAlign="left" labelWrap size="small">
            <Row gutter={[24, 8]}>
              <InputFields data={inputFields} />
            </Row>
            <Col xs={css.xs} sm={css.sm} lg={css.lg} md={css.md} xl={css.xl}>
              <Form.Item
                label={
                  <span>
                    <span style={{ opacity: 0.6 }}>
                      File tài liệu <span style={{ color: "red" }}>*</span>
                    </span>
                  </span>
                }
                labelCol={labelCol}
                wrapperCol={wrapperCol}
                name="filesLength"
                colon={false}
                validateStatus={
                  !isDisable && fileList.length === 0 ? "error" : ""
                }
                help={
                  !isDisable && fileList.length === 0
                    ? "Yêu cầu chọn ít nhất 1 file tài liệu"
                    : ""
                }
              >
                {formCancel.values.listDocument.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {formCancel.values.listDocument.map((el) => (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Typography.Text>{el.filename}</Typography.Text>
                        <Button
                          size="small"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownload(el.ecmId, el.filename)}
                        />
                        <Button
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => handleDisplay(el.ecmId, el.filename)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Upload onChange={onChangeFiles} {...uploadProps}>
                    <Button icon={<UploadOutlined />} disabled={isDisable}>
                      Chọn file
                    </Button>
                  </Upload>
                )}
              </Form.Item>
            </Col>

            <Row
              justify={"end"}
              style={{ padding: "8px 0" }}
              className="button-row"
            >
              <Space>
                <ButtonCustom
                  label="Hủy bỏ"
                  onClick={() => {
                    formCancel.resetForm();
                    closeModal();
                  }}
                />
                <ButtonCustom
                  label="Xác nhận"
                  type="primary"
                  loading={loading}
                  onClick={formCancel.submitForm}
                  className="btn-refuse"
                  disabled={isDisable || !fileList?.length}
                />
              </Space>
            </Row>
          </Form>
        </Space>
      </Modal>
      {pdfUrl && (
        <Modal
          className="custom-modal"
          open={pdfUrl ? true : false}
          onCancel={() => {
            setPdfUrl("");
          }}
          footer={false}
          title={
            <Typography.Text className="modal-title">
              Xem chi tiết tài liệu
            </Typography.Text>
          }
        >
          <iframe src={pdfUrl} className="custom-iframe"></iframe>
        </Modal>
      )}
    </Fragment>
  );
};
export default CancelModal;
