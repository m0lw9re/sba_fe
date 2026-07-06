import React, { useEffect } from "react";
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
import { EditPGDType } from "constant/types";
import { transactionsApi } from "apis/transactions";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  pgdSelected?: EditPGDType;
  branchOptions: Array<{ value: string; label: string }>;
};

const { INPUT, SELECT } = TYPE_FIELD;

const EditPGDModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  pgdSelected,
  branchOptions,
}) => {
  const handleEdit = (basicData: any) => {
    formEdit.setValues((state: any) => ({
      ...state,
      ...basicData,
    }));
  };

  const formSchema = Yup.object().shape({
    branchCode: Yup.string().nullable().required("Phải nhập mã chi nhánh"),
    transOfficeCode: Yup.string().required("Phải nhập mã phòng giao dịch"),
    transOfficeName: Yup.string()
      .nullable()
      .required("Phải nhập tên phòng giao dịch"),
    address: Yup.string().nullable(),
    email: Yup.string().nullable().email("Vui lòng nhập đúng định dạng email"),
    phoneNumber: Yup.string()
      .nullable()
      .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
  });

  const formEdit = useFormik({
    initialValues: {
      transOfficeCode: "",
      transOfficeName: "",
      address: "",
      email: "",
      phoneNumber: "",
      branchCode: "",
    } as EditPGDType,
    validationSchema: formSchema,
    onSubmit: async (data: EditPGDType) => {
      try {
        const response = await transactionsApi.editPGD(data);
        if (response.data.code === 200) {
          message.success(response.data.message);
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Sửa phòng giao dịch không thành công");
      }
    },
  });

  useEffect(() => {
    if (pgdSelected) {
      formEdit.setValues(pgdSelected);
    }
  }, [pgdSelected]);

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Chi nhánh",
      css: css,
      type: SELECT,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: formEdit.values.branchCode,
      error: formEdit.errors.branchCode,
      touched: formEdit.touched.branchCode,
      require: true,
      options: branchOptions,
      onChange: (value: string) => handleEdit({ branchCode: value }),
    },
    {
      key: 2,
      label: "ID phòng giao dịch",
      type: INPUT,
      value: formEdit.values.transOfficeCode,
      error: formEdit.errors.transOfficeCode,
      touched: formEdit.touched.transOfficeCode,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      require: true,
      disable: true,
      onChange: (e: any) => handleEdit({ transOfficeCode: e.target.value }),
    },
    {
      key: 3,
      label: "Tên phòng giao dịch",
      type: INPUT,
      value: formEdit.values.transOfficeName,
      error: formEdit.errors.transOfficeName,
      touched: formEdit.touched.transOfficeName,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      require: true,
      onChange: (e: any) => handleEdit({ transOfficeName: e.target.value }),
    },
    {
      key: 4,
      label: "Địa chỉ",
      type: INPUT,
      value: formEdit.values.address,
      error: formEdit.errors.address,
      touched: formEdit.touched.address,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) => handleEdit({ address: e.target.value }),
    },
    {
      key: 5,
      label: "Email",
      type: INPUT,
      value: formEdit.values.email,
      error: formEdit.errors.email,
      touched: formEdit.touched.email,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) => handleEdit({ email: e.target.value }),
    },
    {
      key: 6,
      label: "Số điện thoại",
      type: INPUT,
      value: formEdit.values.phoneNumber,
      error: formEdit.errors.phoneNumber,
      touched: formEdit.touched.phoneNumber,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) => handleEdit({ phoneNumber: e.target.value }),
    },
  ];
  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalEditPGDModal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalEditPGDModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Sửa phòng giao dịch" />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={closeModal}
            size="small"
          />
        </Row>
        <Form
          labelAlign="left"
          labelWrap
          size="small"
          onFinish={formEdit.handleSubmit}
        >
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
                  formEdit.resetForm();
                  closeModal();
                }}
              />
              <ButtonCustom
                label="Lưu lại"
                type="primary"
                onClick={formEdit.submitForm}
                bgColor="rgba(40, 98, 175, 1)"
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default EditPGDModal;
