import { CloseOutlined } from "@ant-design/icons";
import { Button, message, Modal, Row, Space } from "antd";
import { Form } from "antd";
import { useForm } from "antd/es/form/Form";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import InputFields from "components/InputFields";
import { DATE_TIME_FORMAT } from "constant/enums";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import "./style.scss";
import { KPIsByGroup } from "constant/types";
import { groupKpis } from "apis/groupKpis";
import * as Yup from "yup";

const { INPUT, RANGE_PICKER, INPUT_NUMBER } = TYPE_FIELD;
const { day } = DATE_TIME_FORMAT;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  modalType: "add" | "edit" | null;
  editItem?: KPIsByGroup | null;
  onSuccess: () => void;
  setLoading: (value: boolean) => void;
};

const ModalAddGroupKPI: React.FC<Props> = ({
  isOpen,
  onClose,
  modalType,
  editItem,
  onSuccess,
  setLoading,
}) => {
  // const [form] = useForm();
  const handleChangeForm = (basicData: any) => {
    formControl.setValues((state: any) => ({
      ...state,
      ...basicData,
    }));
  };

  const initialFormData: KPIsByGroup = {
    fromDate: null,
    toDate: null,
    annualRevenue: "",
    kpiGroupId: "",
    kpiGroupName: "",
    kpiHSMonth: "",
    kpiHSYear: "",
    monthlyRevenue: "",
  };

  const formSchema = Yup.object().shape({
    kpiGroupName: Yup.string().nullable().required("Vui lòng nhập tên"),
    kpiHSMonth: Yup.number()
      .nullable()
      .required("Vui lòng nhập HS hoàn thành tháng"),
    kpiHSYear: Yup.number()
      .nullable()
      .required("Vui lòng nhập HS hoàn thành năm"),
    monthlyRevenue: Yup.number()
      .nullable()
      .required("Vui lòng nhập doanh thu tháng"),
    annualRevenue: Yup.number()
      .nullable()
      .required("Vui lòng nhập doanh thu năm"),
    fromDate: Yup.string().nullable().required("Vui lòng nhập hiệu lực"),
    toDate: Yup.string().nullable().required("Vui lòng nhập hiệu lực"),
  });

  const formControl = useFormik({
    initialValues: initialFormData,
    validationSchema: formSchema,
    onSubmit: async (data: KPIsByGroup) => {
      try {
        setLoading(true);
        const convertedData = {
          ...data,
          fromDate: dayjs(data.fromDate).format(),
          toDate: dayjs(data.toDate).format(),
        };

        if (modalType === "add") {
          const res = await groupKpis.createGroup(convertedData);
          if (res?.status === 200) {
            message.success(res?.data?.message || "Thêm mới thành công");
            onSuccess();
            // form.resetFields();
          } else {
            message.error("Thêm mới thất bại");
          }
        } else {
          const res = await groupKpis.updateGroup(convertedData);
          if (res?.status === 200) {
            message.success(res?.data?.message || "Chỉnh sửa thành công");
            onSuccess();
            // form.resetFields();
          } else {
            message.error("Chỉnh sửa thất bại");
          }
        }
      } catch (error) {
        message.error("Thao tác không thành công!");
      } finally {
        setLoading(false);
      }
    },
  });

  const css = { xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 15 };

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Tên nhóm",
      type: INPUT,
      value: formControl.values.kpiGroupName,
      onChange: (e: any) =>
        handleChangeForm({
          kpiGroupName: e.target.value,
        }),
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      css,
      require: true,
      error: formControl.errors.kpiGroupName,
      touched: formControl.touched.kpiGroupName,
      disable: modalType === "edit" ? true : false,
    },
    {
      key: 2,
      label: "Số lượng hồ sơ hoàn thành tháng",
      type: INPUT_NUMBER,
      value: formControl.values.kpiHSMonth,
      onChange: (value: any) =>
        handleChangeForm({
          kpiHSMonth: value,
        }),
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      css,
      require: true,
      error: formControl.errors.kpiHSMonth,
      touched: formControl.touched.kpiHSMonth,
    },
    {
      key: 3,
      label: "Số lượng hồ sơ hoàn thành năm",
      type: INPUT_NUMBER,
      value: formControl.values.kpiHSYear,
      onChange: (value: any) =>
        handleChangeForm({
          kpiHSYear: value,
        }),
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      css,
      require: true,
      error: formControl.errors.kpiHSYear,
      touched: formControl.touched.kpiHSYear,
    },
    {
      key: 4,
      label: "Mức doanh thu tháng",
      type: INPUT_NUMBER,
      value: formControl.values.monthlyRevenue,
      onChange: (value: any) =>
        handleChangeForm({
          monthlyRevenue: value,
        }),
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      css,
      require: true,
      error: formControl.errors.monthlyRevenue,
      touched: formControl.touched.monthlyRevenue,
      currencable: true,
    },
    {
      key: 5,
      label: "Mức doanh thu năm",
      type: INPUT_NUMBER,
      value: formControl.values.annualRevenue,
      onChange: (value: any) =>
        handleChangeForm({
          annualRevenue: value,
        }),
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      css,
      require: true,
      error: formControl.errors.annualRevenue,
      touched: formControl.touched.annualRevenue,
      currencable: true,
    },
    {
      key: 6,
      label: "Hiệu lực",
      type: RANGE_PICKER,
      value: [
        formControl.values?.fromDate
          ? dayjs(formControl.values.fromDate)
          : null,
        formControl.values?.toDate ? dayjs(formControl.values.toDate) : null,
      ],
      allowClear: false,
      formatDatetime: day,
      onChange: (value: any) => {
        const [fromDate, toDate] = value;
        handleChangeForm({
          fromDate: fromDate ? fromDate : null,
          toDate: toDate ? toDate : null,
        });
      },
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      css,
      require: true,
      error: formControl.errors.fromDate || formControl.errors.toDate,
      touched: formControl.touched.fromDate || formControl.touched.toDate,
    },
  ];
  // if is edit mode then get and set value for form
  useEffect(() => {
    formControl.resetForm();
    if (modalType === "edit" && editItem) {
      formControl.setValues((state) => ({
        ...state,
        ...editItem,
      }));
    }
  }, [editItem?.kpiGroupId, modalType]);

  return (
    <>
      <Modal
        // forceRender={false}
        // destroyOnClose
        open={isOpen}
        closable={false}
        footer={null}
        onCancel={onClose}
        onOk={onSuccess}
        className="modal-group"
        style={{ display: "flex", justifyContent: "center" }}
        title={
          <Space direction="vertical" align="center">
            <Row
              justify={"space-between"}
              align={"middle"}
              className="modal-group-header"
            >
              <CardTitleCustomUpdate
                title={`${modalType === "add" ? "Thêm" : "Sửa"} nhóm`}
              />
              <Button
                shape="circle"
                icon={<CloseOutlined />}
                onClick={onClose}
                size="small"
              />
            </Row>
            <Form
              size="large"
              labelWrap
              layout="horizontal"
              // form={form}
              // onFinish={formControl.handleSubmit}
              className="modal-kpi-form"
              labelAlign="left"
              style={{
                padding: "0 4px",
              }}
            >
              <Row style={{ width: "100%" }}>
                <InputFields data={inputFields} />
              </Row>
            </Form>
            <Row
              justify={"end"}
              style={{ marginTop: "8px", width: "100%", columnGap: "12px" }}
            >
              <ButtonCustom label="Hủy bỏ" onClick={onClose} />
              <ButtonCustom
                // htmlType="submit"
                label="Lưu lại"
                bgColor="#2862AF"
                type="primary"
                onClick={() => formControl.submitForm()}
              />
            </Row>
          </Space>
        }
      ></Modal>
    </>
  );
};

export default ModalAddGroupKPI;
