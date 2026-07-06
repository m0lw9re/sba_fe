import { TYPE_FIELD, DATE_TIME_FORMAT } from "constant/enums";
import React, { useCallback, useEffect } from "react";
import { useFormik } from "formik";
import { Button, Form, Modal, Row, Space, message } from "antd";
import { InputFiledParams } from "constants/types/Form_Field_type";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import Icons from "assets/icons";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import { appraisalFilesApi } from "apis/appraisalFiles";
import * as Yup from "yup";
import dayjs from "dayjs";
import "./style.scss";
interface InitialValuesType {
  ghiNhanNoiBo: number;
  soTien: number;
  totalPrice: number;
  congNo: number;
  feeNotificationId: string;
  appraisalFileId: string;
  feeContentId: number;
  ngayGhiNhanNb: string;
}

type Props = {
  isOpen: boolean;
  internalRecording: any;
  closeModal: () => void;
  mutateFeeModalTable: any;
};

const { INPUT_NUMBER, RADIO, DATE_PICKER } = TYPE_FIELD;

const formSchema = Yup.object().shape({
  ghiNhanNoiBo: Yup.number()
    .required('Vui lòng chọn "Ghi nhận nội bộ"!')
    .typeError('Vui lòng chọn "Ghi nhận nội bộ"!')
    .nullable(),
  soTien: Yup.number()
    .required("Vui lòng nhập số tiền!")
    .min(0, "Số tiền phải lớn hơn hoặc bằng 0!")
    .integer("Vui lòng nhập một số nguyên!")
    .typeError("Vui lòng nhập một số!")
    .test(
      "soTienGhiNhan",
      "Số tiền ghi nhận nội bộ không được lớn hơn công nợ!",
      function (value) {
        const ghiNhanNoiBo = this.parent.ghiNhanNoiBo;
        const congNo = this.parent.congNo;

        if (ghiNhanNoiBo === 2 && value !== undefined && value > congNo) {
          return false;
        }

        return true;
      }
    ),
  ngayGhiNhanNb: Yup.string()
    .required("Vui lòng chọn ngày ghi nhận!")
    .typeError("Vui lòng chọn ngày ghi nhận!")
    .nullable(),
});

// 22/1/2024 - Đã xử lý ghi nhận nội bộ chờ mapping api
const Edit: React.FC<Props> = ({
  isOpen,
  closeModal,
  internalRecording,
  mutateFeeModalTable,
}) => {
  const initialValues: InitialValuesType = {
    ghiNhanNoiBo: 2,
    soTien: 0,
    feeNotificationId: "",
    appraisalFileId: "",
    feeContentId: 0,
    totalPrice: 0,
    congNo: 0,
    ngayGhiNhanNb: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
  };

  const form = useFormik({
    initialValues: initialValues,
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: async (data: InitialValuesType) => {
      try {
        let dataPut = {
          internalRecordType: data.ghiNhanNoiBo,
          feeNotificationId: data.feeNotificationId,
          appraisalFileId: data.appraisalFileId,
          feeContentId: data.feeContentId,
          received: data.soTien,
          receiveDate: data.ngayGhiNhanNb,
        };
        if (
          form.values.ghiNhanNoiBo === 2 &&
          form.values.soTien > form.values.congNo
        ) {
          message.error("Số tiền ghi nhận nội bộ không được lớn hơn công nợ!");
          return;
        }
        let res = await appraisalFilesApi.updateInternalRecord(dataPut);
        if (res.data.code === 200) {
          mutateFeeModalTable();
          message.success(res.data.message);
        }
        setTimeout(() => {
          handleCloseModal();
        }, 1500);
      } catch (error) {
        message.error("Ghi nhận nội bộ thất bại!");
      }
    },
  });

  const handleModalClose = () => {
    form.setValues({
      ...form.values,
      ghiNhanNoiBo: 2,
      soTien: 0,
      feeNotificationId: "",
      appraisalFileId: "",
      feeContentId: 0,
      ngayGhiNhanNb: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
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
  }, [form]);

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

  useEffect(() => {
    form.setValues({ ...internalRecording.edit });
  }, [internalRecording]);

  const inputs: InputFiledParams[] = [
    {
      key: 1,
      label: "Ghi nhận nội bộ",
      type: RADIO,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      value: form.values.ghiNhanNoiBo,
      require: true,
      options: [
        { value: 2, label: "Một phần" },
        { value: 1, label: "Toàn phần" },
      ],
      onChange: (e: any) => {
        const updatedValues = {
          ghiNhanNoiBo: e.target.value,
          ...(e.target.value === 1 ? { soTien: form.values.totalPrice } : {}),
        };
        handleChange(updatedValues);
      },
    },
    {
      key: 2,
      type: INPUT_NUMBER,
      disable: form.values.ghiNhanNoiBo === 1 ? true : false,
      label: "Số tiền ghi nhận nội bộ",
      currencable: true,
      isRounded: true,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      require: true,
      value:
        form.values.ghiNhanNoiBo === 1
          ? form.values.totalPrice
          : form.values.soTien,
      error: form.errors.soTien,
      touched: form.touched.soTien,
      onChange: (value: number) => handleChange({ soTien: value }),
    },
    {
      key: 3,
      type: DATE_PICKER,
      label: "Ngày ghi nhận nội bộ",
      formatDatetime: DATE_TIME_FORMAT.momentTime,
      placeholder: "DD/MM/YYYY - hh:mm:ss",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      require: true,
      showTime: true,
      value: form.values.ngayGhiNhanNb
        ? dayjs(form.values.ngayGhiNhanNb)
        : null,
      error: form.errors.ngayGhiNhanNb,
      touched: form.touched.ngayGhiNhanNb,
      onChange: (value: any) =>
        handleChange({
          ngayGhiNhanNb: value
            ? dayjs(value).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
            : null,
        }),
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
