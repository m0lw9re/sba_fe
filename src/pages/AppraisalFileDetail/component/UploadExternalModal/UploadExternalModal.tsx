import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Row, Space, message } from "antd";
import Upload, { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import "./style.scss";
import { ecmFileApi } from "apis/ecmFile";
import { sendApprovalAPI } from "apis/sendApproval";
import { useParams } from "react-router-dom";

const { INPUT_NUMBER } = TYPE_FIELD;

type Props = {
  open: boolean;
  onClose: () => void;
  onOk: () => void;
  assetLevelTwoId?: number;
};
type ReportUploadType = {
  totalValue: number | null;
};

const formSchema = Yup.object().shape({
  totalValue: Yup.number().nullable().required("Phải nhập giá trị tài sản"),
});

const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
const cssLabel = { xs: 8, sm: 8, md: 8, lg: 8, xl: 8 };
const cssInput = { xs: 16, sm: 16, md: 16, lg: 16, xl: 16 };

const UploadExternalModal = (props: Props) => {
  const { open, onClose, onOk, assetLevelTwoId } = props;

  const { id } = useParams<{ id: string }>();

  const [fileList, setFileList] = useState<{
    report: UploadFile[];
    inform: UploadFile[];
    result: UploadFile[];
  }>({ report: [], inform: [], result: [] });

  const [uploading, setUploading] = useState<boolean>(false);

  const form = useFormik({
    initialValues: {
      // totalArea: 0,
      totalValue: null,
    } as ReportUploadType,
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: async (data: ReportUploadType) => {
      try {
        if (
          fileList.report.length === 0 ||
          fileList.inform.length === 0 ||
          fileList.result.length === 0
        ) {
          return message.error("Vui lòng chọn đầy đủ 3 loại file!");
        }

        if (!id) {
          return message.error("Không tìm thấy ID hồ sơ!");
        }

        setUploading(true);

        const formData = new FormData();
        let dataTransfer: {
          customReportFileInfoId: null | number;
          reportEcmId: string | null;
          resultEcmId: string | null;
          informEcmId: string | null;
          assetType: number | null | undefined;
          fileReportName: string | null;
          fileResultName: string | null;
          fileInformName: string | null;
          totalValue: number | null;
        };
        // formData.append('appraisalFileId', id!);
        formData.append("files", fileList.report[0] as RcFile);
        formData.append("files", fileList.result[0] as RcFile);
        formData.append("files", fileList.inform[0] as RcFile);
        const res = await ecmFileApi.uploadMultiFile(formData, "appendix");

        if (res.data?.statusCodeValue === 200 && res.data?.body) {
          const arrFile = [...res.data.body];
          dataTransfer = {
            customReportFileInfoId: null,
            reportEcmId: arrFile?.[0]?.ecmId || null,
            resultEcmId: arrFile?.[1]?.ecmId || null,
            informEcmId: arrFile?.[2]?.ecmId || null,
            assetType: assetLevelTwoId,
            fileReportName: arrFile?.[0]?.filename || null,
            fileResultName: arrFile?.[1]?.filename || null,
            fileInformName: arrFile?.[2]?.filename || null,
            totalValue: data.totalValue,
          };

          const uploadReport = await sendApprovalAPI.uploadReportFile(
            id,
            dataTransfer
          );
          if (uploadReport.data?.code === 200) {
            message.success(`Upload ngoài thành công`);
            onClose();
            onOk();
          } else {
            message.error(
              `Upload ngoài thất bại, ${uploadReport.data?.message}`
            );
          }
        } else {
          message.error(`Tải file upload ngoài thất bại`);
        }
      } catch (error) {
        message.error("Lỗi không xác định! Upload ngoài không thành công!");
      } finally {
        setUploading(false);
      }
    },
  });

  const handleCloseModal = () => {
    form.resetForm();
    setFileList({ report: [], inform: [], result: [] });
    onClose();
  };

  const uploadPropsReport: UploadProps = {
    multiple: false,
    fileList: fileList.report,
    listType: "text",
    maxCount: 1,
    accept: ".pdf",
    beforeUpload: (file) => {
      setFileList({ ...fileList, report: [file] });
      return false;
    },
    onRemove: () => {
      setFileList({ ...fileList, report: [] });
    },
  };

  const uploadPropsInform: UploadProps = {
    multiple: false,
    fileList: fileList.inform,
    listType: "text",
    maxCount: 1,
    accept: ".pdf",
    beforeUpload: (file) => {
      setFileList({ ...fileList, inform: [file] });
      return false;
    },
    onRemove: () => {
      setFileList({ ...fileList, inform: [] });
    },
  };

  const uploadPropsResult: UploadProps = {
    multiple: false,
    fileList: fileList.result,
    listType: "text",
    maxCount: 1,
    accept: ".pdf",
    beforeUpload: (file) => {
      setFileList({ ...fileList, result: [file] });
      return false;
    },
    onRemove: () => {
      setFileList({ ...fileList, result: [] });
    },
  };

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Tổng giá trị tài sản làm tròn (đồng)",
      type: INPUT_NUMBER,
      currencable: true,
      isRounded: true,
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.totalValue,
      require: true,
      min: 0,
      onChange: (value: number) =>
        form.setValues({ ...form.values, totalValue: value }),
      error: form.errors.totalValue ? form.errors.totalValue : "",
      touched: form.touched.totalValue,
    },
  ];
  return (
    <Modal
      open={open}
      onCancel={handleCloseModal}
      footer={null}
      closable={false}
      className="upload-external-modal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="upload-external-modal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate
            title="Upload tờ trình, Thông báo, Kết quả"
            color="#FFF"
          />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={handleCloseModal}
            size="small"
          />
        </Row>
        <div style={{ margin: "4px 8px", gap: "0.5rem", display: "flex" }}>
          <span style={{ width: "182px", opacity: 0.6 }}>
            File Tờ trình <span style={{ color: "red" }}>*</span>
          </span>
          <Upload {...uploadPropsReport}>
            <Button size="small" icon={<UploadOutlined />}>
              Chọn file
            </Button>
          </Upload>
        </div>
        <div style={{ margin: "4px 8px", gap: "0.5rem", display: "flex" }}>
          <span style={{ width: "182px", opacity: 0.6 }}>
            File Thông báo KQĐG <span style={{ color: "red" }}>*</span>
          </span>
          <Upload {...uploadPropsInform}>
            <Button size="small" icon={<UploadOutlined />}>
              Chọn file
            </Button>
          </Upload>
        </div>
        <div style={{ margin: "4px 8px", gap: "0.5rem", display: "flex" }}>
          <span style={{ width: "182px", opacity: 0.6 }}>
            File Kết quả thẩm định giá <span style={{ color: "red" }}>*</span>
          </span>
          <Upload {...uploadPropsResult}>
            <Button size="small" icon={<UploadOutlined />}>
              Chọn file
            </Button>
          </Upload>
        </div>
        <div style={{ margin: "0.75rem 0" }}>
          <Form labelAlign="left" labelWrap size="small">
            <InputFields data={inputFields} />
          </Form>
        </div>

        <Row
          justify={"end"}
          style={{ padding: "0 12px", marginBottom: "12px" }}
          className="button-row"
        >
          <Space>
            <ButtonCustom label="Hủy bỏ" onClick={handleCloseModal} />
            <ButtonCustom
              loading={uploading}
              label="Lưu"
              type="primary"
              onClick={() => {
                form.submitForm();
              }}
              bgColor="rgba(40, 98, 175, 1)"
            />
          </Space>
        </Row>
      </Space>
    </Modal>
  );
};

export default UploadExternalModal;
