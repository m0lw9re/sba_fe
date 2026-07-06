import React, { useCallback, useEffect } from "react";
import { Modal, Row, Button, Space, Form, message } from "antd";
import "pages/CategoryManage/CategoryRisk/components/EditCategoryRiskModal/style.scss";
import { EditCategoryPurposeType } from "constant/types";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { CloseOutlined } from "@ant-design/icons";
import * as Yup from "yup";
import { purposesApi } from "apis/purposes";
import { useFeeScheduleParent } from "utils/request";
import "./style.scss";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  purposeSelected: EditCategoryPurposeType;
};

const { INPUT, RADIO, SELECT } = TYPE_FIELD;

const formSchema = Yup.object().shape({
  usingPurposeName: Yup.string()
    .nullable()
    .required("Phải nhập mục đích sử dụng đất"),
  idFeeScheduleIdNew: Yup.number().nullable().required("Phải chọn biểu phí"),
});

const EditCategoryPurposeModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  purposeSelected,
}) => {
  const { data: feeScheduleParentData } = useFeeScheduleParent();

  const formEdit = useFormik({
    validationSchema: formSchema,
    initialValues: {} as any | EditCategoryPurposeType,
    onSubmit: async (data: EditCategoryPurposeType) => {
      try {
        const response = await purposesApi.updatePuposes(data);
        if (response.data) {
          message.success("Sửa thành công");
          formEdit.resetForm();
          handleCloseModal();
        } else {
          message.error("Sửa không thành công");
        }
      } catch (error) {
        message.error("Sửa không thành công");
      }
    },
  });

  const handleChange = useCallback(
    (data: any) => {
      formEdit.setValues({ ...formEdit.values, ...data });
    },
    [formEdit.values]
  );

  const handleCloseModal = useCallback(() => {
    closeModal();
    formEdit.resetForm();
  }, [formEdit]);

  useEffect(() => {
    if (purposeSelected && isOpenModal)
      formEdit.setValues({
        ...purposeSelected,
      });
  }, [purposeSelected, isOpenModal]);

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Mã MĐSD",
      type: INPUT,
      require: true,
      value: formEdit.values.usingPurposeCode,
      css: css,
      labelCol: { xs: 6, sm: 6, md: 6, lg: 8, xl: 8 },
      wrapperCol: { xs: 18, sm: 18, md: 18, lg: 20, xl: 20 },
      disable: true,
    },
    {
      key: 2,
      label: "MĐSD Đất hiển thị trong tờ trình",
      placeholder: "Nhập",
      type: INPUT,
      css: css,
      labelCol: { xs: 6, sm: 6, md: 6, lg: 8, xl: 8 },
      wrapperCol: { xs: 18, sm: 18, md: 18, lg: 20, xl: 20 },
      require: true,
      value: formEdit.values.usingPurposeName,
      onChange: (e: any) => handleChange({ usingPurposeName: e.target.value }),
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
      value: formEdit.values.insideOutside,
      error: formEdit.errors.insideOutside,
      touched: formEdit.touched.insideOutside,
      allowClear: true,
      onChange: (e: any) => handleChange({ insideOutside: e.target.value }),
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
      value: formEdit.values.idFeeScheduleIdNew,
      error: formEdit.errors.idFeeScheduleIdNew,
      touched: formEdit.touched.idFeeScheduleIdNew,
      css: css,
      labelCol: { xs: 6, sm: 6, md: 6, lg: 8, xl: 8 },
      wrapperCol: { xs: 18, sm: 18, md: 18, lg: 20, xl: 20 },
      onChange: (value: number) => handleChange({ idFeeScheduleIdNew: value }),
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
      value: formEdit.values.status ? 1 : 0,
      error: formEdit.errors.status,
      touched: formEdit.touched.status,
      allowClear: true,
      onChange: (e: any) =>
        handleChange({ status: e.target.value ? true : false }),
    },
  ];

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modal-Edit-Purpose"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modal-Edit-Purpose-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Sửa mục đích sử dụng đất" />
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
            style={{
              padding: "0 16px",
              paddingBottom: "16px",
              paddingTop: "16px",
            }}
            align={"middle"}
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

export default EditCategoryPurposeModal;
