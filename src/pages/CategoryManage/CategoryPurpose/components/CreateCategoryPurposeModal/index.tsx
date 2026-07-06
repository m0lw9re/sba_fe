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
import { CreateCategoryPurposeType } from "constant/types";
import { purposesApi } from "apis/purposes";
import { useFeeScheduleParent } from "utils/request";
import "./style.scss";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
};

const formSchema = Yup.object().shape({
  usingPurposeCode: Yup.string().nullable().required("Phải nhập mã MĐSD"),
  usingPurposeName: Yup.string()
    .nullable()
    .required("Phải nhập mục đích sử dụng đất"),
  idFeeScheduleIdNew: Yup.number().nullable().required("Phải chọn biểu phí"),
});

const initialFormData: CreateCategoryPurposeType = {
  usingPurposeCode: null,
  usingPurposeName: null,
  assetLevelTwoId: null,
  insideOutside: 0,
  idFeeScheduleIdNew: null,
  status: true,
};

const { INPUT, RADIO, SELECT } = TYPE_FIELD;

const CreateCategoryPurposeModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
}) => {
  const { data: feeScheduleParentData } = useFeeScheduleParent();

  const formCreate = useFormik({
    initialValues: initialFormData,
    validationSchema: formSchema,
    validateOnChange: false,
    onSubmit: async (data: CreateCategoryPurposeType) => {
      try {
        const response = await purposesApi.createPuposes({
          ...data,
          status: data.status ? true : false,
        });
        if (response.data) {
          message.success("Thêm thành công");
          formCreate.resetForm();
          closeModal();
        } else {
          message.error("Tạo mục đích sử dụng không thành công");
        }
      } catch (error) {
        message.error("Tạo mục đích sử dụng không thành công");
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
      label: "Mã MĐSD",
      placeholder: "Nhập mã mục đích sử dụng",
      type: INPUT,
      value: formCreate.values.usingPurposeCode,
      error: formCreate.errors.usingPurposeCode,
      touched: formCreate.touched.usingPurposeCode,
      css: css,
      labelCol: { xs: 6, sm: 6, md: 6, lg: 8, xl: 8 },
      wrapperCol: { xs: 18, sm: 18, md: 18, lg: 20, xl: 20 },
      require: true,
      onChange: (e: any) =>
        handleChangeData({ usingPurposeCode: e.target.value }),
    },
    {
      key: 2,
      label: "MĐSD Đất hiển thị trong tờ trình",
      placeholder: "Nhập mục đích sử dụng",
      type: INPUT,
      value: formCreate.values.usingPurposeName,
      error: formCreate.errors.usingPurposeName,
      touched: formCreate.touched.usingPurposeName,
      css: css,
      labelCol: { xs: 6, sm: 6, md: 6, lg: 8, xl: 8 },
      wrapperCol: { xs: 18, sm: 18, md: 18, lg: 20, xl: 20 },
      require: true,
      onChange: (e: any) =>
        handleChangeData({ usingPurposeName: e.target.value }),
    },
    {
      key: 3,
      label: "Trong/ngoài KCN, CCN, KCX",
      type: RADIO,
      require: true,
      options: [
        {
          label: "Không",
          value: 0,
        },
        {
          label: "Trong KCN, CCN, KCX",
          value: 1,
        },
        {
          label: "Ngoài KCN, CCN, KCX",
          value: 2,
        },
      ],
      css: css,
      labelCol: { xs: 6, sm: 6, md: 6, lg: 8, xl: 8 },
      wrapperCol: { xs: 18, sm: 18, md: 18, lg: 20, xl: 20 },
      value: formCreate.values.insideOutside,
      error: formCreate.errors.insideOutside,
      touched: formCreate.touched.insideOutside,
      allowClear: true,
      onChange: (e: any) => handleChangeData({ insideOutside: e.target.value }),
    },
    {
      key: 4,
      label: "Biểu phí áp dụng",
      require: true,
      type: SELECT,
      options: feeScheduleParentData
        ? feeScheduleParentData?.data.map((el: any) => ({
            label: el.feeCode,
            value: el.id,
          }))
        : [],
      value: formCreate.values.idFeeScheduleIdNew,
      error: formCreate.errors.idFeeScheduleIdNew,
      touched: formCreate.touched.idFeeScheduleIdNew,
      css: css,
      labelCol: { xs: 6, sm: 6, md: 6, lg: 8, xl: 8 },
      wrapperCol: { xs: 18, sm: 18, md: 18, lg: 20, xl: 20 },
      onChange: (value: number) =>
        handleChangeData({ idFeeScheduleIdNew: value }),
    },
    {
      key: 5,
      label: "Trạng thái hoạt động",
      type: RADIO,
      require: true,
      options: [
        {
          label: "Hoạt động",
          value: 1,
        },
        {
          label: "Ngưng hoạt động",
          value: 0,
        },
      ],
      css: css,
      labelCol: { xs: 6, sm: 6, md: 6, lg: 8, xl: 8 },
      wrapperCol: { xs: 18, sm: 18, md: 18, lg: 20, xl: 20 },
      value: formCreate.values.status,
      error: formCreate.errors.status,
      touched: formCreate.touched.status,
      allowClear: true,
      onChange: (e: any) => handleChangeData({ status: e.target.value }),
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
          <CardTitleCustomUpdate title="Thêm mục đích mới" />
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

export default CreateCategoryPurposeModal;
