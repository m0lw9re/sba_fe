import React from "react";
import { Modal, Row, Button, Space, Form, message } from "antd";
import "./style.scss";
import { CreateCategoryStaffPositionType } from "constant/types";
import { categoryStaffPositionApi } from "apis/categoryStaffPosition";
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
  term: Yup.string().nullable().required("Không được để trống"),
  positionName: Yup.string().nullable().required("Phải nhập tên vị trí"),
});

const CreateCategoryStaffPositionModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
}) => {
  const handleChangeCreateCategoryStaffPosition = (
    basicData: CreateCategoryStaffPositionType,
  ) => {
    formCreateCategoryStaffPosition.setValues((state) => ({
      ...state,
      ...basicData,
    }));
  };

  const initialFormData: CreateCategoryStaffPositionType = {
    term: "",
    positionName: "",
  };

  const formCreateCategoryStaffPosition = useFormik({
    initialValues: initialFormData,
    validationSchema: formSchema,
    onSubmit: async (data: CreateCategoryStaffPositionType) => {
      try {
        const response = await categoryStaffPositionApi.create(data);
        if (response.data.code === 200) {
          message.success(response.data.message);
          formCreateCategoryStaffPosition.resetForm();
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Tạo vị trí không thành công");
      }
    },
  });
  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    // {
    //   key: 1,
    //   label: "Mã nhóm",
    //   placeholder: "Nhập mã nhóm",
    //   type: INPUT,
    //   value: formCreateCategoryStaffPosition.values.roleCode,
    //   error: formCreateCategoryStaffPosition.errors.roleCode,
    //   touched: formCreateCategoryStaffPosition.errors.roleCode,
    //   require: true,
    //   labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
    //   wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
    //   css: css,
    //   onChange: (e: any) => {
    //     const inputWithoutDiacritics = removeDiacritics(
    //       e.target.value.toUpperCase(),
    //     ); // Loại bỏ dấu và chuyển đổi thành chữ hoa
    //     handleChangeCreateCategoryStaffPosition({
    //       roleCode: inputWithoutDiacritics,
    //     });
    //   },
    // },
    {
      key: 2,
      label: "Tên vị trí",
      placeholder: "Nhập tên vị trí",
      type: INPUT,
      require: true,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      value: formCreateCategoryStaffPosition.values.positionName,
      error: formCreateCategoryStaffPosition.errors.positionName,
      touched: formCreateCategoryStaffPosition.touched.positionName,
      onChange: (e: any) =>
        handleChangeCreateCategoryStaffPosition({
          positionName: e.target.value,
        }),
    },
    {
      key: 3,
      label: "Mã vị trí",
      placeholder: "Nhập mã vị trí",
      type: INPUT,
      require: true,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      value: formCreateCategoryStaffPosition.values.term,
      error: formCreateCategoryStaffPosition.errors.term,
      touched: formCreateCategoryStaffPosition.touched.term,
      onChange: (e: any) =>
        handleChangeCreateCategoryStaffPosition({
          term: e.target.value,
        }),
    },
  ];
  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalCreateCategoryStaffPositionModal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalCreateCategoryStaffPositionModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Thêm vị trí mới" />
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
                onClick={formCreateCategoryStaffPosition.submitForm}
                bgColor="rgba(40, 98, 175, 1)"
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default CreateCategoryStaffPositionModal;
