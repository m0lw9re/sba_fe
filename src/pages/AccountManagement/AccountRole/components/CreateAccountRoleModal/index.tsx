import React, { useState } from "react";
import { Modal, Row, Button, Space, Form, message } from "antd";
import "pages/AccountManagement/AccountRole/components/CreateAccountRoleModal/style.scss";
import { CreateAccountRoleData } from "constants/types/common.type";
import { accountRoleApi } from "apis/accountrole";
import { useForm } from "antd/es/form/Form";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { CloseOutlined } from "@ant-design/icons";
import * as Yup from "yup";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
};

const { INPUT } = TYPE_FIELD;

const formSchema = Yup.object().shape({
  roleCode: Yup.string().nullable().required("Phải nhập mã nhóm quyền"),
  roleName: Yup.string().nullable().required("Phải nhập tên nhóm quyền")
})

function removeDiacritics(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const CreateAccountRoleModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
}) => {
  const handleChangeCreateAccountRole = (basicData: CreateAccountRoleData) => {
    formCreateAccountRole.setValues((state) => ({
      ...state,
      ...basicData,
    }));
  };

  const initialFormData: CreateAccountRoleData = {
    roleCode: "",
    roleName: "",
  };

  const formCreateAccountRole = useFormik({
    initialValues: initialFormData,
    validationSchema: formSchema,
    onSubmit: async (data: CreateAccountRoleData) => {
      try {
        const response = await accountRoleApi.create(data);
        if (response.data.code === 200) {
          message.success(response.data.message);
          formCreateAccountRole.resetForm();
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Tạo nhóm quyền không thành công");
      }
    },
  });
  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Mã nhóm",
      placeholder: "Nhập mã nhóm",
      type: INPUT,
      value: formCreateAccountRole.values.roleCode,
      error: formCreateAccountRole.errors.roleCode,
      touched: formCreateAccountRole.errors.roleCode,
      require: true,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) => {
        const inputWithoutDiacritics = removeDiacritics(e.target.value.toUpperCase()); // Loại bỏ dấu và chuyển đổi thành chữ hoa
        handleChangeCreateAccountRole({ roleCode: inputWithoutDiacritics });
      },
    },
    {
      key: 2,
      label: "Tên nhóm",
      placeholder: "Nhập tên nhóm",
      type: INPUT,
      require: true,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      value: formCreateAccountRole.values.roleName,
      error: formCreateAccountRole.errors.roleName,
      touched: formCreateAccountRole.touched.roleName,
      onChange: (e: any) =>
        handleChangeCreateAccountRole({ roleName: e.target.value }),
    },
  ];
  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalCreateAccountRoleModal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalCreateAccountRoleModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Thêm nhóm quyền tài khoản mới" />
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
              <ButtonCustom label="Hủy bỏ" onClick={closeModal} />
              <ButtonCustom
                label="Lưu lại"
                type="primary"
                onClick={formCreateAccountRole.submitForm}
                bgColor="rgba(40, 98, 175, 1)"
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default CreateAccountRoleModal;
