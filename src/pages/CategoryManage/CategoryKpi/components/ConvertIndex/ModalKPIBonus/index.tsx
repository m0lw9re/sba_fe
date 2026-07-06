/* eslint-disable react-hooks/exhaustive-deps */
import { CloseOutlined } from "@ant-design/icons";
import { Button, Form, message, Modal, Row, Space } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import React, { useEffect } from "react";
import "./style.scss";
import { InputFiledParams } from "constants/types/Form_Field_type";
import * as Yup from "yup";
import { useFormik } from "formik";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import ButtonCustom from "components/ButtonCustom";
import InputFields from "components/InputFields";
import dayjs from "dayjs";
import {
  KPIBonusCoefficientCreateType,
  KPIBonusCoefficientType,
} from "constant/types/categories";
import { KPI_BONUS_COEFFICIENT_OPTIONS } from "constant/common";
import { categoryApi } from "apis/category";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mutate?: any;
  record: KPIBonusCoefficientType | null;
};

const formSchema = Yup.object().shape({
  type: Yup.string().nullable().required("Không được để trống"),
  kpiBonusCoefficient: Yup.number().nullable().required("Không được để trống"),
  fromDate: Yup.string().nullable().required("Không được để trống"),
  toDate: Yup.string().nullable().required("Không được để trống"),
});

const initialFormData: KPIBonusCoefficientCreateType = {
  id: null,
  type: "1",
  kpiBonusCoefficient: null,
  fromDate: null,
  toDate: null,
};

const { INPUT_NUMBER, DATE_PICKER, SELECT } = TYPE_FIELD;

const ModalKPIBonus: React.FC<Props> = ({
  isOpen,
  onClose,
  mutate,
  record,
}) => {
  const formCreate = useFormik({
    initialValues: initialFormData,
    validationSchema: formSchema,
    validateOnChange: false,
    onSubmit: async (data: KPIBonusCoefficientCreateType) => {
      try {
        if (data.id) {
          const response = await categoryApi.updateKPIBonusCoefficient({
            ...data,
          });
          console.log("hhhhhhh: ", response);
          if (response?.data?.code === 200) {
            message.success("Cập nhật hệ số thưởng KPI thành công");
            mutate();
            handleCloseModal();
          } else {
            message.error(
              response?.data?.message ||
                "Cập nhật hệ số thưởng KPI không thành công"
            );
          }
        } else {
          const response = await categoryApi.createKPIBonusCoefficient({
            ...data,
          });

          if (response?.data?.code === 200) {
            message.success("Thêm hệ số thưởng KPI thành công");
            mutate();
            handleCloseModal();
          } else {
            message.error(
              response?.data?.message ||
                "Thêm hệ số thưởng KPI không thành công"
            );
          }
        }
      } catch (error) {
        message.error(
          "Lỗi không xác định! Chức năng hệ số thưởng KPI không hoạt động"
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
    if (record?.id && isOpen) {
      const dataConvert: KPIBonusCoefficientCreateType = {
        id: record.id,
        type: record.type,
        kpiBonusCoefficient: record.kpiBonusCoefficient,
        fromDate: record.fromDate,
        toDate: record.toDate,
      };
      formCreate.setValues({ ...formCreate.values, ...dataConvert });
    }
  }, [record, isOpen]);

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const labelCol = { xs: 8, sm: 8, md: 8, lg: 6, xl: 6 };
  const wrapperCol = { xs: 16, sm: 16, md: 16, lg: 18, xl: 18 };

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Loại Hệ số thưởng",
      placeholder: "Chọn loại hệ số thưởng",
      type: SELECT,
      options: KPI_BONUS_COEFFICIENT_OPTIONS,
      value: formCreate.values.type,
      error: formCreate.errors.type,
      touched: formCreate.touched.type,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      require: true,
      onChange: (value: string) => handleChangeData({ type: value }),
    },
    {
      key: 2,
      label: "Thưởng (VNĐ)",
      type: INPUT_NUMBER,
      require: true,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: formCreate.values.kpiBonusCoefficient,
      error: formCreate.errors.kpiBonusCoefficient,
      touched: formCreate.touched.kpiBonusCoefficient,
      allowClear: true,
      onChange: (value: number) =>
        handleChangeData({ kpiBonusCoefficient: value }),
      currencable: true,
    },
    {
      key: 3,
      type: DATE_PICKER,
      label: "Từ ngày",
      formatDatetime: DATE_TIME_FORMAT.day,
      placeholder: DATE_TIME_FORMAT.day,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      require: true,
      showTime: false,
      value: formCreate.values.fromDate
        ? dayjs(formCreate.values.fromDate)
        : null,
      error: formCreate.errors.fromDate,
      touched: formCreate.touched.fromDate,
      onChange: (value: any) =>
        handleChangeData({
          fromDate: value ? dayjs(value).format("YYYY-MM-DDT00:00:00") : null,
        }),
    },
    {
      key: 3,
      type: DATE_PICKER,
      label: "Đến ngày",
      formatDatetime: DATE_TIME_FORMAT.day,
      placeholder: DATE_TIME_FORMAT.day,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      require: true,
      showTime: false,
      value: formCreate.values.toDate ? dayjs(formCreate.values.toDate) : null,
      error: formCreate.errors.toDate,
      touched: formCreate.touched.toDate,
      onChange: (value: any) =>
        handleChangeData({
          toDate: value ? dayjs(value).format("YYYY-MM-DDT00:00:00") : null,
        }),
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
            title={`${record?.id ? "Chỉnh sửa" : "Thêm"} hệ số thưởng KPI`}
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

export default ModalKPIBonus;
