/* eslint-disable react-hooks/exhaustive-deps */
import { TYPE_FIELD, DATE_TIME_FORMAT } from "constant/enums";
import React, { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Button,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  Space,
  Tooltip,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import { InputFiledParams } from "constants/types/Form_Field_type";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import Icons from "assets/icons";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import * as Yup from "yup";
import dayjs from "dayjs";
import "./style.scss";
import { FeeListDocumentItemType } from "constant/types/appraisalFilesDetail";
import {
  APPRAISAL_FILE_STATUS,
  BUTTON_CODES,
  FEE_LIST_DOCUMENT,
} from "constant/common";
import TableCustom from "components/TableCustom";
import { ColumnsType } from "antd/es/table";
import { formatDateWithHour, randomId } from "utils";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { RcFile } from "antd/es/upload";
import { ecmFileApi } from "apis/ecmFile";
import saveAs from "file-saver";
import { useGetInforTBKQ } from "utils/request";
import { appraisalFilesApi } from "apis/appraisalFiles";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  type: number;

  appraisalFileData: {
    appraisalFileId: string;
    appraisalFileStatus: number;
    sendToEmail: any;
  };
};

const { INPUT, TEXT_AREA, DATE_PICKER } = TYPE_FIELD;

type formData = FeeListDocumentItemType & {
  filesLength: number;
};

const initialValues: formData = {
  type: 5,
  dateUpload: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
  documentContent: "",
  filesLength: 0,
};

const formSchema = Yup.object().shape({
  type: Yup.number().nullable().required("Vui lòng chọn loại tài liệu"),
  documentContent: Yup.string().required("Không được để trống nội dung"),
  dateUpload: Yup.string()
    .required("Vui lòng chọn ngày tải lên!")
    .typeError("Vui lòng chọn ngày tải lên!"),

  filesLength: Yup.number().test(
    "is-not-zero",
    "Bạn chưa tải file lên",
    (value) => value !== 0
  ),
});

const ModalTBKQ: React.FC<Props> = ({
  isOpen,
  closeModal,
  type,
  appraisalFileData,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [pdfUrl, setPdfUrl] = useState<string>("");

  const { data: inforTBKQ, error } = useGetInforTBKQ(
    appraisalFileData.appraisalFileId,
    type
  );

  const form = useFormik({
    initialValues: initialValues,
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: async (data: formData) => {
      try {
        setIsUploading(true);

        const fileObj = await handleUploadFileEcmCreate();
        if (!fileObj) {
          message.error("Upload file không thành công.");
          return;
        }

        //call api POST
        const res = await appraisalFilesApi.sendTBKQ({
          appraisalFileId: appraisalFileData.appraisalFileId,
          dateSendEmail: form.values.dateUpload,
          type: type,
          listDocument: [fileObj],
        });

        if (res.data.code === 200) {
          message.success("Gửi thông báo, kết quả thành công");
          handleModalClose();
        } else {
          message.error(res.data?.message || "Gửi thông báo, kết quả thất bại");
        }
        setIsUploading(false);
      } catch (error) {
        message.error("Lỗi không xác định! Gửi thông báo, kết quả thất bại");
        setIsUploading(false);
      }
    },
  });

  useEffect(() => {
    // Lấy 1 bản ghi từ mảng tương ứng với type
    if (isOpen && inforTBKQ) {
      const foundObj = inforTBKQ?.data?.listDocument?.find(
        (item: any) => item.type === type
      );
      if (foundObj) {
        form.setValues({ ...form.values, ...foundObj });
      }
    }
  }, [isOpen, inforTBKQ]);

  useEffect(() => {
    if (type) {
      form.setValues({ ...form.values, type: type });
    }
  }, [type]);

  const handleUploadFileEcmCreate = async () => {
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
        const { filesLength, ...rest } = form.values;
        const newDataFile: FeeListDocumentItemType = {
          ...rest,
          key: randomId(),
          type: type,
          mediaType: responseUploadEcm?.data.body.mediaType,
          ecmId: responseUploadEcm?.data.body.ecmId,
          filename: responseUploadEcm?.data.body.filename,
          whoUpload: responseUploadEcm?.data.body.whoUpload,
          dateUpload: responseUploadEcm?.data.body.dateUpload,
        };
        return newDataFile;
      } else {
        message.error(responseUploadEcm.data?.body?.message);
        return null;
      }
    } catch {
      message.error("Lỗi khi upload tài liệu! Vui lòng thử lại!");
      return null;
    }
  };

  const props: UploadProps = {
    onRemove: () => {
      form.setFieldValue("filesLength", 0);
      setFileList([]);
    },
    beforeUpload: async (file) => {
      // checkFileSizeBeforeUpload(file, FILE_SIZE_CONFIG.FILE);

      form.setValues({
        ...form.values,
        mediaType: file?.type,
        filesLength: 1,
      });
      setFileList([file]);
      return false;
    },
    fileList,
    accept: ".pdf",
  };

  const handleModalClose = () => {
    handleResetForm();
    closeModal();
  };

  const handleChange = useCallback(
    (data: any) => {
      form.setValues({ ...form.values, ...data });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.values]
  );

  const handleResetForm = () => {
    form.resetForm();
    setFileList([]);
  };

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

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

  const genTitle = () => {
    if (type === FEE_LIST_DOCUMENT.FILE_THONG_BAO) return "Thông báo";
    else if (type === FEE_LIST_DOCUMENT.FILE_KET_QUA) return "Kết quả";
    else return "Thông báo, kết quả";
  };

  const disabledForStatus = () => {
    if (
      type === FEE_LIST_DOCUMENT.FILE_THONG_BAO &&
      appraisalFileData.appraisalFileStatus === APPRAISAL_FILE_STATUS.NINETEEN
    )
      return false;
    if (
      type === FEE_LIST_DOCUMENT.FILE_KET_QUA &&
      appraisalFileData.appraisalFileStatus === APPRAISAL_FILE_STATUS.TWENTY
    ) {
      if (!appraisalFileData.sendToEmail) return false;
    }

    return true;
  };

  const inputs: InputFiledParams[] = [
    {
      key: 1,
      type: DATE_PICKER,
      label: "Ngày upload",
      formatDatetime: DATE_TIME_FORMAT.momentTime,
      placeholder: "DD/MM/YYYY - hh:mm:ss",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      require: true,
      showTime: true,
      value: form.values.dateUpload ? dayjs(form.values.dateUpload) : null,
      error: form.errors.dateUpload,
      touched: form.touched.dateUpload,
      onChange: (value: any) =>
        handleChange({
          dateUpload: value
            ? dayjs(value).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
            : null,
        }),
    },
    {
      key: 2,
      label: "Nội dung",
      type: TEXT_AREA,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      value: form.values.documentContent,
      require: true,
      error: form.errors.documentContent,
      touched: form.touched.documentContent,
      maxLength: 500,
      onChange: (e: any) => {
        handleChange({ documentContent: e.target.value });
      },
    },
    {
      key: 3,
      label: "Người upload",
      type: INPUT,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      value: form.values.whoUpload,
      require: true,
    },
  ];

  return (
    <>
      <Modal
        closeIcon={null}
        open={isOpen}
        onCancel={handleModalClose}
        footer={null}
        className="user-modal-edit-container"
      >
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          <Row
            justify={"space-between"}
            className="modal-header"
            align={"middle"}
          >
            <CardTitleCustomUpdate title={genTitle()} />
            <Button
              size="small"
              shape="circle"
              icon={<Icons.close />}
              onClick={handleModalClose}
            />
          </Row>
          {error ? (
            <span>Lỗi khi lấy thông tin</span>
          ) : (
            <Form
              labelAlign="left"
              labelWrap
              size="small"
              style={{ padding: "0 16px" }}
            >
              <Row gutter={[24, 16]} align={"middle"}>
                <InputFields
                  data={inputs.filter((el) =>
                    form.values.ecmId ? el.key : Number(el.key) < 3
                  )}
                />
                <Col
                  xs={css.xs}
                  sm={css.sm}
                  lg={css.lg}
                  md={css.md}
                  xl={css.xl}
                >
                  <Form.Item
                    colon={false}
                    label={
                      <>
                        <span style={{ opacity: 0.6, marginRight: "4px" }}>
                          File tài liệu{" "}
                          <span style={{ color: "#F25B60" }}>*</span>
                        </span>
                      </>
                    }
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                    validateStatus={
                      form.touched.filesLength && form.errors.filesLength
                        ? "error"
                        : ""
                    }
                    help={form.touched.filesLength && form.errors.filesLength}
                    style={{ margin: 0 }}
                  >
                    {form.values.ecmId ? (
                      <Space>
                        <span>{form.values.filename}</span>
                        <ListButtonActionUpdate
                          downloadFunction={() =>
                            handleDownload(
                              form.values.ecmId || "",
                              form.values.filename || ""
                            )
                          }
                          viewFunction={() =>
                            handleDisplay(
                              form.values.ecmId || "",
                              form.values.filename || ""
                            )
                          }
                        />
                      </Space>
                    ) : (
                      <Upload {...props} maxCount={1}>
                        <Button icon={<Icons.upload />}>Chọn file</Button>
                      </Upload>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row
                justify={"end"}
                align={"middle"}
                style={{ margin: "1rem 0" }}
              >
                <Space>
                  <ButtonCustom
                    label="Huỷ bỏ"
                    size="small"
                    onClick={() => {
                      handleModalClose();
                    }}
                  />
                  <ButtonCustom
                    loading={isUploading}
                    onClick={form.submitForm}
                    label="Xác nhận"
                    type="primary"
                    size="small"
                    bgColor="rgba(40, 98, 175, 1)"
                    disabled={
                      !form.values.ecmId && !disabledForStatus() ? false : true
                    }
                    code={BUTTON_CODES.ctdtcn_tbkq_sua}
                  />
                </Space>
              </Row>
            </Form>
          )}
        </Space>
      </Modal>

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
    </>
  );
};

export default ModalTBKQ;
