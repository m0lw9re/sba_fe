import React from "react";
import { Modal, Row, Button, Space, Form, message } from "antd";
import "pages/CategoryManage/CategoryRegions/components/CreateCategoryRegionsModal/style.scss";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { CloseOutlined } from "@ant-design/icons";
import * as Yup from "yup";
import { categoryExpirationDateApi } from "apis/categoryExpirationDate";
import "./style.scss";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
import { CreateUpdateCategoryExpirationDateType } from "constant/types/categoryExpirationDate";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
};

const formSchema = Yup.object().shape({
  assetLevelOneId: Yup.number().nullable().required("Phải chọn loại tài sản"),
  expirationDate: Yup.number()
    .nullable()
    .required("Phải nhập số ngày hiệu lực"),
});

const initialFormData: CreateUpdateCategoryExpirationDateType = {
  assetLevelOneId: null,
  expirationDate: null,
  expirationDateId: null,
};

const { INPUT_NUMBER, SELECT } = TYPE_FIELD;

const CreateCategoryExpirationDateModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
}) => {
  const { assetLevelOneOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );
  const formCreate = useFormik({
    initialValues: initialFormData,
    validationSchema: formSchema,
    validateOnChange: false,
    onSubmit: async (data: CreateUpdateCategoryExpirationDateType) => {
      try {
        const response = await categoryExpirationDateApi.createExpirationDate({
          ...data,
        });
        if (response?.data?.code === 200) {
          message.success("Thêm tham số hiệu lực thành công");
          formCreate.resetForm();
          closeModal();
        } else {
          return message.error(
            response?.data?.message || "Thêm tham số hiệu lực không thành công"
          );
          // return;
        }
      } catch (error) {
        return message.error(
          "Lỗi không xác định! Thêm tham số hiệu lực không thành công"
        );
      }
    },
  });

  const handleChangeData = (basicData: any) => {
    formCreate.setValues((state: any) => ({
      ...state,
      ...basicData,
    }));
  };

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Loại tài sản",
      placeholder: "Chọn loại tài sản",
      type: SELECT,
      allowClear: true,
      options: assetLevelOneOptions || [],
      value: formCreate.values.assetLevelOneId || null,
      error: formCreate.errors.assetLevelOneId,
      touched: formCreate.touched.assetLevelOneId,
      css: css,
      labelCol: { xs: 6, sm: 6, md: 6, lg: 8, xl: 8 },
      wrapperCol: { xs: 18, sm: 18, md: 18, lg: 20, xl: 20 },
      require: true,
      onChange: (value: number) => handleChangeData({ assetLevelOneId: value }),
    },
    {
      key: 2,
      label: "Thời gian hiệu lực (ngày)",
      placeholder: "Nhập số ngày hiệu lực",
      type: INPUT_NUMBER,
      value: formCreate.values.expirationDate,
      error: formCreate.errors.expirationDate,
      touched: formCreate.touched.expirationDate,
      css: css,
      labelCol: { xs: 6, sm: 6, md: 6, lg: 8, xl: 8 },
      wrapperCol: { xs: 18, sm: 18, md: 18, lg: 20, xl: 20 },
      require: true,
      currencable: true,
      onChange: (value: any) =>
        handleChangeData({ expirationDate: value ? Math.round(value) : null }),
    },
  ];
  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modal-Create-Purpose"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modal-Create-Purpose-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Thêm tham số hiệu lực" />
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
            style={{
              padding: "16px 0",
            }}
            align={"middle"}
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
                // htmlType="submit"
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

export default CreateCategoryExpirationDateModal;
