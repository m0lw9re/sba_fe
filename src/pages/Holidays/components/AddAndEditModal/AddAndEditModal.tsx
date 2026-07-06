import { CloseOutlined } from "@ant-design/icons";
import { Button, Modal, Row, Space } from "antd";
import { Form, message } from "antd";
import { useForm } from "antd/es/form/Form";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import InputFields from "components/InputFields";
import { DATE_TIME_FORMAT } from "constant/enums";
import { CategoryDayOffsType } from "constant/types/categories";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import "./style.scss";
import { categoryApi } from "apis/category";
import * as Yup from "yup";
const { INPUT, RANGE_PICKER } = TYPE_FIELD;
const { day } = DATE_TIME_FORMAT;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  modalType: "add" | "edit" | null;
  editItem?: CategoryDayOffsType | null;
  onSuccess: () => void;
  setLoading: (value: boolean) => void;
};
const formSchema = Yup.object().shape({
  holidayInYearName: Yup.string()
    .nullable()
    .required("Vui lòng nhập tên ngày lễ"),
  startDate: Yup.string().nullable().required("Vui lòng chọn ngày nghỉ"),
});

const AddAndEditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  modalType,
  editItem,
  onSuccess,
  setLoading,
}) => {
  const [form] = useForm();
  const handleChangeForm = (basicData: any) => {
    formControl.setValues((state) => ({
      ...state,
      ...basicData,
    }));
  };

  const initialFormData: CategoryDayOffsType = {
    startDate: "",
    endDate: "",
    holidayInYearName: "",
  };

  const formControl = useFormik({
    initialValues: initialFormData,
    validationSchema: formSchema,
    onSubmit: async (data: CategoryDayOffsType) => {
      data.startDate = dayjs(data.startDate).format();
      data.endDate = dayjs(data.endDate).format();
      setLoading(true);
      if (modalType === "add") {
        try {
          const res = await categoryApi.createDayOffs(data);
          if (res.status === 200) {
            message.success(res.data.message);
            onSuccess();
            form.resetFields();
          } else {
            message.error("Error");
          }
        } catch (error: any) {
          message.error(error.message);
        }
      } else {
        try {
          const res = await categoryApi.updateDayOffs(data);
          if (res.status === 200) {
            message.success(res.data.message);
            onSuccess();
            form.resetFields();
          } else {
            message.error("Error");
          }
        } catch (error: any) {
          message.error(error.message);
        }
      }
      setLoading(false);
    },
  });
  const labelCol = {
    xs: 6,
  };
  const wrapperCol = {
    xs: 18,
  };
  const css = {
    xs: 24,
  };

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Tên ngày lễ",
      type: INPUT,
      value: formControl.values.holidayInYearName,
      onChange: (e: any) =>
        handleChangeForm({
          holidayInYearName: e.target.value,
        }),
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      css,
      require: true,
      error: formControl.errors.holidayInYearName,
    },
    {
      key: 2,
      label: "Ngày nghỉ",
      type: RANGE_PICKER,
      value: [
        formControl.values.startDate
          ? dayjs(formControl.values.startDate)
          : undefined,
        formControl.values.endDate
          ? dayjs(formControl.values.endDate)
          : undefined,
      ],
      allowClear: false,
      formatDatetime: day,
      onChange: (value: any) => {
        const [startDate, endDate] = value;
        handleChangeForm({
          startDate: startDate ? startDate : undefined,
          endDate: endDate ? endDate : undefined,
        });
      },
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      css,
      require: true,
      error: formControl.errors.startDate,
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
  }, [editItem?.holidayInYearId, modalType]);
  return (
    <>
      <Modal
        forceRender={false}
        destroyOnClose
        open={isOpen}
        closable={false}
        footer={null}
        onCancel={onClose}
        onOk={onSuccess}
        className="modal-holidays"
        style={{ display: "flex", justifyContent: "center" }}
        title={
          <Space direction="vertical" align="center">
            <Row
              justify={"space-between"}
              align={"middle"}
              className="modal-holidays-header"
            >
              <CardTitleCustomUpdate
                title={`${modalType === "add" ? "Thêm" : "Sửa"} ngày nghỉ`}
              />
              <Button
                shape="circle"
                icon={<CloseOutlined />}
                onClick={onClose}
                size="small"
              />
            </Row>
            <Form
              size="small"
              labelWrap
              layout="horizontal"
              form={form}
              onFinish={formControl.handleSubmit}
              className="modal-kpi-form"
              labelAlign="left"
              style={{
                padding: "0 4px",
              }}
            >
              <Row style={{ width: "100%" }}>
                <InputFields data={inputFields} />
              </Row>
              <Row
                justify={"end"}
                style={{ marginTop: "8px", width: "100%", columnGap: "12px" }}
              >
                <ButtonCustom label="Hủy bỏ" onClick={onClose} />
                <ButtonCustom
                  htmlType="submit"
                  label="Lưu lại"
                  bgColor="#2862AF"
                  type="primary"
                />
              </Row>
            </Form>
          </Space>
        }
      ></Modal>
    </>
  );
};

export default AddAndEditModal;
