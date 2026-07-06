import { Form, Row, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { categoryApi } from "apis/category";
import ButtonCustom from "components/ButtonCustom";
import InputFields from "components/InputFields";
import { useAppDispatch, useAppSelector } from "configs/hooks";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import "./style.scss";
import { useEffect } from "react";
import { setActiveKeyModal } from "../Store/CategoryKpiSlice";
import { listTypeDoc } from "constant/common";

const { INPUT, INPUT_NUMBER, SELECT } = TYPE_FIELD;

type Props = {
  onClose: () => void;
  modalType: "add" | "edit" | null;
  record?: any;
  mutate?: any;
};
const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
const css2 = { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 };

const EditForm = (props: Props) => {
  const { onClose, mutate } = props;
  const record = useAppSelector((state) => state.categoryKpiSlice.record);
  const modalType = useAppSelector((state) => state.categoryKpiSlice.modalType);
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Loại hồ sơ",
      type: SELECT,
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 4, xl: 4 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 20, xl: 20 },
      name: "type",
      options: listTypeDoc.map((e) => ({
        value: e,
        label: e,
      })),
      rules: [{ required: true, message: "Chưa chọn loại hồ sơ" }],
      require: true,
    },
    {
      key: 2,
      name: "profileCoefficient",
      label: "Hệ số",
      type: INPUT,
      css: css2,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
    },
    {
      key: 3,
      name: "description",
      label: "Ghi chú",
      type: INPUT,
      css: css2,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
    },
  ];

  // if is edit mode then get and set value for form
  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
    }
    if (!record || modalType === "add") {
      form.resetFields();
    }
  }, [record, modalType]);
  const handleSubmit = async (values: any) => {
    // message.info("Chức năng đang hoàn thiện");
    try {
      if (modalType === "add") {
        const res = await categoryApi.postConvertIndex(values);
        if (res?.code !== 200) {
          throw { message: res?.message };
        }
      } else if (modalType === "edit") {
        const res = await categoryApi.postConvertIndex({
          ...values,
          id: record?.id,
        });
        if (res?.code !== 200) {
          throw { message: res?.message };
        }
      }

      message.success(
        `${
          modalType === "add" ? "Thêm mới" : "Cập nhật thông tin"
        } hệ số quy đổi hồ sơ thành công`
      );
      if (modalType === "add") {
        dispatch(setActiveKeyModal("2"));
      }
      mutate();

      onClose();
    } catch (error: any) {
      message.error(error?.message ?? "Đã có lỗi xảy ra");
    }
  };
  return (
    <Form
      size="large"
      labelWrap
      layout="horizontal"
      form={form}
      onFinish={handleSubmit}
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
  );
};

export default EditForm;
