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
import { ConstructionTypeInvest, CreateCategoryInvest } from "constant/types";
import { categoryApi } from "apis/category";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  constructionType: any[];
};

const { INPUT, SELECT, INPUT_NUMBER, RADIO } = TYPE_FIELD;

const formSchema = Yup.object().shape({
  constructionTypeId: Yup.string()
    .nullable()
    .required("Bạn chưa chọn loại công trình"),
  constructionName: Yup.string()
    .nullable()
    .required("Bạn chưa nhập mô tả đặc tính kỹ thuật"),
  lowPrice: Yup.number().nullable().required("Bạn chưa nhập đơn giá thấp nhất"),
  highPrice: Yup.number().nullable().required("Bạn chưa nhập đơn giá cao nhất"),
  isHidden: Yup.boolean().nullable().required("Bạn chưa nhập trạng thái"),
});

const initialFormData: CreateCategoryInvest = {
  constructionTypeId: "",
  constructionName: "",
  lowPrice: null,
  highPrice: null,
  isHidden: false,
};

const CreateCategoryInvestModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  constructionType,
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
    onSubmit: async (data: CreateCategoryInvest) => {
      try {
        const response = await categoryApi.createConstructionName(data);
        if (response.data.code === 200) {
          message.success(response.data.message);
          formCreate.resetForm();
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Tạo khung giá suất vốn đầu tư không thành công");
      }
    },
  });

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Loại công trình",
      placeholder: "Chọn",
      type: SELECT,
      error: formCreate.errors.constructionTypeId,
      value: formCreate.values.constructionTypeId,
      touched: formCreate.touched.constructionTypeId,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      require: true,
      onChange: (value: number) => handleChange({ constructionTypeId: value }),
      options: constructionType.map((item: ConstructionTypeInvest) => ({
        label: item.constructionTypeName,
        value: item.constructionTypeId,
      })),
    },
    {
      key: 2,
      label: "Mô tả đặc tính kỹ thuật",
      type: INPUT,
      require: true,
      value: formCreate.values.constructionName,
      error: formCreate.errors.constructionName,
      touched: formCreate.touched.constructionName,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) => handleChange({ constructionName: e.target.value }),
    },
    {
      key: 3,
      label: "Đơn giá thấp nhất",
      type: INPUT_NUMBER,
      require: true,
      value: formCreate.values.lowPrice,
      error: formCreate.errors.lowPrice,
      touched: formCreate.touched.lowPrice,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (value: any) => handleChange({ lowPrice: value }),
      currencable: true,
      isRounded: true,
    },
    {
      key: 4,
      label: "Đơn giá cao nhất",
      type: INPUT_NUMBER,
      require: true,
      value: formCreate.values.highPrice,
      error: formCreate.errors.highPrice,
      touched: formCreate.touched.highPrice,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (value: any) => handleChange({ highPrice: value }),
      currencable: true,
      isRounded: true,
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
      value: formCreate.values.isHidden ? 1 : 0,
      error: formCreate.errors.isHidden,
      touched: formCreate.touched.isHidden,
      allowClear: true,
      onChange: (e: any) =>
        handleChange({ isHidden: e.target.value ? true : false }),
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
          <CardTitleCustomUpdate title="Thêm khung giá suất vốn đầu tư" />
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

export default CreateCategoryInvestModal;
