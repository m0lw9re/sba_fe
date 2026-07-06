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
import { CreateCategoryTransactionType } from "constant/types";
import { transactionsApi } from "apis/transactions";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  mutate: any;
};

const formSchema = Yup.object().shape({
  branchCode: Yup.string().nullable().required("Phải nhập mã chi nhánh"),
  branchName: Yup.string().nullable().required("Phải nhập tên chi nhánh"),
  address: Yup.string().nullable(),
  email: Yup.string().matches(
    /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4}$/,
    "Vui lòng nhập đúng định dạng email"
  ),
  regionCode: Yup.string().nullable().required("Phải chọn khu vực"),
  phoneNumber: Yup.string().nullable(),
});

const initialFormData: CreateCategoryTransactionType = {
  branchCode: "",
  branchName: "",
  address: "",
  email: "",
  phoneNumber: "",
};

const { INPUT, SELECT } = TYPE_FIELD;

const CreateTransactionBranchModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  mutate,
}) => {
  const globalState = useSelector((state: RootState) => state.globalSlice);

  const formCreate = useFormik({
    initialValues: initialFormData,
    validateOnChange: true,
    validationSchema: formSchema,
    onSubmit: async (data: CreateCategoryTransactionType) => {
      try {
        const response = await transactionsApi.create(data);
        if (response.data.code === 200) {
          message.success(response.data.message);
          formCreate.resetForm();
          closeModal();
          mutate();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Tạo chi nhánh không thành công");
      }
    },
  });

  const handleChangeData = (basicData: any) => {
    formCreate.setValues({
      ...formCreate.values,
      ...basicData,
    });
  };

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Khu vực",
      css: css,
      type: SELECT,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: formCreate.values.regionCode,
      error: formCreate.errors.regionCode,
      touched: formCreate.errors.regionCode,
      require: true,
      options: globalState.regionOptions,
      onChange: (value: string) => handleChangeData({ regionCode: value }),
    },
    {
      key: 2,
      label: "Mã chi nhánh",
      placeholder: "Nhập mã chi nhánh",
      type: INPUT,
      value: formCreate.values.branchCode,
      error: formCreate.errors.branchCode,
      touched: formCreate.touched.branchCode,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      require: true,
      onChange: (e: any) => handleChangeData({ branchCode: e.target.value }),
    },
    {
      key: 3,
      label: "Tên chi nhánh",
      placeholder: "Nhập tên chi nhánh",
      type: INPUT,
      require: true,
      value: formCreate.values.branchName,
      error: formCreate.errors.branchName,
      touched: formCreate.touched.branchName,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) =>
        handleChangeData({
          branchName: e.target.value,
        }),
    },
    {
      key: 4,
      label: "Địa chỉ",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT,
      placeholder: "Nhập địa chỉ",
      value: formCreate.values.address,
      error: formCreate.errors.address,
      touched: formCreate.touched.address,
      onChange: (e: any) =>
        handleChangeData({
          address: e.target.value,
        }),
    },
    {
      key: 5,
      label: "Email",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT,
      value: formCreate.values.email,
      error: formCreate.errors.email,
      touched: formCreate.touched.email,
      placeholder: "Nhập email",
      //disable: true,
      onChange: (e: any) =>
        handleChangeData({
          email: e.target.value,
        }),
    },
    {
      key: 6,
      label: "Số điện thoại",
      placeholder: "Nhập số điện thoại",
      type: INPUT,
      value: formCreate.values.phoneNumber,
      error: formCreate.errors.phoneNumber,
      touched: formCreate.touched.phoneNumber,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) => handleChangeData({ phoneNumber: e.target.value }),
    },
  ];
  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalCreateCategoryRegionsModal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalCreateCategoryRegionsModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Thêm chi nhánh mới" />
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
                label="Lưu"
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

export default CreateTransactionBranchModal;
