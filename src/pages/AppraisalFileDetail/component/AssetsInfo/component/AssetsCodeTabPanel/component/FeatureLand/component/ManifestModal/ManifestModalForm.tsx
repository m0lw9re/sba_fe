import { RepairHistoryType } from "constant/types";
import {
  APPENDIX_FILE_TYPE,
  DATE_TIME_FORMAT,
  TYPE_FIELD,
} from "constant/enums";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useCallback, useEffect, useState } from "react";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { Form, Row, Upload, Button, Col, UploadProps, message } from "antd";
import Icons from "assets/icons";
import InputFields from "components/InputFields";
import "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/FeatureLand/component/ManifestModal/ManifestModalForm.scss";
import ButtonCustom from "components/ButtonCustom";
import type { UploadFile, RcFile } from "antd/es/upload/interface";
import { randomId } from "utils";
import { ecmFileApi } from "apis/ecmFile";
import dayjs from "dayjs";
import {
  setListAppendixAssets,
  updateListAppendixAssets,
} from "pages/AppraisalFileDetail/store/appraisalFileDetailSlice";
import { useDispatch } from "react-redux";

const { DATE_PICKER } = TYPE_FIELD;

const initialValue: any & {
  filesLength: number;
} = {
  key: "",
  dateUpload: "",
  ecmId: "",
  filename: "",
  mediaType: null,
  whoUpload: "",
  filesLength: 0,
};

const formSchema = Yup.object().shape({
  dateUpload: Yup.string().required("Vui lòng chọn ngày thực hiện"),
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
  // onChange: (record: RepairHistoryType, type: "add" | "edit") => void;
  record?: any;
};

const ManifestModalForm: React.FC<Props> = ({ modalType, onClose, record }) => {
  const dispatch = useDispatch();

  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  // Truyền vào component Upload
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Trong trường hợp edit có đổi file upload hay không
  const [isReplaceFile, setIsReplaceFile] = useState<boolean>(false);

  const form = useFormik({
    initialValues: { ...initialValue },
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

  // submit cho thêm mới file xem bảng kê
  const handleAddRepairHistory = useCallback(
    async (data: RepairHistoryType) => {
      const formData = new FormData();
      formData.append("file", fileList[0] as RcFile);
      try {
        // loading cho button thêm mới
        setLoadingSubmit(true);
        const responseUploadEcm = await ecmFileApi.uploadECMFile(formData, {
          fileType: "appendix",
        });
        if (
          responseUploadEcm.data?.statusCodeValue === 200 &&
          !responseUploadEcm.data?.body?.code
        ) {
          await dispatch(
            setListAppendixAssets([
              {
                ...data,
                key: randomId(),
                ...responseUploadEcm.data.body,
                type: APPENDIX_FILE_TYPE.MANIFEST,
                dateUpload: data.dateUpload,
              },
            ])
          );
          setLoadingSubmit(false);
          // reset lại dữ liệu
          form.resetForm();
          form.setValues({
            ...initialValue,
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
            fileType: "appendix",
          });
          if (
            responseUploadEcm.data?.statusCodeValue === 200 &&
            !responseUploadEcm.data?.body?.code
          ) {
            await dispatch(
              updateListAppendixAssets({
                ...data,
                ...responseUploadEcm.data.body,
                dateUpload: data.dateUpload,
              })
            );
            setLoadingSubmit(false);
            // reset lại dữ liệu
            // form.resetForm();
            // form.setValues({
            //   // ...initialValue,
            //   // assetId: assetId,
            //   key: randomId(),
            // });
            // // reset lại list file
            // setFileList([]);
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
        await dispatch(
          updateListAppendixAssets({
            ...data,
          })
        );
        // reset lại dữ liệu
        // form.resetForm();
        // form.setValues({
        //   ...initialValue,
        //   key: randomId(),
        // });
        // reset lại list file
        // setFileList([]);
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
      label: "Ngày thực hiện",
      type: DATE_PICKER,
      formatDatetime: DATE_TIME_FORMAT.dateTimeVn,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.dateUpload ? dayjs(form.values.dateUpload) : null,
      error: form.errors.dateUpload,
      touched: form.touched.dateUpload,
      onChange: (value: any) => {
        handleChangeValue({ dateUpload: dayjs(value).toISOString() });
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

export default ManifestModalForm;
