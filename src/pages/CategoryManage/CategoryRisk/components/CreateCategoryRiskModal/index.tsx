import React from "react";
import { Modal, Row, Button, Space, Form, message } from "antd";
import "pages/CategoryManage/CategoryRisk/components/CreateCategoryRiskModal/style.scss";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { CloseOutlined } from "@ant-design/icons";
import { riskApi } from "apis/risk";
import * as Yup from "yup";
import { CreateCategoryRiskDataType } from "constant/types";
import { AssetLevelTwoType } from "constant/types";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
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

const initialFormData: CreateCategoryRiskDataType = {
  assetLevelTwoId: null,
  description: "",
  riskAssetId: null,
  riskContent: "",
  riskLevel: null,
};

const CreateCategoryRiskModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  assetLevelTwo,
}) => {
  const handleChangeCreateCategoryRisk = (basicData: any) => {
    formCreateCategoryRisk.setValues((state: any) => ({
      ...state,
      ...basicData,
    }));
  };

  const formCreateCategoryRisk = useFormik({
    initialValues: initialFormData,
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: async (data: CreateCategoryRiskDataType) => {
      try {
        const response = await riskApi.create(data);
        if (response.data.code === 200) {
          message.success(response.data.message);
          formCreateCategoryRisk.resetForm();
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Tạo cảnh báo rủi ro không thành công");
      }
    },
  });

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Nội dung cảnh báo",
      placeholder: "Nhập",
      type: INPUT,
      error: formCreateCategoryRisk.errors.riskContent,
      value: formCreateCategoryRisk.values.riskContent,
      touched: formCreateCategoryRisk.touched.riskContent,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      require: true,
      onChange: (e: any) =>
        handleChangeCreateCategoryRisk({ riskContent: e.target.value }),
    },
    {
      key: 2,
      label: "Mức độ",
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
      value: formCreateCategoryRisk.values.riskLevel,
      error: formCreateCategoryRisk.errors.riskLevel,
      touched: formCreateCategoryRisk.touched.riskLevel,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (value: number) =>
        handleChangeCreateCategoryRisk({ riskLevel: value }),
    },
    {
      key: 3,
      label: "Loại tài sản",
      type: SELECT,
      require: true,
      value: formCreateCategoryRisk.values.assetLevelTwoId,
      error: formCreateCategoryRisk.errors.assetLevelTwoId,
      touched: formCreateCategoryRisk.touched.assetLevelTwoId,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (value: number) =>
        handleChangeCreateCategoryRisk({ assetLevelTwoId: value }),
      options: assetLevelTwo.map((item: AssetLevelTwoType) => ({
        label: item.assetLevelTwoName,
        value: item.assetLevelTwoId,
      })),
    },
    {
      key: 4,
      label: "Mô tả",
      type: INPUT,
      require: true,
      error: formCreateCategoryRisk.errors.description,
      value: formCreateCategoryRisk.values.description,
      touched: formCreateCategoryRisk.touched.description,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) =>
        handleChangeCreateCategoryRisk({ description: e.target.value }),
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
          <CardTitleCustomUpdate title="Thêm cảnh báo rủi ro" />
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
                  formCreateCategoryRisk.resetForm();
                  closeModal();
                }}
              />
              <ButtonCustom
                label="Lưu lại"
                type="primary"
                // htmlType="submit"
                bgColor="rgba(40, 98, 175, 1)"
                onClick={formCreateCategoryRisk.submitForm}
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default CreateCategoryRiskModal;
