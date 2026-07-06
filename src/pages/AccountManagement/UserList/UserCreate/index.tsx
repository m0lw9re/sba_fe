import {
  Button,
  Checkbox,
  DatePickerProps,
  Form,
  Modal,
  Row,
  Space,
  message,
  Image,
  UploadFile,
} from "antd";
import Upload, { RcFile, UploadProps } from "antd/es/upload";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import "pages/AccountManagement/UserList/UserCreate/style.scss";
import { accountApi } from "apis/account";
import { DepartmentType, PositionType, staffCreateType } from "constant/types";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useDepartment, useStaffPosition } from "utils/request";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
import ImageFormContainer from "pages/AppraisalFileDetail/component/PositonAndImg/component/ImagePanelTab/components/ImageDiagram/ImageFormContainer";
import { getBase64 } from "utils";
import { base64ToBlob } from "utils/fileReader";
import { ecmFileApi } from "apis/ecmFile";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
};

const { INPUT, DATE_PICKER, SELECT, INPUT_PASSWORD } = TYPE_FIELD;

const uploadButton = (
  <div>
    <Icons.add />
    <div style={{ marginTop: 8, color: "#2862AF" }}>Upload ảnh chữ ký</div>
  </div>
);

const initialValues: staffCreateType = {
  staffNumber: null,
  assets: "",
  companyBranchId: null,
  dateOfBirth: null,
  daysOff: "",
  departmentId: null,
  gender: null,
  password: "",
  phone: "",
  positionId: null,
  provinces: null,
  staffName: "",
  status: 1,
  username: "",
};

const formSchema = Yup.object().shape({
  staffNumber: Yup.string().nullable().required("Bạn chưa nhập mã nhân viên"),
  username: Yup.string().nullable().required("Bạn chưa nhập tên tài khoản"),
  password: Yup.string().nullable().required("Bạn chưa nhập mật khẩu"),
  positionId: Yup.number()
    .required("Bạn chưa chọn vị trí")
    .typeError("Bạn chưa chọn vị trí"),
  staffName: Yup.string().nullable().required("Bạn chưa nhập tên nhân viên"),
  companyBranchId: Yup.string().nullable().required("Bạn chưa chọn đơn vị"),
  departmentId: Yup.string()
    .nullable()
    .required("Bạn chưa chọn bộ phận/phòng ban"),
});

const UserCreate: React.FC<Props> = ({ isOpen, closeModal }) => {
  const { data, isLoading, error } = useStaffPosition();

  const globalState = useSelector((state: RootState) => state.globalSlice);

  const departmentSWR = useDepartment();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isOpenPreviewImage, setIsOpenPreviewImage] = useState<boolean>(false);
  const [previewList, setPreviewList] = useState<string[]>([]);

  const form = useFormik({
    initialValues: initialValues,
    validateOnChange: false,
    validationSchema: formSchema,
    onSubmit: async (data: staffCreateType) => {
      try {
        let convertedData = { ...data };

        // upload ảnh
        if (fileList.length > 0) {
          const formDataFile = new FormData();
          formDataFile.append("file", fileList[0].originFileObj as RcFile);

          const resFile = await ecmFileApi.uploadECMFile(formDataFile, {
            fileType: "assetImage",
          });

          if (
            resFile.data?.statusCodeValue === 200 &&
            resFile.data?.body?.ecmId
          ) {
            // convert data
            convertedData = {
              ...convertedData,
              mediaType: resFile?.data.body.mediaType,
              ecmId: resFile?.data.body.ecmId,
              filename: resFile?.data.body.filename,
              whoUpload: resFile?.data.body.whoUpload,
              dateUpload: resFile?.data.body.dateUpload,
            };
          } else {
            message.error(
              resFile.data?.body?.message || "Upload ảnh chữ ký thất bại"
            );
          }
        }

        const response = await accountApi.createNew(convertedData);
        if (response.data.code === 200) {
          message.success(
            response?.data?.message || "Tạo thông tin người dùng thành công"
          );
          handleCloseModal();
        } else
          message.error(
            response?.data?.message || "Tạo thông tin người dùng thất bại"
          );
      } catch (error: any) {
        message.error(
          "Lỗi không xác định! Tạo thông tin người dùng không thành công!"
        );
      }
    },
  });

  const handleChange = useCallback(
    (data: any) => {
      form.setValues({ ...form.values, ...data });
    },
    [form.values]
  );

  const handleChangeBirth: DatePickerProps["onChange"] = (date) => {
    handleChange({ dateOfBirth: date ? date.toDate() : undefined });
  };

  const handleChangeVacation: DatePickerProps["onChange"] = (date) => {
    handleChange({ daysOff: date ? date.toDate() : undefined });
  };

  const handleCloseModal = useCallback(() => {
    form.resetForm();
    setFileList([]);
    setPreviewList([]);
    closeModal();
  }, [form]);

  const css = { xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

  const inputs: InputFiledParams[] = [
    {
      key: 1,
      type: INPUT,
      css: css,
      label: "Mã nhân viên",
      size: "small",
      require: true,
      labelCol: labelCol,
      error: form.errors.staffNumber,
      touched: form.touched.staffNumber,
      wrapperCol: wrapperCol,
      value: form.values.staffNumber,
      onChange: (e: any) => {
        handleChange({
          staffNumber: e.target.value.toLocaleLowerCase().trim(),
        });
      },
    },
    {
      key: 1,
      type: INPUT,
      css: css,
      label: "Tài khoản",
      size: "small",
      require: true,
      labelCol: labelCol,
      error: form.errors.username,
      touched: form.touched.username,
      wrapperCol: wrapperCol,
      value: form.values.username,
      onChange: (e: any) => {
        handleChange({ username: e.target.value.toLocaleLowerCase().trim() });
      },
    },
    {
      key: 2,
      type: INPUT_PASSWORD,
      size: "small",
      css: css,
      error: form.errors.password,
      touched: form.touched.password,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      label: "Mật khẩu",
      require: true,
      value: form.values.password,
      onChange: (e: any) => {
        handleChange({ password: e.target.value.toLocaleLowerCase().trim() });
      },
    },
    {
      key: 3,
      type: INPUT,
      label: "Họ tên",
      require: true,
      css: css,
      error: form.errors.staffName,
      touched: form.touched.staffName,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      size: "small",
      value: form.values.staffName,
      onChange: (e: any) => handleChange({ staffName: e.target.value }),
    },
    {
      key: 4,
      type: INPUT,
      label: "Điện thoại",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      size: "small",
      value: form.values.phone,
      onChange: (e: any) => {
        const regex = /^[0-9\b]+$/;
        if (e.target.value === "" || regex.test(e.target.value))
          handleChange({ phone: e.target.value });
      },
    },
    {
      key: 9,
      type: SELECT,
      label: "Đơn vị",
      options: globalState.branchOptions,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      size: "small",
      value: form.values.companyBranchId,
      error: form.errors.companyBranchId,
      touched: form.touched.companyBranchId,
      require: true,
      onChange: (value: number) => handleChange({ companyBranchId: value }),
    },
    {
      key: 10,
      type: SELECT,
      label: "Bộ phận/ Phòng ban",
      options:
        departmentSWR?.data?.data?.map((item: DepartmentType) => {
          return {
            label: item.departmentName,
            value: item.departmentId,
          };
        }) || [],
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      size: "small",
      value: form.values.departmentId,
      error: form.errors.departmentId,
      touched: form.touched.departmentId,
      require: true,
      onChange: (value: number) => handleChange({ departmentId: value }),
    },
    {
      key: 7,
      type: SELECT,
      label: "Vị trí",
      value: form.values.positionId,
      options:
        data?.map((item: PositionType) => {
          return {
            label: item.positionName,
            value: item.positionId,
          };
        }) || [],
      require: true,
      error: form.errors.positionId,
      touched: form.touched.positionId,
      size: "small",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      onChange: (value: number) => handleChange({ positionId: value }),
    },
    {
      key: 5,
      type: DATE_PICKER,
      label: "Ngày sinh",
      size: "small",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      onChange: handleChangeBirth,
    },
    {
      key: 6,
      type: SELECT,
      label: "Giới tính",
      size: "small",
      value: form.values.gender,
      css: css,
      options: [
        {
          label: "Nam",
          value: 1,
        },
        {
          label: "Nữ",
          value: 0,
        },
      ],
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      onChange: (value: number) => handleChange({ gender: value }),
    },
    {
      key: 8,
      type: DATE_PICKER,
      label: "Lịch nghỉ phép",
      size: "small",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      onChange: handleChangeVacation,
    },
  ];

  const handleCheck = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      form.setValues({ ...form.values, status: 1 });
    } else form.setValues({ ...form.values, status: 0 });
  };

  const handleRemoveImage = (uid: string) => {
    const newFileList = fileList.filter((item) => item.uid !== uid);
    setFileList(newFileList);
  };

  const handleOpenPreviewImage = async (file: UploadFile) => {
    setIsOpenPreviewImage(true);
  };

  const handleChangeFile: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
  };

  useEffect(() => {
    try {
      const _tmpPreviewList: string[] = [];
      fileList.map(async (file: any) => {
        let previewUrl = "";
        if (!file.url && !file.preview) {
          const base64 = await getBase64(file.originFileObj as RcFile);
          const blob = base64ToBlob(base64);
          previewUrl = URL.createObjectURL(blob);
        } else {
          previewUrl = file.url || (file.preview as string);
        }
        _tmpPreviewList.push(previewUrl);
      });
      setPreviewList(_tmpPreviewList);
    } catch (error) {
      console.log("error:", error);
    }
  }, [fileList]);

  if (isLoading) return <>...Loading</>;
  if (error) return <>Đã có lỗi xảy ra</>;

  return (
    <Modal
      closeIcon={null}
      open={isOpen}
      onCancel={closeModal}
      footer={null}
      className="user-modal-create-container"
    >
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <Row
          justify={"space-between"}
          className="modal-header"
          align={"middle"}
        >
          <CardTitleCustomUpdate title="Thêm mới tài khoản" />
          <Button
            size="small"
            shape="circle"
            icon={<Icons.close />}
            onClick={handleCloseModal}
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
          </Row>
          <Space size="large" align="center" style={{ marginTop: "16px" }}>
            <span style={{ opacity: 0.6 }}>Ảnh chữ ký</span>
            <>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleChangeFile}
                accept=".png, .jpg, .jpeg"
                itemRender={(originNode, file) => {
                  return (
                    <ImageFormContainer
                      file={file}
                      onPreviewImage={handleOpenPreviewImage}
                      onRemoveImage={handleRemoveImage}
                      // handleReloadImage={() => handleReloadImage(file)}
                      customStyle={{ height: "auto", width: "auto" }}
                    />
                  );
                }}
                // className="diagram-form-upload-image"
                customRequest={(options: any) => {
                  if (options.onSuccess()) {
                    options.onSuccess();
                  }
                  return 1;
                }}
                multiple={false}
                maxCount={1}
              >
                {!fileList || fileList.length >= 1 ? null : uploadButton}
              </Upload>
              <Image.PreviewGroup
                preview={{
                  visible: isOpenPreviewImage,
                  // onChange: (current) => setPreviewImageIndex(current),
                  onVisibleChange(value) {
                    setIsOpenPreviewImage(value);
                  },
                  current: 0,
                }}
                items={previewList.map((item) => item)}
              ></Image.PreviewGroup>
            </>
          </Space>
        </Form>
        <Row
          justify={"space-between"}
          style={{ padding: "0 16px", paddingBottom: "16px" }}
          align={"middle"}
        >
          <Checkbox
            onChange={handleCheck}
            checked={form.values.status ? true : false}
          >
            Hoạt động
          </Checkbox>
          <Space>
            <ButtonCustom
              label="Hủy bỏ"
              size="small"
              onClick={() => {
                form.resetForm();
                closeModal();
              }}
            />
            <ButtonCustom
              onClick={form.submitForm}
              label="Lưu lại"
              type="primary"
              size="small"
              bgColor="rgba(40, 98, 175, 1)"
            />
          </Space>
        </Row>
      </Space>
    </Modal>
  );
};

export default UserCreate;
