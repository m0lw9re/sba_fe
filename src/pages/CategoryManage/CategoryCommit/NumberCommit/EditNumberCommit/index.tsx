import React, { useEffect, useState } from "react";
import { Modal, Row, Button, Space, Form, message } from "antd";
import "./style.scss";
import { useForm } from "antd/es/form/Form";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { CloseOutlined } from "@ant-design/icons";
import { AssetType, EditCategoryCommit } from "constant/types";
import { commitApi } from "apis/commit";
import * as Yup from "yup";
import { assetCommonApi } from "apis/assetCommon";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  commitSelected: EditCategoryCommit;
};

const { INPUT, INPUT_NUMBER, SELECT } = TYPE_FIELD;

const formSchema = Yup.object().shape({
  date: Yup.number().nullable().required("Bạn chưa chọn số ngày"),
});

const EditCategoryCommitModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  commitSelected,
}) => {
  const [form] = useForm();
  const handleEdit = (basicData: EditCategoryCommit) => {
    formEdit.setValues((state) => ({
      ...state,
      ...basicData,
    }));
  };

  // const initialFormData: EditCategoryRisk = {
  //   riskAssetId: 0,
  //   riskContent: "",
  //   riskLevel: 0,
  //   assetLevelTwoId: 0,
  // };

  const formEdit = useFormik({
    initialValues: commitSelected
      ? commitSelected
      : {
          date: 0,
        },
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: async (data: EditCategoryCommit) => {
      try {
        const response = await commitApi.edit(data);
        if (response.data.code === 200) {
          message.success(response.data.message);
          form.resetFields();
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Sửa số ngày cam kết không thành công");
      }
    },
  });

  useEffect(() => {
    if (commitSelected?.id) {
      formEdit.setValues(commitSelected);
    }
  }, [commitSelected]);

  const [assetType, setAssetType] = useState<AssetType[]>([]);

  const getAssetType = async () => {
    try {
      const res = await assetCommonApi.getAssetType({
        page: 1,
        limit: 1000,
      });
      setAssetType(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAssetType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "ID",
      type: INPUT,
      require: true,
      value: formEdit.values.id,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      disable: true,
      onChange: (e: any) => handleEdit({ id: e.target.value }),
    },
    {
      key: 3,
      label: "Loại hình tài sản",
      placeholder: "Chọn",
      type: SELECT,
      require: true,
      options:
        assetType?.map((item: AssetType) => {
          return {
            label: item.name,
            value: item.id,
          };
        }) || [],
      value: formEdit.values.assetTypeId,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (value: number) => handleEdit({ assetTypeId: value }),
      disable: true,
    },
    {
      key: 2,
      label: "Số ngày cam kết",
      placeholder: "Nhập",
      type: INPUT_NUMBER,
      value: formEdit.values.date,
      error: formEdit.errors.date,
      touched: formEdit.touched.date,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      require: true,
      currencable: true,
      onChange: (value: number) => handleEdit({ date: value }),
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
          <CardTitleCustomUpdate title="Sửa số ngày cam kết" />
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
                htmlType="submit"
                bgColor="rgba(40, 98, 175, 1)"
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default EditCategoryCommitModal;
