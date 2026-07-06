import React from "react";
import { Modal, Row, Button, Space, Form, message } from "antd";
import "./style.scss";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { CloseOutlined } from "@ant-design/icons";
import * as Yup from "yup";
import { CreatePGDType } from "constant/types";
import { transactionsApi } from "apis/transactions";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  branchOptions: Array<{ value: string; label: string }>;
  mutate: any;
};

const formSchema = Yup.object().shape({
  branchCode: Yup.string().nullable().required("Phải nhập mã chi nhánh"),
  transOfficeCode: Yup.string().required("Phải nhập mã phòng giao dịch"),
  transOfficeName: Yup.string()
    .nullable()
    .required("Phải nhập tên phòng giao dịch"),
  address: Yup.string().nullable(),
  email: Yup.string().nullable(),
  phoneNumber: Yup.string().nullable(),
});

const initialFormData: CreatePGDType = {
  transOfficeCode: "",
  transOfficeName: "",
  address: "",
  email: "",
  phoneNumber: "",
  branchCode: "",
};

const { INPUT, SELECT } = TYPE_FIELD;

const CreatePGDModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  branchOptions,
  mutate,
}) => {
  const formCreate = useFormik({
    initialValues: initialFormData,
    validateOnChange: false,
    validationSchema: formSchema,
    onSubmit: async (data: CreatePGDType) => {
      try {
        const response = await transactionsApi.createPGD(data);
        if (response.data.code === 200) {
          message.success(response.data.message);
          formCreate.resetForm();
          closeModal();
          mutate();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Tạo PGD không thành công");
      }
    },
  });

  const handleChangeData = (data: any) => {
    formCreate.setValues({
      ...formCreate.values,
      ...data,
    });
  };

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Chi nhánh",
      css: css,
      type: SELECT,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: formCreate.values.branchCode,
      error: formCreate.errors.branchCode,
      touched: formCreate.touched.branchCode,
      require: true,
      options: branchOptions,
      onChange: (value: string) => handleChangeData({ branchCode: value }),
    },
    {
      key: 2,
      label: "Mã phòng giao dịch",
      placeholder: "Nhập mã phòng giao dịch",
      type: INPUT,
      value: formCreate.values.transOfficeCode,
      error: formCreate.errors.transOfficeCode,
      touched: formCreate.touched.transOfficeCode,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      require: true,
      onChange: (e: any) =>
        handleChangeData({ transOfficeCode: e.target.value }),
    },
    {
      key: 3,
      label: "Tên phòng giao dịch",
      placeholder: "Nhập tên phòng giao dịch",
      type: INPUT,
      require: true,
      value: formCreate.values.transOfficeName,
      error: formCreate.errors.transOfficeName,
      touched: formCreate.touched.transOfficeName,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) =>
        handleChangeData({
          transOfficeName: e.target.value,
        }),
    },
    {
      key: 4,
      label: "Địa chỉ",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT,
      placeholder: "Nhập địa chỉ",
      value: formCreate.values.address,
      error: formCreate.errors.address,
      touched: formCreate.touched.address,
      onChange: (e: any) =>
        handleChangeData({
          address: e.target.value,
        }),
    },
    {
      key: 5,
      label: "Email",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT,
      value: formCreate.values.email,
      error: formCreate.errors.email,
      touched: formCreate.touched.email,
      placeholder: "Nhập email",
      //disable: true,
      onChange: (e: any) =>
        handleChangeData({
          email: e.target.value,
        }),
    },
    {
      key: 6,
      label: "Số điện thoại",
      placeholder: "Nhập số điện thoại",
      type: INPUT,

      value: formCreate.values.phoneNumber,
      error: formCreate.errors.phoneNumber,
      touched: formCreate.touched.phoneNumber,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) => handleChangeData({ phoneNumber: e.target.value }),
    },
  ];
  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalCreatePGDModal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalCreatePGDModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Thêm phòng giao dịch mới" />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={closeModal}
            size="small"
          />
        </Row>
        <Form labelAlign="left" labelWrap size="small">
          <Row gutter={[24, 4]}>
            <InputFields data={inputFields} />
          </Row>
          <Row
            justify={"end"}
            style={{ padding: "8px 0" }}
            className="button-row"
          >
            <Space>
              <ButtonCustom
                label="Hủy bỏ"
                onClick={() => {
                  formCreate.resetForm();
                  closeModal();
                }}
              />
              <ButtonCustom
                label="Lưu lại"
                type="primary"
                htmlType="submit"
                bgColor="rgba(40, 98, 175, 1)"
                onClick={formCreate.submitForm}
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default CreatePGDModal;
