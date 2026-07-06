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
import { ConstructionTypeInvest, EditCategoryInvest } from "constant/types";
import { categoryApi } from "apis/category";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  investSelected: EditCategoryInvest;
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
});

const EditCategoryInvestModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  investSelected,
  constructionType,
}) => {
  const handleChange = (basicData: EditCategoryInvest) => {
    formEdit.setValues((state) => ({
      ...state,
      ...basicData,
    }));
  };

  const formEdit = useFormik({
    initialValues: investSelected
      ? investSelected
      : {
          constructionNameId: 0,
          constructionName: "",
          constructionTypeId: 0,
          constructionTypeName: "",
          highPrice: 0,
          lowPrice: 0,
          isHidden: false,
        },
    validationSchema: formSchema,
    onSubmit: async (data: EditCategoryInvest) => {
      try {
        const response = await categoryApi.updateConstructionName(data);
        if (response.data.code === 200) {
          message.success(response.data.message);
          formEdit.resetForm();
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Sửa khung giá suất vốn không thành công");
      }
    },
  });

  useEffect(() => {
    if (investSelected?.constructionNameId) {
      formEdit.setValues(investSelected);
    }
  }, [investSelected]);

  useEffect(() => {
    if (investSelected?.constructionTypeId) {
      formEdit.setValues(investSelected);
    }
  }, [investSelected]);

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "ID",
      type: INPUT,
      require: true,
      value: formEdit.values.constructionNameId,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      disable: true,
      onChange: (e: any) =>
        handleChange({ constructionNameId: e.target.value }),
    },
    {
      key: 1,
      label: "Loại công trình",
      placeholder: "Chọn",
      type: SELECT,
      error: formEdit.errors.constructionTypeId,
      value: formEdit.values.constructionTypeId,
      touched: formEdit.touched.constructionTypeId,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      require: true,
      onChange: (value: any) => handleChange({ constructionTypeId: value }),
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
      value: formEdit.values.constructionName,
      error: formEdit.errors.constructionName,
      touched: formEdit.touched.constructionName,
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
      value: formEdit.values.lowPrice,
      error: formEdit.errors.lowPrice,
      touched: formEdit.touched.lowPrice,
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
      value: formEdit.values.highPrice,
      error: formEdit.errors.highPrice,
      touched: formEdit.touched.highPrice,
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
      value: formEdit.values.isHidden ? 1 : 0,
      error: formEdit.errors.isHidden,
      touched: formEdit.touched.isHidden,
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
          <CardTitleCustomUpdate title="Sửa khung giá suất vốn đầu tư" />
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
                  formEdit.resetForm();
                  closeModal();
                }}
              />
              <ButtonCustom
                label="Lưu lại"
                type="primary"
                bgColor="rgba(40, 98, 175, 1)"
                onClick={formEdit.submitForm}
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default EditCategoryInvestModal;
