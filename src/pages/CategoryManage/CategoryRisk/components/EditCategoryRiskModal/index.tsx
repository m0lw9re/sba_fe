import React, { useEffect } from "react";
import { Modal, Row, Button, Space, Form, message } from "antd";
import "pages/CategoryManage/CategoryRisk/components/EditCategoryRiskModal/style.scss";
import { EditCategoryRisk } from "constants/types/common.type";
import { useForm } from "antd/es/form/Form";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { CloseOutlined } from "@ant-design/icons";
import { riskApi } from "apis/risk";
import { AssetLevelTwoType } from "constant/types";
import * as Yup from "yup";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  riskSelected: EditCategoryRisk;
  assetLevelTwo: any[];
};

const { INPUT, SELECT } = TYPE_FIELD;

const formSchema = Yup.object().shape({
  riskContent: Yup.string()
    .nullable()
    .required("Bạn chưa nhập nội dung cảnh báo"),
  description: Yup.string().nullable().required("Bạn chưa nhập mô tả"),
  riskLevel: Yup.number().nullable().required("Bạn chưa chọn mức độ cảnh báo"),
  assetLevelTwoId: Yup.number()
    .nullable()
    .required("Bạn chưa chọn loại tài sản"),
});

const EditCategoryRiskModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  riskSelected,
  assetLevelTwo,
}) => {
  const [form] = useForm();
  const handleChangeEditCategoryRisk = (basicData: EditCategoryRisk) => {
    formEditCategoryRisk.setValues((state) => ({
      ...state,
      ...basicData,
    }));
  };

  const formEditCategoryRisk = useFormik({
    initialValues: riskSelected
      ? riskSelected
      : {
          riskAssetId: 0,
          riskContent: "",
          riskLevel: 0,
          assetLevelTwoId: 0,
          description: "",
        },
    validationSchema: formSchema,
    onSubmit: async (data: EditCategoryRisk) => {
      try {
        const response = await riskApi.edit(data);
        if (response.data.code === 200) {
          message.success(response.data.message);
          form.resetFields();
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Sửa cảnh báo không thành công");
      }
    },
  });
  useEffect(() => {
    if (riskSelected?.riskAssetId) {
      formEditCategoryRisk.setValues(riskSelected);
    }
  }, [riskSelected]);

  useEffect(() => {
    if (riskSelected?.assetLevelTwoId) {
      formEditCategoryRisk.setValues(riskSelected);
    }
  }, [riskSelected]);

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "ID",
      type: INPUT,
      require: true,
      value: formEditCategoryRisk.values.riskAssetId,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      disable: true,
      onChange: (e: any) =>
        handleChangeEditCategoryRisk({ riskAssetId: e.target.value }),
    },
    {
      key: 2,
      label: "Nội dung cảnh báo",
      placeholder: "Nhập",
      type: INPUT,
      value: formEditCategoryRisk.values.riskContent,
      error: formEditCategoryRisk.errors.riskContent,
      touched: formEditCategoryRisk.touched.riskContent,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      require: true,
      onChange: (e: any) =>
        handleChangeEditCategoryRisk({ riskContent: e.target.value }),
    },
    {
      key: 3,
      label: "Mức độ",
      placeholder: "Chọn",
      type: SELECT,
      require: true,
      options: [
        {
          label: "Mức độ 1",
          value: "1",
        },
        {
          label: "Mức độ 2",
          value: "2",
        },
        {
          label: "Mức độ 3",
          value: "3",
        },
        {
          label: "Mức độ 4",
          value: "4",
        },
      ],
      value: formEditCategoryRisk.values.riskLevel,
      error: formEditCategoryRisk.errors.riskLevel,
      touched: formEditCategoryRisk.touched.riskLevel,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (value: number) =>
        handleChangeEditCategoryRisk({ riskLevel: value }),
    },
    {
      key: 4,
      label: "Loại tài sản",
      type: SELECT,
      require: true,
      value: formEditCategoryRisk.values.assetLevelTwoId,
      error: formEditCategoryRisk.errors.assetLevelTwoId,
      touched: formEditCategoryRisk.touched.assetLevelTwoId,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (value: number) =>
        handleChangeEditCategoryRisk({ assetLevelTwoId: value }),
      options: assetLevelTwo.map((item: AssetLevelTwoType) => ({
        label: item.assetLevelTwoName,
        value: item.assetLevelTwoId,
      })),
    },
    {
      key: 5,
      label: "Mô tả",
      type: INPUT,
      require: true,
      value: formEditCategoryRisk.values.description,
      error: formEditCategoryRisk.errors.description,
      touched: formEditCategoryRisk.touched.description,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) =>
        handleChangeEditCategoryRisk({ description: e.target.value }),
    },
  ];
  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalEditCategoryRiskModal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalEditCategoryRiskModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Sửa cảnh báo rủi ro" />
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
          onFinish={formEditCategoryRisk.handleSubmit}
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
                onClick={formEditCategoryRisk.submitForm}
                bgColor="rgba(40, 98, 175, 1)"
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default EditCategoryRiskModal;
