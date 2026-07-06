/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Modal, Row, Button, Space, Form, message } from "antd";
import { TYPE_FIELD } from "constants/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { CloseOutlined } from "@ant-design/icons";
import { brandApi } from "apis/brand";
import { useFormik } from "formik";
import * as Yup from "yup";
import { VehicleBrandType } from "constant/types";
import renderRequired from "components/RenderRequire";
import "./style.scss";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  record: VehicleBrandType | null;
  action: "add" | "update" | null;
  mutate: any;
  type: number;
};

const { INPUT, TEXT_AREA } = TYPE_FIELD;

const formSchema = Yup.object().shape({
  roadVehicleBrandName: Yup.string().required(
    "Tên nhãn hiệu không được để trống."
  ),
});

const initFormData: VehicleBrandType = {
  roadVehicleBrandId: null,
  roadVehicleBrandName: "",
  roadVehicleBranchType: 1,
  roadVehicleBranchParentId: null,
  roadVehicleBranchDescription: "",
};

const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };

const VehicleBrandModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  record,
  action,
  mutate,
  type,
}) => {
  const form = useFormik({
    initialValues: initFormData,
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: async (data: VehicleBrandType) => {
      try {
        if (action === "add") {
          const res = await brandApi.createVehicleBrand(data);
          if (res?.data?.code === 200) {
            message.success("Thêm nhãn hiệu thành công");
            form.resetForm();
            mutate();
            closeModal();
          } else {
            message.error(res?.data?.message);
          }
        } else if (action === "update") {
          const res = await brandApi.updateVehicleBrand(data);
          if (res?.data?.code === 200) {
            message.success("Cập nhật nhãn hiệu thành công");
            form.resetForm();
            mutate();
            closeModal();
          } else {
            message.error(res?.data?.message);
          }
        } else {
          return;
        }
      } catch (erorr: any) {
        message.error("Thêm nhãn hiệu không thành công");
      }
    },
  });

  useEffect(() => {
    if (isOpenModal) {
      if (action === "add") {
        form.setValues({ ...initFormData, roadVehicleBranchType: type });
      } else if (action === "update") {
        form.setValues({ ...form.values, ...record });
      }
    }
  }, [type, action, record, isOpenModal]);

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: renderRequired("Tên nhãn hiệu"),
      placeholder: "Nhập nhãn hiệu",
      type: INPUT,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      value: form.values.roadVehicleBrandName || "",
      onChange: (e: any) => {
        form.setValues({
          ...form.values,
          roadVehicleBrandName: e.target.value,
        });
      },
      error: form.errors.roadVehicleBrandName,
      touched: form.touched.roadVehicleBrandName,
    },
    {
      key: 2,
      label: "Mô tả",
      placeholder: "Mô tả",
      type: TEXT_AREA,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      value: form.values.roadVehicleBranchDescription || "",
      onChange: (e: any) => {
        form.setValues({
          ...form.values,
          roadVehicleBranchDescription: e.target.value,
        });
      },
    },
  ];

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalCreateRealEstateModal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalCreateRealEstateModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate
            title={action === "add" ? "Thêm nhãn hiệu" : "Sửa nhãn hiệu"}
          />
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
          <Space
            style={{
              display: "flex",
              justifyContent: "right",
              margin: "0.25rem 0",
            }}
          >
            <ButtonCustom label="Hủy bỏ" onClick={closeModal} />
            <ButtonCustom
              label="Lưu lại"
              type="primary"
              bgColor="rgba(40, 98, 175, 1)"
              onClick={form.submitForm}
            />
          </Space>
        </Form>
      </Space>
    </Modal>
  );
};

export default VehicleBrandModal;
