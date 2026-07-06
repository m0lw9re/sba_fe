import { CloseOutlined } from "@ant-design/icons";
import { Button, Modal, Row, Space } from "antd";
import { Form } from "antd";
import { useForm } from "antd/es/form/Form";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import InputFields from "components/InputFields";
import { DATE_TIME_FORMAT } from "constant/enums";
import { AccountantCreateCoSp } from "constant/types";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React, { useRef } from "react";
import "./style.scss";
import ModalViewTable from "./ModalViewTable";

const { INPUT, DATE_PICKER } = TYPE_FIELD;
const { day } = DATE_TIME_FORMAT;

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
};

const ModalViewPhieuThu: React.FC<Props> = ({ isOpenModal, closeModal }) => {
  const [form] = useForm();
  const handleChangeForm = (basicData: any) => {
    formControl.setValues((state: any) => ({
      ...state,
      ...basicData,
    }));
  };

  const btnRefRisks = useRef<{ updateRisks: () => void }>(null);

  const initialFormData: AccountantCreateCoSp = {
    completeDate: "",
    documentId: "",
    object: "",
    name: "",
    adress: "",
    mst: 0,
    email: "",
    quy: "",
    spent: "",
    money: 0,
    description: "",
    month: dayjs().month() + 1,
    year: dayjs().year(),
    day: dayjs().date(),
    fullDay: dayjs(),
  };

  const formControl = useFormik({
    initialValues: initialFormData,
    onSubmit: async (data: AccountantCreateCoSp) => {},
  });

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const css1 = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 6, xl: 6 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 18, xl: 18 };

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Ngày CT",
      css: css1,
      require: true,
      type: DATE_PICKER,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: dayjs(formControl.values.fullDay),
      onChange: (value: string) => {
        formControl.setValues({
          ...formControl.values,
          fullDay: dayjs(value),
          day: dayjs(value).date(),
          month: dayjs(value).month() + 1,
          year: dayjs(value).year(),
        });
      },
    },
    {
      key: 2,
      label: "Số CT gốc",
      require: true,
      type: INPUT,
      css: css1,
      value: formControl.values.documentId,
      onChange: (e: any) => {
        handleChangeForm({ documentId: e.target.value });
      },
    },
    {
      key: 3,
      label: "Đối tượng",
      require: true,
      type: INPUT,
      css: css1,
      value: formControl.values.object,
      onChange: (e: any) => {
        handleChangeForm({ object: e.target.value });
      },
    },
    {
      key: 4,
      label: "Họ tên",
      require: true,
      type: INPUT,
      css: css1,
      value: formControl.values.name,
      onChange: (e: any) => {
        handleChangeForm({ name: e.target.value });
      },
    },
    {
      key: 5,
      label: "Địa chỉ",
      require: true,
      type: INPUT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: formControl.values.adress,
      onChange: (e: any) => {
        handleChangeForm({ adress: e.target.value });
      },
    },
    {
      key: 6,
      label: "Mã số thuế",
      require: true,
      type: INPUT,
      css: css1,
      value: formControl.values.mst,
      onChange: (e: any) => {
        handleChangeForm({ mst: e.target.value });
      },
    },
    {
      key: 7,
      label: "Email",
      require: true,
      type: INPUT,
      css: css1,
      value: formControl.values.email,
      onChange: (e: any) => {
        handleChangeForm({ email: e.target.value });
      },
    },
    {
      key: 8,
      label: "Quỹ/TK",
      require: true,
      type: INPUT,
      css: css1,
      value: formControl.values.quy,
      onChange: (e: any) => {
        handleChangeForm({ quy: e.target.value });
      },
    },
    {
      key: 9,
      label: "Khoản chi",
      require: true,
      type: INPUT,
      css: css1,
      value: formControl.values.spent,
      onChange: (e: any) => {
        handleChangeForm({ spent: e.target.value });
      },
    },
    {
      key: 10,
      label: "Số tiền",
      require: true,
      type: INPUT,
      css: css,
      value: formControl.values.money,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      onChange: (e: any) => {
        handleChangeForm({ money: e.target.value });
      },
    },
    {
      key: 11,
      label: "Ghi chú",
      require: true,
      type: INPUT,
      css: css,
      value: formControl.values.description,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      onChange: (e: any) => {
        handleChangeForm({ description: e.target.value });
      },
    },
  ];

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={() => {
        closeModal();
        formControl.resetForm();
      }}
      className="modalViewModal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalViewModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Chi tiết phiếu thu" />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={() => {
              closeModal();
              formControl.resetForm();
            }}
            size="small"
          />
        </Row>
        <Form
          form={form}
          onFinish={formControl.handleSubmit}
          labelAlign="left"
          labelWrap
          size="small"
        >
          <Row gutter={[24, 4]}>
            <InputFields data={inputFields} />
          </Row>
          <div className="table-addition" style={{ paddingTop: "16px" }}>
            <ModalViewTable />
          </div>
          <Row
            justify={"end"}
            style={{ padding: "8px 0px", marginTop: 4 }}
            className="button-row"
          >
            <Space>
              <ButtonCustom
                label="Đóng"
                onClick={() => {
                  closeModal();
                  formControl.resetForm();
                }}
              />
              <ButtonCustom
                // htmlType="submit"
                label="Từ chối"
                type="primary"
                bgColor="rgba(242, 91, 96, 1)"
                onClick={formControl.submitForm}
              />
              <ButtonCustom
                // htmlType="submit"
                label="Duyệt"
                type="primary"
                bgColor="rgba(40, 98, 175, 1)"
                onClick={formControl.submitForm}
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default ModalViewPhieuThu;
