import { RepairHistoryType } from "constant/types";
import { TYPE_FIELD } from "constant/enums";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useCallback, useEffect, useState } from "react";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { Form, Row, Upload, Button, Col, UploadProps, message } from "antd";
import Icons from "assets/icons";
import InputFields from "components/InputFields";
import { RepairStatusOptions } from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/RepairWarrantyInfo/config";
import "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/RepairWarrantyInfo/MediaTypeModal/ModalForm.scss";
import ButtonCustom from "components/ButtonCustom";
import type { UploadFile, RcFile } from "antd/es/upload/interface";
import { randomId } from "utils";
import { validLengthInput } from "utils/validate";
import { ecmFileApi } from "apis/ecmFile";
import dayjs from "dayjs";

const { TEXT_AREA, SELECT, DATE_PICKER } = TYPE_FIELD;

const initialValue: RepairHistoryType & {
  filesLength: number;
} = {
  key: "",
  assetId: "",
  dateRepair: "",
  dateUpload: "",
  ecmId: "",
  filename: "",
  mediaType: null,
  note: "",
  repairDocument: "",
  repairHistoryId: null,
  repairStatusId: null,
  whoUpload: "",
  filesLength: 0,
};

const formSchema = Yup.object().shape({
  repairStatusId: Yup.number().typeError("Vui lòng chọn trạng thái thực hiện"),
  note: Yup.string()
    .required("Vui lòng nhập mô tả")
    .test("note", "Chỉ được nhập 1500 ký tự", (val) =>
      validLengthInput(val, 1500)
    ),
  dateRepair: Yup.string().required("Vui lòng chọn ngày thực hiện sửa chữa"),
  // Trường này dùng để validate cho file upload
  filesLength: Yup.number().test(
    "is-not-zero",
    "Vui lòng tải file lên",
    (value) => value !== 0
  ),
});

type Props = {
  onClose: () => void;
  modalType: "add" | "edit" | null;
  onChange: (record: RepairHistoryType, type: "add" | "edit") => void;
  assetId: string;
  record?: any;
  mutate?: any;
};

const ModalForm: React.FC<Props> = ({
  modalType,
  onClose,
  mutate,
  assetId,
  record,
  onChange,
}) => {
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  // Truyền vào component Upload
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Trong trường hợp edit có đổi file upload hay không
  const [isReplaceFile, setIsReplaceFile] = useState<boolean>(false);

  const form = useFormik({
    initialValues: { ...initialValue, assetId: assetId },
    validationSchema: formSchema,
    onSubmit: (data: any): any => {
      const { filesLength, ...dataSubmit } = data;
      if (modalType === "add") {
        handleAddRepairHistory(dataSubmit);
      } else {
        handleEditRepairHistory(dataSubmit);
      }
    },
  });

  // submit cho thêm mới lịch sử sửa chữa
  const handleAddRepairHistory = useCallback(
    async (data: RepairHistoryType) => {
      const formData = new FormData();
      formData.append("file", fileList[0] as RcFile);
      try {
        // loading cho button thêm mới
        setLoadingSubmit(true);
        const responseUploadEcm = await ecmFileApi.uploadECMFile(formData, {
          fileType: "legalDocument",
        });
        if (
          responseUploadEcm.data?.statusCodeValue === 200 &&
          !responseUploadEcm.data?.body?.code
        ) {
          onChange(
            {
              ...data,
              key: randomId(),
              mediaType: responseUploadEcm?.data.body.mediaType,
              ecmId: responseUploadEcm?.data.body.ecmId,
              repairDocument: data?.filename || responseUploadEcm?.data.body.filename,
              whoUpload: responseUploadEcm?.data.body.whoUpload,
              dateUpload: responseUploadEcm?.data.body.dateUpload,
            },
            "add"
          );
          setLoadingSubmit(false);
          // reset lại dữ liệu
          form.resetForm();
          form.setValues({
            ...initialValue,
            assetId: assetId,
            key: randomId(),
          });
          // reset lại list file
          setFileList([]);
          onClose();
        } else {
          setLoadingSubmit(false);
          message.error(responseUploadEcm.data?.body?.message);
        }
        // formCreateNewData.resetForm();
      } catch {
        setLoadingSubmit(false);
        message.error("Lỗi khi upload tài liệu! Vui lòng thử lại!");
      }
    },
    [form.values]
  );

  const handleEditRepairHistory = useCallback(
    async (data: RepairHistoryType) => {
      // Trường hợp thay đổi file Upload
      if (isReplaceFile) {
        const formData = new FormData();
        formData.append("file", fileList[0] as RcFile);
        try {
          // loading cho button lưu lại
          setLoadingSubmit(true);
          const responseUploadEcm = await ecmFileApi.uploadECMFile(formData, {
            fileType: "legalDocument",
          });
          if (
            responseUploadEcm.data?.statusCodeValue === 200 &&
            !responseUploadEcm.data?.body?.code
          ) {
            onChange(
              {
                ...data,
                mediaType: responseUploadEcm?.data.body.mediaType,
                ecmId: responseUploadEcm?.data.body.ecmId,
                // filename: responseUploadEcm?.data.body.filename,
                whoUpload: responseUploadEcm?.data.body.whoUpload,
                dateUpload: responseUploadEcm?.data.body.dateUpload,
                // dateRepair: responseUploadEcm?.data.body.dateRepair,
              },
              "edit"
            );
            setLoadingSubmit(false);
            // reset lại dữ liệu
            form.resetForm();
            form.setValues({
              ...initialValue,
              assetId: assetId,
              key: randomId(),
            });
            // reset lại list file
            setFileList([]);
            onClose();
          } else {
            setLoadingSubmit(false);
            message.error(responseUploadEcm.data?.body?.message);
          }
        } catch {
          message.error("Lỗi khi upload dữ liệu");
        }
      }
      // Trường hợp không upload file khác, chỉ thay đổi các thông tin khác
      else {
        await onChange(
          {
            ...data,
          },
          "edit"
        );
        // reset lại dữ liệu
        form.resetForm();
        form.setValues({
          ...initialValue,
          assetId: assetId,
          key: randomId(),
        });
        // reset lại list file
        setFileList([]);
        onClose();
      }
    },
    [form.values]
  );

  const props: UploadProps = {
    onRemove: () => {
      form.setValues({
        ...form.values,
        filename: "",
        // Khi xóa file thì cho = 0
        filesLength: 0,
      });
      setFileList([]);
    },
    beforeUpload: async (file) => {
      if (file.type !== "application/pdf") {
        message.error("Chỉ chấp nhận file pdf");
        return;
      }
      form.setValues({
        ...form.values,
        filename: file?.name || "",
        // upload file thì cho len =1
        filesLength: 1,
      });
      setFileList([file]);
      // đổi trạng thái là đã thay thế file upload
      setIsReplaceFile(true);
      return false;
    },
    fileList,
    accept: ".pdf",
  };

  useEffect(() => {
    if (modalType === "edit") {
      setIsReplaceFile(false);
      // Trường hợp đã có file upload
      if (record?.filename && record?.ecmId) {
        form.setValues({ ...form.values, ...record, filesLength: 1 });
        setFileList([
          {
            uid: randomId(),
            name: record.filename || "",
            fileName: record.filename || "",
          },
        ]);
      }
      // Trường hợp không có file upload
      else {
        form.setValues({ ...form.values, ...record });
        setFileList([]);
      }
    }
    if (modalType === "add") {
      setIsReplaceFile(false);
      form.setValues({
        ...initialValue,
        assetId: assetId,
        key: randomId(),
      });
      setFileList([]);
    }
  }, [record, modalType]);

  const handleChangeValue = useCallback(
    (data: any) => {
      form.setValues({
        ...form.values,
        ...data,
      });
    },
    [form.values]
  );

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const labelCol = { xs: 5, sm: 5, md: 8, lg: 8, xl: 8 };
  const wrapperCol = { xs: 19, sm: 19, md: 16, lg: 16, xl: 16 };

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Trạng thái thực hiện",
      type: SELECT,
      css: css,
      labelCol: labelCol,
      options: RepairStatusOptions.map((item) => {
        return {
          value: item.value,
          label: item.label,
        };
      }),
      wrapperCol: wrapperCol,
      value: form.values.repairStatusId,
      error: form.errors.repairStatusId,
      touched: form.touched.repairStatusId,
      onChange: (value: number) => {
        handleChangeValue({ repairStatusId: value });
      },
    },
    {
      key: 2,
      label: "Ngày thực hiện sửa chữa",
      type: DATE_PICKER,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.dateRepair ? dayjs(form.values.dateRepair) : null,
      error: form.errors.dateRepair,
      touched: form.touched.dateRepair,
      onChange: (value: any) => {
        handleChangeValue({ dateRepair: dayjs(value).toISOString() });
      },
    },
    {
      key: 3,
      label: "Mô tả",
      type: TEXT_AREA,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.note,
      error: form.errors.note,
      touched: form.touched.note,
      onChange: (e: any) => {
        handleChangeValue({ note: e.target.value });
      },
    },
  ];

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
      labelAlign="left"
      requiredMark={false}
      labelWrap
      colon={false}
      style={{ padding: "0 12px", paddingBottom: "8px" }}
    >
      <Row style={{ width: "100%" }}>
        <InputFields data={inputFields} />
        <Col xs={css.xs} sm={css.sm} lg={css.lg} md={css.md} xl={css.xl}>
          <Form.Item
            className="upload-file-container"
            label="File tài liệu"
            required
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            validateStatus={
              form.touched.filesLength && form.errors.filesLength ? "error" : ""
            }
            help={
              form.touched.filesLength && form.errors.filesLength
                ? form.errors.filesLength.toString()
                : ""
            }
          >
            <Upload {...props} maxCount={1}>
              <Button icon={<Icons.upload />}>Chọn file</Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
      <Row
        justify={"end"}
        style={{ marginTop: "8px", width: "100%", columnGap: "12px" }}
      >
        <ButtonCustom label="Hủy bỏ" onClick={onClose} />
        <ButtonCustom
          htmlType="submit"
          label={modalType === "add" ? "Thêm mới" : "Lưu lại"}
          bgColor="#2862AF"
          type="primary"
          loading={loadingSubmit}
          onClick={() => {
            form.submitForm();
          }}
        />
      </Row>
    </Form>
  );
};

export default ModalForm;
