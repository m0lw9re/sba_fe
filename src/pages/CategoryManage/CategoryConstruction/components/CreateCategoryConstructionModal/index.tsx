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
import { categoryConstructionApi } from "apis/categoryConstruction";
import * as Yup from "yup";
import { CreateCategoryConstructionDataType } from "constant/types";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
};

const { INPUT, SELECT, INPUT_NUMBER } = TYPE_FIELD;

const formSchema = Yup.object().shape({
  constructionName: Yup.string().required(
    "Bạn chưa nhập mô tả đặc tính kỹ thuật"
  ),
  constructionTypeId: Yup.number()
    .nullable()
    .required("Vui lòng chọn loại công trình xây dựng"),
  lowPrice: Yup.number().nullable().required("Vui lòng nhập giá thấp nhất"),
  highPrice: Yup.number()
    .nullable()
    .required("Vui lòng nhập giá cao nhất")
    .moreThan(Yup.ref("lowPrice"), "Giá lớn nhất phải lớn hơn giá thấp nhất"),
});

const initialFormData: CreateCategoryConstructionDataType = {
  constructionName: "",
  constructionTypeId: null,
  lowPrice: null,
  highPrice: null,
};

const CreateCategoryConstructionModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
}) => {
  const { constructionTypeOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );

  const handleChangeCreateCategoryConstruction = (basicData: any) => {
    formCreateCategoryConstruction.setValues((state: any) => ({
      ...state,
      ...basicData,
    }));
  };

  const formCreateCategoryConstruction = useFormik({
    initialValues: initialFormData,
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: async (data: CreateCategoryConstructionDataType) => {
      try {
        const response = await categoryConstructionApi.create(data);
        if (response.data.code === 200) {
          message.success(response.data.message);
          formCreateCategoryConstruction.resetForm();
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Tạo mô tả đặc tính kỹ thuật không thành công");
      }
    },
  });

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Loại công trình xây dựng",
      type: SELECT,
      require: true,
      options: constructionTypeOptions,
      value: formCreateCategoryConstruction.values.constructionTypeId,
      error: formCreateCategoryConstruction.errors.constructionTypeId,
      touched: formCreateCategoryConstruction.touched.constructionTypeId,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (value: number) =>
        handleChangeCreateCategoryConstruction({ constructionTypeId: value }),
    },
    {
      key: 2,
      label: "Mô tả đặc tính kỹ thuật",
      placeholder: "Nhập",
      type: INPUT,
      value: formCreateCategoryConstruction.values.constructionName,
      error: formCreateCategoryConstruction.errors.constructionName,
      touched: formCreateCategoryConstruction.touched.constructionName,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      require: true,
      onChange: (e: any) =>
        handleChangeCreateCategoryConstruction({
          constructionName: e.target.value,
        }),
    },

    {
      key: 3,
      label: "Giá thấp nhất",
      type: INPUT_NUMBER,
      require: true,
      value: formCreateCategoryConstruction.values.lowPrice,
      error: formCreateCategoryConstruction.errors.lowPrice,
      touched: formCreateCategoryConstruction.touched.lowPrice,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      currencable: true,
      isRounded: true,
      onChange: (value: number) =>
        handleChangeCreateCategoryConstruction({ lowPrice: value }),
    },
    {
      key: 4,
      label: "Giá cao nhất",
      type: INPUT_NUMBER,
      require: true,
      error: formCreateCategoryConstruction.errors.highPrice,
      value: formCreateCategoryConstruction.values.highPrice,
      touched: formCreateCategoryConstruction.touched.highPrice,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      currencable: true,
      isRounded: true,
      onChange: (value: number) =>
        handleChangeCreateCategoryConstruction({ highPrice: value }),
    },
  ];

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalCreateCategoryRiskModal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalCreateCategoryRiskModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Thêm mô tả đặc tính kỹ thuật" />
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
                  formCreateCategoryConstruction.resetForm();
                  closeModal();
                }}
              />
              <ButtonCustom
                label="Lưu lại"
                type="primary"
                // htmlType="submit"
                bgColor="rgba(40, 98, 175, 1)"
                onClick={formCreateCategoryConstruction.submitForm}
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default CreateCategoryConstructionModal;
