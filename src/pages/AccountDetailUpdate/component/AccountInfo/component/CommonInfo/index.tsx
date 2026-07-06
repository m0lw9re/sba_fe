import {
  Form,
  Row,
  Space,
  DatePickerProps,
  message,
} from "antd";
import { EditSVG } from "assets/images";
import InputFields from "components/InputFields";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import "./style.scss";
import {FC, memo, useCallback, useState} from "react";
import dayjs from "dayjs";
import ButtonCustom from "components/ButtonCustom";
import { accountApi } from "apis/account";
import {FilterAppraisalFileTest, StaffEditType} from "constant/types";
import { useStaffPosition } from "utils/request";
import * as Yup from "yup";
import { disabledEndDate, disabledStartDate } from "utils/date";
import {useFormik} from "formik";
const { INPUT, SELECT, DATE_PICKER } = TYPE_FIELD;

interface InitialValuesType {
  staffName: string;
  staffEmail: string;
  address: string
  phone: string;
  dateOfBirth: string
}

const formSchema = Yup.object().shape({
  staffName: Yup.string().nullable().required("Vui lòng nhập tên"),
  phone: Yup.string()
      .required("Vui lòng nhập số điện thoại")
      .matches(/^[0-9]*$/, "Số điện thoại không hợp lệ"),
  dateOfBirth: Yup.date().nullable().required("Vui lòng chọn ngày sinh"),
  staffEmail: Yup.string()
      .required("Vui lòng nhập Email")
      .matches(
          /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4}$/,
          "Vui lòng nhập đúng định dạng email"
      )
});

const CommonInfo: FC<any> = ({ accountDetail }) => {
  const { data, isLoading, error } = useStaffPosition();
  const [isEditing, setIsEditing] = useState(true);
  const [staffName, setStaffName] = useState(accountDetail?.staffName);
  const [staffPhone, setStaffPhone] = useState(accountDetail?.phone);
  const [staffAddress, setStaffAddress] = useState(accountDetail?.address);
  const [staffEmail, setStaffEmail] = useState(accountDetail?.staffEmail);
  const [staffPosition, setStaffPosition] = useState(accountDetail?.position);
  const [selectedDate, setSelectedDate] = useState(
    dayjs(accountDetail?.dateOfBirth).isValid()
      ? dayjs(accountDetail?.dateOfBirth)
      : dayjs()
  );

  const initialValues: InitialValuesType = {
    ...accountDetail,
    staffName: staffName || accountDetail.staffName,
    phone: staffPhone || accountDetail.phone,
    staffEmail: staffEmail || accountDetail.staffEmail,
    dateOfBirth: selectedDate.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
  };

  const form = useFormik({
    initialValues: initialValues,
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: async (data: InitialValuesType) => {
      try {
          const response = await accountApi.updateStaff(data);
          if (response.data.code === 200) {
            message.success(response.data.message);
          } else message.error(response.data.message);
      } catch (error: any) {
        message.error(error);
      }
    },
  });

  const editFields = () => {
    setIsEditing(!isEditing);
  };

  const saveEditFields = async () => {
    setIsEditing(!isEditing);
    const data: StaffEditType = {
      ...accountDetail,
      companyBranchId: accountDetail.companyBranchId,
      staffName: staffName || accountDetail.staffName,
      username: accountDetail.username,
      phone: staffPhone || accountDetail.phone,
      address: staffAddress || accountDetail.address,
      staffEmail: staffEmail || accountDetail.staffEmail,
      positionId: staffPosition.positionId || accountDetail.positionId,
      dateOfBirth: selectedDate.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
    };
    try {
      const response = await accountApi.updateStaff(data);
      if (response.data.code === 200) {
        message.success(response.data.message);
      } else message.error(response.data.message);
    } catch (error: any) {
      message.error(error);
    }
  };

  const handleChange = useCallback(
      (data: any) => {
        form.setValues({ ...form.values, ...data });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [form.values]
  );

  const handleChangeBirth: DatePickerProps["onChange"] = (date) => {
    handleChange({ dateOfBirth: date ? date.toDate() : undefined });
  };

  const cancelEditFields = () => {
    setIsEditing(!isEditing);
    setStaffName(accountDetail?.staffName || "");
    setStaffPhone(accountDetail?.phone || "");
    setStaffAddress(accountDetail?.address || "");
    setStaffEmail(accountDetail?.staffEmail || "");
    setStaffPosition({
      positionId: accountDetail.position.positionId,
      positionName: accountDetail.position.positionName,
    });
    setSelectedDate(dayjs(accountDetail?.dateOfBirth));
  };

  const handleInputChange = (e: any) => {
    setStaffAddress(e.target.value);
  };

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Tên nhân viên",
      type: INPUT,
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: form.values.staffName,
      error: form.errors.staffName,
      touched: form.touched.staffName,
      require: true,
      disable: isEditing,
      onChange: (e: any) => {
        const updatedValues = {
          staffName: e.target.value,
        };
        handleChange(updatedValues);
      },
    },
    {
      key: 2,
      label: "Mã chức danh",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT,
      value: staffPosition.positionId,
      disable: true,
      onChange: (e: any) =>
        setStaffPosition((prevStaffPosition: any) => ({
          ...prevStaffPosition,
          positionId: e.target.value,
        })),
    },
    {
      key: 3,
      label: "Chức danh",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      options: data?.map((position: any) => ({
        label: position.positionName,
        value: position.positionId,
      })),
      value: staffPosition.positionId,
      disable: true,
      onChange: (value: any, label: any) => {
        setStaffPosition((prevStaffPosition: any) => ({
          ...prevStaffPosition,
          positionId: value,
          positionName: label.label,
        }));
      },
    },
    {
      key: 4,
      label: "Ngày sinh",
      css: css,
      type: DATE_PICKER,
      formatDatetime: DATE_TIME_FORMAT.day,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: form.values.dateOfBirth ? dayjs(form.values.dateOfBirth) : null,
      error: form.errors.dateOfBirth,
      touched: form.touched.dateOfBirth,
      require: true,
      disabledDate: (value: any) => {
        if (form.values.dateOfBirth) {
          return disabledStartDate(value, form.values.dateOfBirth);
        }
      },
      onChange: handleChangeBirth,
      disable: isEditing,
    },
    {
      key: 5,
      label: "Email",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT,
      value: form.values.staffEmail,
      error: form.errors.staffEmail,
      touched: form.touched.staffEmail,
      require: true,
      disable: isEditing,
      onChange: (e: any) => {
        const updatedValues = {
          staffEmail: e.target.value,
        };
        handleChange(updatedValues);
      },
    },
    {
      key: 6,
      label: "Số điện thoại",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT,
      value: form.values.phone,
      error: form.errors.phone,
      touched: form.touched.phone,
      require: true,
      disable: isEditing,
      onChange: (e: any) => {
        if (e.target.value.length > 15) return;
        const regex = /^[0-9]*$/;
        if (!regex.test(e.target.value)) return;
        handleChange({phone: e.target.value});
      },
    },
    {
      key: 7,
      label: "Địa chỉ",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT,
      value: form.values.address,
      disable: isEditing,
      onChange: (e: any) => {
        const updatedValues = {
          address: e.target.value,
        };
        handleChange(updatedValues);
      },
    },
  ];

  return (
    <Space
      direction="vertical"
      style={{ width: "100%" }}
      size={"small"}
      className="commonInfo-wrapper"
    >
      <Form labelAlign="left" labelWrap size="small">
        <Row gutter={[24, 4]}>
          <InputFields data={inputFields} />
        </Row>
      </Form>
      <Row justify={"end"}>
        {isEditing && (
          <ButtonCustom
            onClick={editFields}
            label="Chỉnh sửa"
            icon={<EditSVG />}
            size="small"
          />
        )}

        {!isEditing && (
          <Space>
            <ButtonCustom
              label="Lưu"
              type="primary"
              size="small"
              bgColor="#2862AF"
              className="btn-fields__edit"
              onClick={form.submitForm}
            />
            <ButtonCustom
              label="Hủy"
              danger
              type="primary"
              size="small"
              className="btn-fields__del"
              onClick={cancelEditFields}
            />
          </Space>
        )}
      </Row>
    </Space>
  );
};

export default memo(CommonInfo);
