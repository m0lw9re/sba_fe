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
import { CreateCategoryConstruction } from "constant/types/categoryinvest";
import { categoryApi } from "apis/category";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
};

const { TEXT_AREA, RADIO } = TYPE_FIELD;

const formSchema = Yup.object().shape({
  constructionTypeName: Yup.string()
    .nullable()
    .required("Bạn chưa nhập tên CTXD"),

  hidden: Yup.boolean().nullable().required("Bạn chưa nhập trạng thái"),
});

const initialFormData: CreateCategoryConstruction = {
  constructionTypeName: "",
  hidden: false,
};

const CreateCategoryConstructionModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
}) => {
  const handleChange = (basicData: any) => {
    formCreate.setValues((state: any) => ({
      ...state,
      ...basicData,
    }));
  };

  const formCreate = useFormik({
    initialValues: initialFormData,
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: async (data: CreateCategoryConstruction) => {
      try {
        const response = await categoryApi.createCategoryConstruction(data);
        if (response?.data?.constructionTypeId) {
          message.success(
            response.data.message || "Thêm công trình xây dựng thành công"
          );
          formCreate.resetForm();
          closeModal();
        } else {
          message.error(
            response.data.message || "Tạo công trình xây dựng không thành công"
          );
        }
      } catch (error) {
        message.error("Tạo công trình xây dựng không thành công");
      }
    },
  });

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Tên CTXD",
      type: TEXT_AREA,
      require: true,
      value: formCreate.values.constructionTypeName,
      error: formCreate.errors.constructionTypeName,
      touched: formCreate.touched.constructionTypeName,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      maxLength: 1000,
      onChange: (e: any) =>
        handleChange({ constructionTypeName: e.target.value }),
    },
    {
      key: 5,
      label: "Trạng thái hoạt động",
      type: RADIO,
      require: true,
      options: [
        {
          label: "Hoạt động",
          value: 0,
        },
        {
          label: "Ngưng hoạt động",
          value: 1,
        },
      ],
      css: css,
      labelCol: { xs: 6, sm: 6, md: 6, lg: 8, xl: 8 },
      wrapperCol: { xs: 18, sm: 18, md: 18, lg: 20, xl: 20 },
      value: formCreate.values.hidden ? 1 : 0,
      error: formCreate.errors.hidden,
      touched: formCreate.touched.hidden,
      allowClear: true,
      onChange: (e: any) =>
        handleChange({ hidden: e.target.value ? true : false }),
    },
  ];

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalCreateCategoryInvestModal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalCreateCategoryInvestModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Thêm công trình xây dựng" />
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

export default CreateCategoryConstructionModal;
