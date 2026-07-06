import { TYPE_FIELD, DATE_TIME_FORMAT } from "constant/enums";
import React, { useCallback, useEffect } from "react";
import { useFormik } from "formik";
import { Button, Form, Modal, Popconfirm, Row, Space, message } from "antd";
import { InputFiledParams } from "constants/types/Form_Field_type";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import Icons from "assets/icons";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import { appraisalFilesApi } from "apis/appraisalFiles";
import * as Yup from "yup";
import dayjs from "dayjs";
import "./style.scss";
import { syncEMSApi } from "apis/syncEMS";
interface InitialValuesType {
  statusEms: number;
  note: string;
}

type Props = {
  isOpen: boolean;
  internalRecording: any;
  selectedRecord: any | null;
  closeModal: () => void;
};

const { TEXT_AREA, RADIO } = TYPE_FIELD;

const formSchema = Yup.object().shape({
  statusEms: Yup.number()
    .required("Vui lòng chọn trạng thái!")
    .typeError("Vui lòng chọn trạng thái!")
    .nullable(),
});

// 22/1/2024 - Đã xử lý ghi nhận nội bộ chờ mapping api
const Edit: React.FC<Props> = ({
  isOpen,
  closeModal,
  selectedRecord,
  internalRecording,
}) => {
  const initialValues: InitialValuesType = {
    statusEms: 6,
    note: "",
  };

  const form = useFormik({
    initialValues: initialValues,
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: async (data: InitialValuesType) => {
      try {
        if (!selectedRecord) {
          handleCloseModal();
          return;
        }
        const res = await syncEMSApi.updateStatusEms({
          accDataId: selectedRecord.accDataId,
          feeContentId: selectedRecord.feeContentId,
          statusEms: data.statusEms,
          note: data.note,
        });
        if (res.data.code === 200) {
          message.success("Thay đổi trạng thái thành công!");
        } else {
          message.error("Thay đổi trạng thái thất bại!");
        }
        setTimeout(() => {
          handleCloseModal();
        }, 1500);
      } catch (error) {
        message.error("Thay đổi trạng thái thất bại!");
      }
    },
  });

  const handleModalClose = () => {
    form.setValues({
      ...form.values,
    });
    closeModal();
  };

  const handleChange = useCallback(
    (data: any) => {
      form.setValues({ ...form.values, ...data });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.values]
  );

  const handleCloseModal = useCallback(() => {
    closeModal();
    form.resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

  useEffect(() => {
    form.setValues({ ...internalRecording.edit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalRecording]);

  const inputs: InputFiledParams[] = [
    {
      key: 1,
      label: "Trạng thái",
      type: RADIO,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      value: form.values.statusEms,
      require: true,
      options: [
        {
          label: "Hoàn tiền",
          value: 5,
        },
        {
          label: "Đối chiếu thủ công",
          value: 6,
        },
      ],
      error: form.errors.statusEms,
      touched: form.touched.statusEms,
      onChange: (e: any) => handleChange({ statusEms: e.target.value }),
      defaultValue: form.values.statusEms === 6,
    },
    {
      key: 2,
      label: "Ghi chú",
      type: TEXT_AREA,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      value: form.values.note,
      error: form.errors.note,
      touched: form.touched.note,
      onChange: (e: any) => handleChange({ note: e.target.value }),
    },
  ];

  return (
    <Modal
      closeIcon={null}
      open={isOpen}
      onCancel={handleModalClose}
      footer={null}
      className="user-modal-edit-container"
    >
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <Row
          justify={"space-between"}
          className="modal-header"
          align={"middle"}
        >
          <CardTitleCustomUpdate title={internalRecording.title} />
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
          justify={"end"}
          style={{ padding: "0 16px", paddingBottom: "16px" }}
          align={"middle"}
        >
          <Space>
            <ButtonCustom
              label="Hủy bỏ"
              size="small"
              onClick={() => {
                handleModalClose();
              }}
            />
            <Popconfirm
              title="Bạn có chắc chắn muốn thay đổi trạng thái của khoản thu này không?"
              onConfirm={form.submitForm}
              okText="Ok"
              cancelText="Hủy"
              placement="bottomLeft"
            >
              <ButtonCustom
                label="Lưu lại"
                type="primary"
                size="small"
                bgColor="rgba(40, 98, 175, 1)"
              />
            </Popconfirm>
          </Space>
        </Row>
      </Space>
    </Modal>
  );
};

export default Edit;
