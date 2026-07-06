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
import { EditCategoryConstruction } from "constant/types/categoryinvest";
import { categoryApi } from "apis/category";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  constructionSelected: EditCategoryConstruction;
};

const { INPUT, TEXT_AREA, RADIO } = TYPE_FIELD;

const formSchema = Yup.object().shape({
  constructionTypeId: Yup.number().nullable().required("Không thể để trống ID"),
  constructionTypeName: Yup.string()
    .nullable()
    .required("Bạn chưa nhập tên CTXD"),
});

const EditCategoryConstructionModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  constructionSelected,
}) => {
  const handleChange = (basicData: EditCategoryConstruction) => {
    formEdit.setValues((state) => ({
      ...state,
      ...basicData,
    }));
  };

  const formEdit = useFormik({
    initialValues: constructionSelected
      ? constructionSelected
      : {
          constructionTypeId: 0,
          constructionTypeName: "",
          hidden: false,
        },
    validationSchema: formSchema,
    onSubmit: async (data: EditCategoryConstruction) => {
      try {
        const response = await categoryApi.updateCategoryConstruction(data);
        if (response?.data?.constructionTypeId) {
          message.success(
            response.data.message || "Sửa công trình xây dựng thành công"
          );
          formEdit.resetForm();
          closeModal();
        } else {
          message.error(
            response.data.message || "Sửa công trình xây dựng không thành công"
          );
        }
      } catch (error) {
        message.error("Lỗi! Sửa công trình xây dựng không thành công");
      }
    },
  });

  useEffect(() => {
    if (constructionSelected?.constructionTypeId) {
      formEdit.setValues(constructionSelected);
    }
  }, [constructionSelected]);

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "ID",
      type: INPUT,
      require: true,
      value: formEdit.values.constructionTypeId,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      disable: true,
      onChange: (e: any) =>
        handleChange({ constructionTypeId: e.target.value }),
    },
    {
      key: 2,
      label: "Mô tả đặc tính kỹ thuật",
      type: TEXT_AREA,
      require: true,
      value: formEdit.values.constructionTypeName,
      error: formEdit.errors.constructionTypeName,
      touched: formEdit.touched.constructionTypeName,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      maxLength: 1000,
      onChange: (e: any) =>
        handleChange({ constructionTypeName: e.target.value }),
    },
    {
      key: 2,
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
      value: formEdit.values.hidden ? 1 : 0,
      error: formEdit.errors.hidden,
      touched: formEdit.touched.hidden,
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
          <CardTitleCustomUpdate title="Sửa công trình xây dựng" />
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

export default EditCategoryConstructionModal;
