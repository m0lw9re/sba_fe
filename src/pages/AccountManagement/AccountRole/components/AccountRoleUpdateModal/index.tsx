import React, { useEffect } from "react";
import { Modal, Row, Button, Space, Form, message } from "antd";
import "pages/AccountManagement/AccountRole/components/AccountRoleUpdateModal/style.scss";
import { UpdateAccountRoleData } from "constants/types/common.type";
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
  roleSelected: UpdateAccountRoleData;
};

const formSchema = Yup.object().shape({
  roleName: Yup.string().nullable().required("Phải nhập tên nhóm quyền"),
});

const { INPUT } = TYPE_FIELD;
const AccoutRoleUpdateModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  roleSelected,
}) => {
  const [form] = useForm();
  const handleEditAccountRole = (basicData: UpdateAccountRoleData) => {
    formEditAccountRole.setValues((state) => ({
      ...state,
      ...basicData,
    }));
  };

  const formEditAccountRole = useFormik({
    initialValues: roleSelected
      ? roleSelected
      : {
          roleCode: "",
          roleName: "",
        },
    validationSchema: formSchema,
    onSubmit: async (data: UpdateAccountRoleData) => {
      try {
        const { roleCode, roleName } = data;
        const response = await accountRoleApi.update(data, roleCode);
        if (response.data.code === 200) {
          message.success(response.data.message);
          form.resetFields();
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Sửa nhóm quyền không thành công");
        console.log(error);
      }
    },
  });
  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Mã nhóm",
      type: INPUT,
      value: formEditAccountRole.values.roleCode,
      require: true,
      disable: true,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) => handleEditAccountRole({ roleCode: e.target.value }),
    },
    {
      key: 2,
      label: "Tên nhóm",
      type: INPUT,
      require: true,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      value: formEditAccountRole.values.roleName,
      error: formEditAccountRole.errors.roleName,
      touched: formEditAccountRole.touched.roleName,
      onChange: (e: any) => handleEditAccountRole({ roleName: e.target.value }),
    },
  ];
  useEffect(() => {
    if (roleSelected?.roleCode) {
      formEditAccountRole.setValues(roleSelected);
    }
  }, [roleSelected]);
  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalEditAccountRoleModal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalEditAccountRoleModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Sửa nhóm quyền" />
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
          onFinish={formEditAccountRole.handleSubmit}
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
              <ButtonCustom label="Hủy bỏ" onClick={closeModal} />
              <ButtonCustom
                label="Lưu lại"
                type="primary"
                htmlType="submit"
                bgColor="rgba(40, 98, 175, 1)"
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default AccoutRoleUpdateModal;
