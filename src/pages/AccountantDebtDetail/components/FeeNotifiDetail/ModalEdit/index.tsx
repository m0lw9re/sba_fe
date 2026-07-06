import { TYPE_FIELD, DATE_TIME_FORMAT } from "constant/enums";
import React, { useCallback, useEffect, useState } from "react";
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
  isFullyReceived: number;
  soTien: number;
  totalPrice: number;
  congNo: number;
  feeNotificationId: string;
  appraisalFileId: string;
  feeContentId: number;
  price: number;
  reducedFee: number;
  daThu: number;
  ngayGhiNhanNb: string | null;
}

type Props = {
  isOpen: boolean;
  internalRecording: any;
  closeModal: () => void;
  mutateFeeModalTable: any;
  updateData: any;
};

const { INPUT_NUMBER, RADIO, DATE_PICKER } = TYPE_FIELD;

const initialValues: InitialValuesType = {
  isFullyReceived: 2,
  soTien: 0,
  feeNotificationId: "",
  appraisalFileId: "",
  feeContentId: 0,
  totalPrice: 0,
  congNo: 0,
  price: 0,
  reducedFee: 0,
  daThu: 0,
  ngayGhiNhanNb: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS"),
};

const Edit: React.FC<Props> = ({
  isOpen,
  closeModal,
  internalRecording,
  mutateFeeModalTable,
  updateData,
}) => {
  const [priceForSchema, setPriceForSchema] = useState<number>(0);

  const genSchema = () => {
    return priceForSchema
      ? Yup.object().shape({
          isFullyReceived: Yup.number()
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
              "Số tiền ghi nhận nội bộ quá lớn!",
              function (value) {
                const ghiNhanNoiBo = this.parent.isFullyReceived;
                const price = this.parent.price;
                const reducedFee = this.parent.reducedFee;
                const daThu = this.parent.daThu;

                const cal = value + daThu - reducedFee;

                if (ghiNhanNoiBo === 2 && value !== undefined && cal > price) {
                  return false;
                }

                return true;
              }
            ),
          ngayGhiNhanNb: Yup.string()
            .required("Vui lòng chọn ngày ghi nhận!")
            .typeError("Vui lòng chọn ngày ghi nhận!"),
        })
      : Yup.object().shape({
          isFullyReceived: Yup.number()
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
              "Số tiền ghi nhận nội bộ quá lớn!",
              function (value) {
                const ghiNhanNoiBo = this.parent.isFullyReceived;
                const price = this.parent.price;
                const reducedFee = this.parent.reducedFee;
                const daThu = this.parent.daThu;

                const cal = value + daThu - reducedFee;

                if (ghiNhanNoiBo === 2 && value !== undefined && cal > price) {
                  return false;
                }

                return true;
              }
            ),
          ngayGhiNhanNb: Yup.string().nullable(),
        });
  };

  const form = useFormik({
    initialValues: initialValues,
    validationSchema: genSchema(),
    validateOnChange: true,
    onSubmit: async (data: InitialValuesType) => {
      try {
        updateData(
          {
            received: data.soTien,
            receiveDate: data.ngayGhiNhanNb,
            isFullyReceived: data.isFullyReceived,
          },
          internalRecording.index
        );
        handleCloseModal();
      } catch (error) {
        message.error("Ghi nhận nội bộ thất bại!");
      }
    },
  });

  const handleModalClose = () => {
    form.setValues({
      ...initialValues,
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
    setPriceForSchema(internalRecording?.edit?.soTien || 0);
  }, [internalRecording]);

  const inputs: InputFiledParams[] = [
    {
      key: 1,
      label: "Ghi nhận nội bộ",
      type: RADIO,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      value: form.values.isFullyReceived,
      require: true,
      options: [
        { value: 2, label: "Một phần" },
        { value: 1, label: "Toàn phần" },
      ],
      onChange: (e: any) => {
        const updatedValues = {
          isFullyReceived: e.target.value,
          ...(e.target.value === 1 ? { soTien: form.values.totalPrice } : {}),
          ngayGhiNhanNb: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS"),
        };
        handleChange(updatedValues);
      },
    },
    {
      key: 2,
      type: INPUT_NUMBER,
      disable: form.values.isFullyReceived === 1 ? true : false,
      label: "Số tiền ghi nhận nội bộ",
      currencable: true,
      isRounded: true,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      require: true,
      value:
        form.values.isFullyReceived === 1
          ? form.values.totalPrice
          : form.values.soTien,
      error: form.errors.soTien,
      touched: form.touched.soTien,
      max: form.values.totalPrice,
      onChange: (value: number) => {
        if (value)
          handleChange({
            soTien: value,
            ngayGhiNhanNb: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS"),
          });
        else handleChange({ soTien: value, ngayGhiNhanNb: null });
        setPriceForSchema(value);
      },
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
            ? dayjs(value).format("YYYY-MM-DDTHH:mm:ss.SSS")
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
