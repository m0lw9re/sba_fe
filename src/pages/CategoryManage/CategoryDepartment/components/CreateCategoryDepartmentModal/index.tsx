import React from "react";
import { Modal, Row, Button, Space, Form, message } from "antd";
import "./style.scss";
import { CreateCategoryDepartmentType } from "constant/types";
import { categoryDepartmentApi } from "apis/categoryDepartment";
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
  departmentCode: Yup.string().nullable().required("Phải nhập mã phòng ban"),
  departmentName: Yup.string().nullable().required("Phải nhập tên phòng ban"),
});

function removeDiacritics(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const CreateCategoryDepartmentModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
}) => {
  const handleChangeCreateCategoryDepartment = (
    basicData: CreateCategoryDepartmentType,
  ) => {
    formCreateCategoryDepartment.setValues((state) => ({
      ...state,
      ...basicData,
    }));
  };

  const initialFormData: CreateCategoryDepartmentType = {
    departmentName: "",
    departmentCode: "",
  };

  const formCreateCategoryDepartment = useFormik({
    initialValues: initialFormData,
    validationSchema: formSchema,
    onSubmit: async (data: CreateCategoryDepartmentType) => {
      try {
        const response = await categoryDepartmentApi.create(data);
        if (response.data.code === 200) {
          message.success(response.data.message);
          formCreateCategoryDepartment.resetForm();
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Tạo phòng ban không thành công");
      }
    },
  });
  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Mã phòng ban",
      placeholder: "Nhập mã phòng ban",
      type: INPUT,
      value: formCreateCategoryDepartment.values.departmentCode,
      error: formCreateCategoryDepartment.errors.departmentCode,
      touched: formCreateCategoryDepartment.touched.departmentCode,
      require: true,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) => {
        const inputWithoutDiacritics = removeDiacritics(
          e.target.value.toUpperCase(),
        ); // Loại bỏ dấu và chuyển đổi thành chữ hoa
        handleChangeCreateCategoryDepartment({
          departmentCode: inputWithoutDiacritics,
        });
      },
    },
    {
      key: 2,
      label: "Tên phòng ban",
      placeholder: "Nhập tên phòng ban",
      type: INPUT,
      require: true,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      value: formCreateCategoryDepartment.values.departmentName,
      error: formCreateCategoryDepartment.errors.departmentName,
      touched: formCreateCategoryDepartment.touched.departmentName,
      onChange: (e: any) =>
        handleChangeCreateCategoryDepartment({
          departmentName: e.target.value,
        }),
    },
  ];
  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalCreateCategoryDepartmentModal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalCreateCategoryDepartmentModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Thêm phòng ban mới" />
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
                onClick={formCreateCategoryDepartment.submitForm}
                bgColor="rgba(40, 98, 175, 1)"
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default CreateCategoryDepartmentModal;
