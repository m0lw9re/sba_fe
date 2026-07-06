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
import { EditCategoryTransactionType } from "constant/types";
import { transactionsApi } from "apis/transactions";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  branchSelected?: EditCategoryTransactionType;
};

const { INPUT, SELECT } = TYPE_FIELD;

const EditTransactionBranchModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  branchSelected,
}) => {
  const { regionOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );

  const handleEdit = (basicData: any) => {
    formEdit.setValues((state: any) => ({
      ...state,
      ...basicData,
    }));
  };

  const formSchema = Yup.object().shape({
    regionCode: Yup.string().required("Phải nhập khu vực"),
    branchCode: Yup.string().required("Phải nhập chi nhánh"),
    branchName: Yup.string().nullable().required("Phải nhập tên chi nhánh"),
    address: Yup.string().nullable(),
    email: Yup.string()
      .nullable()

      .email("Vui lòng nhập đúng định dạng email"),
    phoneNumber: Yup.string().nullable(),
  });

  const formEdit = useFormik({
    initialValues: {
      regionCode: "",
      branchCode: "",
      branchName: "",
      address: "",
      email: "",
      phoneNumber: "",
    } as EditCategoryTransactionType,
    validationSchema: formSchema,
    onSubmit: async (data: EditCategoryTransactionType) => {
      try {
        const response = await transactionsApi.edit(data);
        if (response.data.code === 200) {
          message.success(response.data.message);
          formEdit.resetForm();
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Sửa chi nhánh không thành công");
      }
    },
  });

  useEffect(() => {
    if (branchSelected) {
      formEdit.setValues(branchSelected);
    }
  }, [branchSelected]);

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Khu vực",
      css: css,
      type: SELECT,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: formEdit.values.regionCode,
      error: formEdit.errors.regionCode,
      touched: formEdit.touched.regionCode,
      require: true,
      options: regionOptions,
      onChange: (value: string) => handleEdit({ regionCode: value }),
    },
    {
      key: 2,
      label: "ID chi nhánh",
      type: INPUT,
      value: formEdit.values.branchCode,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      require: true,
      disable: true,
      onChange: (e: any) => handleEdit({ branchCode: e.target.value }),
    },
    {
      key: 3,
      label: "Tên chi nhánh",
      type: INPUT,
      value: formEdit.values.branchName,
      error: formEdit.errors.branchName,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      require: true,
      onChange: (e: any) => handleEdit({ branchName: e.target.value }),
    },
    {
      key: 4,
      label: "Địa chỉ",
      type: INPUT,
      value: formEdit.values.address,
      error: formEdit.errors.address,
      touched: formEdit.touched.address,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) => handleEdit({ address: e.target.value }),
    },
    {
      key: 5,
      label: "Email",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT,
      value: formEdit.values.email,
      error: formEdit.errors.email,
      touched: formEdit.touched.email,
      placeholder: "Nhập email",
      //disable: true,
      onChange: (e: any) =>
        handleEdit({
          email: e.target.value,
        }),
    },
    {
      key: 6,
      label: "Số điện thoại",
      type: INPUT,
      value: formEdit.values.phoneNumber,
      error: formEdit.errors.phoneNumber,
      touched: formEdit.touched.phoneNumber,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) => handleEdit({ phoneNumber: e.target.value }),
    },
  ];
  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalEditCategoryTransactionModal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalEditCategoryTransactionModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Sửa chi nhánh" />
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
          onFinish={formEdit.handleSubmit}
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
                onClick={formEdit.submitForm}
                bgColor="rgba(40, 98, 175, 1)"
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default EditTransactionBranchModal;
