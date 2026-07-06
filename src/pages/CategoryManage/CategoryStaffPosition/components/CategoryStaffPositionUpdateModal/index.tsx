import React, { useEffect } from "react";
import { Modal, Row, Button, Space, Form, message } from "antd";
import "./style.scss";
import { UpdateCategoryStaffPositionType } from "constant/types";
import { categoryStaffPositionApi } from "apis/categoryStaffPosition";
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
  staffPositionSelected: UpdateCategoryStaffPositionType;
};

const formSchema = Yup.object().shape({
  term: Yup.string().nullable().required("Không được để trống"),
  positionName: Yup.string().nullable().required("Phải nhập tên vị trí"),
});

const { INPUT } = TYPE_FIELD;
const CategoryStaffPositionUpdateModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  staffPositionSelected,
}) => {
  const [form] = useForm();
  const handleEditCategoryStaffPosition = (
    basicData: UpdateCategoryStaffPositionType,
  ) => {
    formEditCategoryStaffPosition.setValues((state) => ({
      ...state,
      ...basicData,
    }));
  };

  const formEditCategoryStaffPosition = useFormik({
    initialValues: staffPositionSelected
      ? staffPositionSelected
      : {
          positionId: "",
          positionName: "",
          term: "",
        },
    validationSchema: formSchema,
    onSubmit: async (data: UpdateCategoryStaffPositionType) => {
      try {
        const response = await categoryStaffPositionApi.update(data);
        if (response.data.code === 200) {
          message.success(response.data.message);
          form.resetFields();
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Sửa vị trí không thành công");
        console.log(error);
      }
    },
  });
  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    {
      key: 3,
      label: "Mã vị trí",
      type: INPUT,
      require: true,
      disable: true,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      value: formEditCategoryStaffPosition.values.term,
      error: formEditCategoryStaffPosition.errors.term,
      touched: formEditCategoryStaffPosition.touched.term,
      onChange: (e: any) =>
        handleEditCategoryStaffPosition({ term: e.target.value }),
    },
    {
      key: 2,
      label: "Tên vị trí",
      type: INPUT,
      require: true,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      value: formEditCategoryStaffPosition.values.positionName,
      error: formEditCategoryStaffPosition.errors.positionName,
      touched: formEditCategoryStaffPosition.touched.positionName,
      onChange: (e: any) =>
        handleEditCategoryStaffPosition({ positionName: e.target.value }),
    },
  ];
  useEffect(() => {
    if (staffPositionSelected?.positionId) {
      formEditCategoryStaffPosition.setValues(staffPositionSelected);
    }
  }, [staffPositionSelected]);

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalEditCategoryStaffPositionModal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalEditCategoryStaffPositionModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Sửa vị trí" />
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
          onFinish={formEditCategoryStaffPosition.handleSubmit}
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

export default CategoryStaffPositionUpdateModal;
