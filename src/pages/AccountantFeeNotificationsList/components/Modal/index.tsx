import { Button, Checkbox, Form, Modal, Row, Space } from "antd";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import React, { useCallback, useState } from "react";
import "./style.scss";
import { CreateAccountantFeeNotificationsUpdate } from "constant/types";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { DATE_TIME_FORMAT } from "constant/enums";
import dayjs from "dayjs";
import type { DatePickerProps } from "antd";
import AssetInfor from "./components/AssetInfor";
import { FilterAccountantFeeNotificationsUpdate } from "constant/types";
const { INPUT, SELECT, DATE_PICKER } = TYPE_FIELD;

type Props = {
  isOpen: boolean;
  closeModal: () => void;
};

const initialValues: CreateAccountantFeeNotificationsUpdate = {
  soTB: null,
  ngayTB: null,
  nguoiLap: null,
  soBT: null,
  trangThai: null,
  soCTGoc: null,
  object: null,
  fullName: null,
  email: null,
  address: null,
  nature: null,
  taxCode: null,
  status: 1,
  description: "",
  type: "",
  expentName: "",
  expentId: "",
};

const Create: React.FC<Props> = ({ isOpen, closeModal }) => {
  const form = useFormik({
    initialValues: initialValues,
    onSubmit: async (data: CreateAccountantFeeNotificationsUpdate) => {},
  });

  const handleChange = useCallback(
    (data: any) => {
      form.setValues({ ...form.values, ...data });
    },
    [form.values]
  );

  const handleCloseModal = useCallback(() => {
    closeModal();
    form.resetForm();
  }, [form]);

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };
  const inputs: InputFiledParams[] = [
    {
      key: 1,
      label: "Ngày TB",
      span: 12,
      type: DATE_PICKER,
      css: css,
      require: true,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: form.values.ngayTB ? dayjs(form.values.ngayTB) : null,
      onChange: (value: DatePickerProps["value"]) =>
        handleChange({ ...form.values, ngayTB: dayjs(value).valueOf() }),
    },
    {
      key: 2,
      type: INPUT,
      label: "Số CT gốc",
      span: 12,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      require: true,
      value: form.values.soCTGoc,
      onChange: (e: any) => {
        handleChange({ soCTGoc: e.target.value });
      },
    },
    {
      key: 3,
      type: INPUT,
      label: "Đối tượng",
      require: true,
      span: 12,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.object,
      onChange: (value: string) => handleChange({ object: value }),
    },
    {
      key: 4,
      type: INPUT,
      label: "Họ tên",
      span: 12,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.fullName,
      onChange: (value: string) => handleChange({ fullName: value }),
    },
    {
      key: 5,
      type: INPUT,
      label: "Địa chỉ",
      span: 24,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.fullName,
      onChange: (value: string) => handleChange({ fullName: value }),
    },
    {
      key: 6,
      type: INPUT,
      label: "Mã số thuế",
      span: 12,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.taxCode,
      onChange: (value: string) => handleChange({ taxCode: value }),
    },
    {
      key: 7,
      type: INPUT,
      label: "Email",
      span: 12,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.email,
      onChange: (value: string) => handleChange({ email: value }),
    },
    {
      key: 8,
      type: INPUT,
      label: "Địa điểm",
      require: true,
      span: 12,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.location,
      onChange: (value: string) => handleChange({ location: value }),
    },
    {
      key: 9,
      type: SELECT,
      label: "Nhân viên",
      span: 12,
      options: [
        {
          label: "",
          value: "",
        },
      ],
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.nguoiLap,
      onChange: (value: string) => handleChange({ nguoiLap: value }),
    },
    {
      key: 10,
      type: INPUT,
      label: "Tính chất",
      require: true,
      span: 12,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.nature,
      onChange: (value: string) => handleChange({ object: value }),
    },
    {
      key: 11,
      type: SELECT,
      label: "Trạng thái",
      span: 12,
      options: [
        {
          label: "",
          value: "",
        },
      ],
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.trangThai,
      onChange: (value: string) => handleChange({ trangThai: value }),
    },
  ];

  const handleCheck = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      form.setValues({ ...form.values, status: 1 });
    } else form.setValues({ ...form.values, status: 0 });
  };

  return (
    <Modal
      width={900}
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
          <CardTitleCustomUpdate title="Thêm mới thông báo phí" />
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
        </Form>
        <AssetInfor />
        <Row
          justify={"space-between"}
          style={{ padding: "0 16px", paddingBottom: "16px" }}
          align={"middle"}
        >
          <Checkbox
            onChange={handleCheck}
            checked={form.values.status ? true : false}
            style={{ visibility: "hidden" }}
          >
            Hoạt động
          </Checkbox>
          <Space>
            <ButtonCustom label="Hủy bỏ" size="small" onClick={closeModal} />
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

export default Create;
