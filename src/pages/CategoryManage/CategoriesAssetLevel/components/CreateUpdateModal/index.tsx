/* eslint-disable react-hooks/exhaustive-deps */
import { CloseOutlined } from "@ant-design/icons";
import { Button, Form, message, Modal, Row, Space } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import React, { useEffect } from "react";
import "./style.scss";
import { InputFiledParams } from "constants/types/Form_Field_type";
import * as Yup from "yup";
import { useFormik } from "formik";
import { TYPE_FIELD } from "constant/enums";
import ButtonCustom from "components/ButtonCustom";
import InputFields from "components/InputFields";
import {
  assetLevelThreeApi,
  AssetLevelThreeCreateType,
} from "apis/assetLevelThree";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mutate?: any;
  record: AssetLevelThreeCreateType | null;
  assetLevelTwoId: number;
};

const formSchema = Yup.object().shape({
  assetLevelThreeName: Yup.string().nullable().required("Không được để trống"),
  status: Yup.number().nullable().required("Không được để trống"),
});

const initialFormData: AssetLevelThreeCreateType = {
  assetLevelThreeId: null,
  assetLevelThreeName: "",
  assetLevelTwoId: 1,
  status: 1,
};

const { INPUT, RADIO } = TYPE_FIELD;

const ModalCreateUpdateAssetsLevelThree: React.FC<Props> = ({
  isOpen,
  onClose,
  mutate,
  record,
  assetLevelTwoId,
}) => {
  const formCreate = useFormik({
    initialValues: initialFormData,
    validationSchema: formSchema,
    validateOnChange: false,
    onSubmit: async (data: AssetLevelThreeCreateType) => {
      try {
        const response = await assetLevelThreeApi.createUpdateAssetLevelThree({
          ...data,
        });
        if (response) {
          message.success(
            `${
              data.assetLevelThreeId ? "Chỉnh sửa" : "Thêm"
            } TS cấp 3 thành công`
          );
          mutate();
          handleCloseModal();
        } else {
          message.error(
            `${
              data.assetLevelThreeId ? "Chỉnh sửa" : "Thêm"
            } TS cấp 3 không thành công`
          );
        }
      } catch (error) {
        message.error(
          "Lỗi không xác định! Chức năng tài sản cấp 3 không hoạt động"
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

  const handleCloseModal = () => {
    formCreate.resetForm();
    onClose();
  };

  useEffect(() => {
    if (record && isOpen) {
      if (record?.assetLevelThreeId) {
        const dataConvert: any = {
          ...record,
        };
        formCreate.setValues({
          ...formCreate.values,
          ...dataConvert,
          assetLevelTwoId,
        });
      }
    } else {
      formCreate.setValues({
        ...formCreate.values,
        assetLevelTwoId,
      });
    }
  }, [record, isOpen, assetLevelTwoId]);

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const labelCol = { xs: 8, sm: 8, md: 8, lg: 6, xl: 6 };
  const wrapperCol = { xs: 16, sm: 16, md: 16, lg: 18, xl: 18 };

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Tên TS cấp 3",
      type: INPUT,
      require: true,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: formCreate.values.assetLevelThreeName,
      error: formCreate.errors.assetLevelThreeName,
      touched: formCreate.touched.assetLevelThreeName,
      allowClear: true,
      onChange: (e: any) =>
        handleChangeData({ assetLevelThreeName: e.target.value }),
    },

    {
      key: 2,
      label: "Trạng thái",
      type: RADIO,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      require: true,
      options: [
        { value: 1, label: "Hoạt động" },
        { value: 0, label: "Không hoạt động" },
      ],
      value: formCreate.values.status,
      error: formCreate.errors.status,
      touched: formCreate.touched.status,
      onChange: (e: any) => handleChangeData({ status: e.target.value }),
    },
  ];

  return (
    <Modal
      open={isOpen}
      closable={false}
      footer={null}
      onCancel={onClose}
      className="modal-kpi-bonus"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalCreate-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate
            title={`${
              record?.assetLevelThreeId ? "Chỉnh sửa" : "Thêm"
            } tài sản cấp 3`}
          />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={onClose}
            size="small"
          />
        </Row>
        <Form labelAlign="left" labelWrap size="small">
          <Row gutter={[24, 8]}>
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
                  onClose();
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

export default ModalCreateUpdateAssetsLevelThree;
