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
import { FEE_LIST_DOCUMENT, FEE_LIST_DOCUMENT_OPTIONS } from "constant/common";
import TableCustom from "components/TableCustom";
import { ColumnsType } from "antd/es/table";
import { formatDateWithHour, randomId } from "utils";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { RcFile } from "antd/es/upload";
import { ecmFileApi } from "apis/ecmFile";
import saveAs from "file-saver";

export type DataPropsListDocumentType = {
  index?: number | null;
  feeContentId: number | null;
  listDocuments: any[];
  disabled: boolean;
};

type Props = {
  isOpen: boolean;
  dataListDocument: DataPropsListDocumentType;
  closeModal: () => void;
  updateData: any;
  isDetail: boolean;
};

const { SELECT, DATE_PICKER } = TYPE_FIELD;

type formData = FeeListDocumentItemType & {
  filesLength: number;
};

const initialValues: formData = {
  type: 11,
  dateUpload: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
  filesLength: 0,
};

const formSchema = Yup.object().shape({
  type: Yup.number().nullable().required("Vui lòng chọn loại tài liệu"),

  dateUpload: Yup.string()
    .required("Vui lòng chọn ngày tải lên!")
    .typeError("Vui lòng chọn ngày tải lên!"),

  filesLength: Yup.number().test(
    "is-not-zero",
    "Bạn chưa tải file lên",
    (value) => value !== 0
  ),
});

const ModalListDocument: React.FC<Props> = ({
  isOpen,
  closeModal,
  dataListDocument,
  updateData,
  isDetail,
}) => {
  const [dataSource, setDataSource] = useState<Array<FeeListDocumentItemType>>(
    []
  );

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [isReplaceFile, setIsReplaceFile] = useState<boolean>(false);

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    if (dataListDocument && isOpen)
      setDataSource(
        dataListDocument.listDocuments.map((item) => ({
          ...item,
          key: randomId(),
        }))
      );
  }, [dataListDocument, isOpen]);

  const form = useFormik({
    initialValues: initialValues,
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: async (data: formData) => {
      try {
        setIsUploading(true);
        if (!data.ecmId) {
          await handleUploadFileEcmCreate();
        } else {
          await handleUploadFileEcmUpdate();
        }
        setIsUploading(false);
      } catch (error) {
        message.error("Ghi nhận nội bộ thất bại!");
        setIsUploading(false);
      }
    },
  });

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
          type: form.values.type,
          mediaType: responseUploadEcm?.data.body.mediaType,
          ecmId: responseUploadEcm?.data.body.ecmId,
          filename: responseUploadEcm?.data.body.filename,
          whoUpload: responseUploadEcm?.data.body.whoUpload,
          // dateUpload: responseUploadEcm?.data.body.dateUpload,
        };
        setDataSource([...dataSource, { ...newDataFile }]);
        handleResetForm();
      } else message.error(responseUploadEcm.data?.body?.message);
    } catch {
      message.error("Lỗi khi upload tài liệu! Vui lòng thử lại!");
    }
  };

  const handleUploadFileEcmUpdate = async () => {
    const tmpDataSource = [...dataSource];
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
          const { filesLength, ...rest } = form.values;
          const newDataFile: FeeListDocumentItemType = {
            ...rest,
            mediaType: responseUploadEcm?.data.body.mediaType,
            // appraisalFileId: id,
            ecmId: responseUploadEcm?.data.body.ecmId,
            filename: responseUploadEcm?.data.body.filename,
            whoUpload: responseUploadEcm?.data.body.whoUpload,
            // dateUpload: responseUploadEcm?.data.body.dateUpload,
          };
          const foundIndex = tmpDataSource.findIndex(
            (item) => item.key === form.values.key
          );
          if (foundIndex !== -1) {
            tmpDataSource[foundIndex] = { ...newDataFile };
            setDataSource([...tmpDataSource]);
          }
          handleResetForm();
        } else message.error(responseUploadEcm.data?.body?.message);
      } catch {
        message.error("Lỗi khi upload file tài liệu!");
      }
    } else {
      const { filesLength, ...rest } = form.values;
      const newDataFile: FeeListDocumentItemType = {
        ...rest,
      };
      const foundIndex = tmpDataSource.findIndex(
        (item) => item.key === form.values.key
      );
      if (foundIndex !== -1) {
        tmpDataSource[foundIndex] = { ...newDataFile };
        setDataSource([...tmpDataSource]);
      }
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
      setIsReplaceFile(true);
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
    setIsReplaceFile(false);
  };

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

  const renderTypeDocument = (type: number) => {
    if (type === FEE_LIST_DOCUMENT.TO_TRINH_GNNB)
      return FEE_LIST_DOCUMENT.TO_TRINH_GNNB_LABEL;
    else if (type === FEE_LIST_DOCUMENT.TO_TRINH_GIAM_PHI)
      return FEE_LIST_DOCUMENT.TO_TRINH_GIAM_PHI_LABEL;
    else if (type === FEE_LIST_DOCUMENT.TO_TRINH_DONG_Y_PHI)
      return FEE_LIST_DOCUMENT.TO_TRINH_DONG_Y_PHI_LABEL;
    else return "";
  };

  const handleSave = () => {
    updateData({
      ...dataListDocument,
      listDocuments: dataSource.map((item) => {
        const tmpObj = {
          ...item,
        };
        delete tmpObj.key;
        return tmpObj;
      }),
    });
    handleModalClose();
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

  const handleRemoveRow = (index: number) => {
    const tmpArr = [...dataSource];
    tmpArr.splice(index, 1);
    setDataSource(tmpArr);
  };

  const inputs: InputFiledParams[] = [
    {
      key: 1,
      label: "Loại tài liệu",
      type: SELECT,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      value: form.values.type,
      require: true,
      error: form.errors.type,
      touched: form.touched.type,
      options: isDetail
        ? FEE_LIST_DOCUMENT_OPTIONS
        : [
            {
              value: FEE_LIST_DOCUMENT.TO_TRINH_GIAM_PHI,
              label: FEE_LIST_DOCUMENT.TO_TRINH_GIAM_PHI_LABEL,
            },
          ],
      onChange: (e: any) => {
        handleChange({ type: e });
      },
    },
    {
      key: 3,
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
  ];

  const columns: ColumnsType<FeeListDocumentItemType> = [
    {
      key: "STT",
      title: "STT",
      width: "3%",
      align: "center",
      render: (value, record, index) => index + 1,
    },
    {
      key: "type",
      title: "Loại tài liệu",
      dataIndex: "type",
      align: "left",
      render: (type: number, record) => renderTypeDocument(type),
    },
    {
      key: "filename",
      title: "Tên file",
      dataIndex: "filename",
      align: "left",
      render: (filename: string, record: any) => {
        return (
          <Tooltip title="Click để xem trước">
            <Typography.Link
              onClick={() => handleDisplay(record.ecmId, record.filename)}
            >
              {filename}
            </Typography.Link>
          </Tooltip>
        );
      },
    },
    {
      key: "dateUpload",
      title: "Ngày đưa lên",
      align: "center",
      dataIndex: "dateUpload",
      render: (dateUpload: string) => (
        <>{dateUpload ? formatDateWithHour(dateUpload) : null}</>
      ),
    },
    {
      key: "action",
      dataIndex: "",
      align: "center",
      width: "50px",
      render: (_: any, record: any, index: number) => (
        <ListButtonActionUpdate
          editFunction={() => {
            setIsReplaceFile(false);
            form.setValues({
              ...form.values,
              ...record,
              filesLength: 1,
            });
            setFileList([
              {
                uid: randomId(),
                name: record.filename || "",
                fileName: record.filename || "",
              },
            ]);
          }}
          removeFunction={() => handleRemoveRow(index)}
          downloadFunction={() => handleDownload(record.ecmId, record.filename)}
        />
      ),
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
            <CardTitleCustomUpdate title="Upload tờ trình giảm phí" />
            <Button
              size="small"
              shape="circle"
              icon={<Icons.close />}
              onClick={handleModalClose}
            />
          </Row>
          <Form
            labelAlign="left"
            labelWrap
            size="small"
            style={{ padding: "0 16px" }}
          >
            <Row gutter={[24, 16]} align={"middle"}>
              <InputFields data={inputs} />
              <Col xs={css.xs} sm={css.sm} lg={css.lg} md={css.md} xl={css.xl}>
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
                  <Upload {...props} maxCount={1}>
                    <Button icon={<Icons.upload />}>Chọn file</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row
              justify={"end"}
              align={"middle"}
              style={{ marginTop: "0.5rem" }}
            >
              <Space>
                <ButtonCustom
                  label="Làm mới"
                  size="small"
                  onClick={handleResetForm}
                />
                <ButtonCustom
                  onClick={form.submitForm}
                  label={form.values.key ? "Chỉnh sửa" : "Thêm"}
                  type="primary"
                  size="small"
                  bgColor="rgba(40, 98, 175, 1)"
                  loading={isUploading}
                />
              </Space>
            </Row>
          </Form>
          <Divider style={{ margin: 0 }} />
          <TableCustom
            style={{ padding: "0 0.5rem" }}
            bordered
            columns={columns}
            dataSource={dataSource || []}
            onLimitChange={() => {}}
            onPageChange={() => {}}
            limit={100}
            page={1}
            total={0}
            isLoading={false}
          />
          <Row
            justify={"end"}
            align={"middle"}
            style={{ padding: "0 0.5rem", marginBottom: "1rem" }}
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
                onClick={handleSave}
                label="Lưu"
                type="primary"
                size="small"
                bgColor="rgba(40, 98, 175, 1)"
                disabled={dataListDocument.disabled}
              />
            </Space>
          </Row>
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

export default ModalListDocument;
