import React, { useEffect, useState } from "react";
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
import { AssetType, CreateCategoryCommit } from "constant/types";
import { commitApi } from "apis/commit";
import { assetCommonApi } from "apis/assetCommon";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
};

const { INPUT_NUMBER, SELECT } = TYPE_FIELD;

const initialFormData: CreateCategoryCommit = {
  date: null,
  areaId: null,
  assetTypeId: null,
};

const formSchema = Yup.object().shape({
  date: Yup.number().nullable().required("Bạn chưa chọn ngày"),
  areaId: Yup.number().nullable().required("Bạn chưa chọn khu vực"),
  assetTypeId: Yup.number().nullable().required("Bạn chưa chọn loại tài sản"),
});

const CreateCategoryCommitModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
}) => {
  const handleChangeCreateCategoryCommit = (basicData: any) => {
    formCreateCategoryCommit.setValues((state: any) => ({
      ...state,
      ...basicData,
    }));
  };

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

  const formCreateCategoryCommit = useFormik({
    initialValues: initialFormData,
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: async (data: CreateCategoryCommit) => {
      try {
        const response = await commitApi.createCategoryCommit(data);
        if (response.data.code === 200) {
          message.success(response.data.message);
          formCreateCategoryCommit.resetForm();
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Tạo số ngày cam kết không thành công");
      }
    },
  });

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Số ngày cam kết",
      placeholder: "Nhập",
      type: INPUT_NUMBER,
      value: formCreateCategoryCommit.values.date,
      error: formCreateCategoryCommit.errors.date,
      touched: formCreateCategoryCommit.touched.date,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      require: true,
      currencable: true,
      onChange: (value: number) =>
        handleChangeCreateCategoryCommit({ date: value }),
    },
    {
      key: 2,
      label: "Địa bàn",
      placeholder: "Chọn",
      type: SELECT,
      require: true,
      options: [
        {
          label: "Tất cả",
          value: "1",
        },
        {
          label: "Nội thành",
          value: "2",
        },
        {
          label: "Tỉnh",
          value: "3",
        },
        {
          label: "Ngoại thành",
          value: "4",
        },
      ],
      value: formCreateCategoryCommit.values.areaId,
      error: formCreateCategoryCommit.errors.areaId,
      touched: formCreateCategoryCommit.touched.areaId,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (value: number) =>
        handleChangeCreateCategoryCommit({ areaId: value }),
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
      value: formCreateCategoryCommit.values.assetTypeId,
      error: formCreateCategoryCommit.errors.assetTypeId,
      touched: formCreateCategoryCommit.touched.assetTypeId,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (value: number) =>
        handleChangeCreateCategoryCommit({ assetTypeId: value }),
    },
  ];

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalCreateCategoryCommitModal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalCreateCategoryCommitModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Thêm số ngày cam kết" />
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
                  formCreateCategoryCommit.resetForm();
                  closeModal();
                }}
              />
              <ButtonCustom
                label="Lưu lại"
                type="primary"
                bgColor="rgba(40, 98, 175, 1)"
                onClick={formCreateCategoryCommit.submitForm}
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default CreateCategoryCommitModal;
