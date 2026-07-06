import { TYPE_FIELD } from "constant/enums";
import { EditAccountantFeeNotificationsUpdate } from "constant/types/accountantFeeNotificationsUpdate";
import * as Yup from "yup";
import React, { useCallback, useEffect } from "react";
import { useFormik } from "formik";
import {
  Button,
  DatePickerProps,
  Form,
  Modal,
  Row,
  Space,
  message,
} from "antd";
import Checkbox, { CheckboxChangeEvent } from "antd/es/checkbox";
import { InputFiledParams } from "constants/types/Form_Field_type";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import Icons from "assets/icons";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  edit?: EditAccountantFeeNotificationsUpdate;
};

const { INPUT, SELECT } = TYPE_FIELD;

const initialValues: EditAccountantFeeNotificationsUpdate = {
  expentId: null,
  expentName: "",
  type: "",
  description: "",
  status: 1,
};

const Edit: React.FC<Props> = ({ isOpen, closeModal, edit }) => {
  const form = useFormik({
    initialValues: initialValues,
    validateOnChange: false,
    onSubmit: async (data: EditAccountantFeeNotificationsUpdate) => {},
  });

  const handleChange = useCallback(
    (data: any) => {
      form.setValues({ ...form.values, ...data });
    },
    [form.values]
  );

  const handleCloseModal = useCallback(() => {
    closeModal();
    form.resetForm();
  }, [form]);

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

  useEffect(() => {
    form.setValues({ ...edit });
  }, [edit]);

  const inputs: InputFiledParams[] = [
    {
      key: 1,
      type: INPUT,
      css: css,
      label: "Mã khoản",
      require: true,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.expentId,
      onChange: (e: any) => {
        handleChange({ expentId: e.target.value });
      },
    },
    {
      key: 2,
      type: INPUT,
      label: "Tên khoản",
      require: true,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.expentName,
      onChange: (e: any) => handleChange({ expentName: e.target.value }),
    },
    {
      key: 3,
      type: SELECT,
      label: "Loại",
      options: [
        {
          label: "Phiếu thu",
          value: "1",
        },
        {
          label: "Phiếu chi",
          value: "2",
        },
      ],
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.type,
      onChange: (value: string) => handleChange({ type: value }),
    },
    {
      key: 4,
      type: INPUT,
      label: "Ghi chú",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.description,
      onChange: (value: string) => handleChange({ description: value }),
    },
  ];

  const handleCheck = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      form.setValues({ ...form.values, status: 1 });
    } else form.setValues({ ...form.values, status: 0 });
  };
  return (
    <Modal
      closeIcon={null}
      open={isOpen}
      onCancel={closeModal}
      footer={null}
      className="user-modal-edit-container"
    >
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <Row
          justify={"space-between"}
          className="modal-header"
          align={"middle"}
        >
          <CardTitleCustomUpdate title="Sửa thông tin khoản thu - chi" />
          <Button
            size="small"
            shape="circle"
            icon={<Icons.close />}
            onClick={handleCloseModal}
          />
        </Row>
        <Form
          labelAlign="left"
          labelWrap
          size="small"
          style={{ padding: "0 16px" }}
        >
          <Row gutter={[24, 16]} align={"middle"}>
            <InputFields data={inputs} />
          </Row>
        </Form>
        <Row
          justify={"space-between"}
          style={{ padding: "0 16px", paddingBottom: "16px" }}
          align={"middle"}
        >
          <Checkbox
            onChange={handleCheck}
            checked={form.values.status ? true : false}
          >
            Hoạt động
          </Checkbox>
          <Space>
            <ButtonCustom label="Hủy bỏ" size="small" onClick={closeModal} />
            <ButtonCustom
              onClick={form.submitForm}
              label="Lưu lại"
              type="primary"
              size="small"
              bgColor="rgba(40, 98, 175, 1)"
            />
          </Space>
        </Row>
      </Space>
    </Modal>
  );
};

export default Edit;
