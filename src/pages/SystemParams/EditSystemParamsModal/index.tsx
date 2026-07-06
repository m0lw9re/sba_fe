import { CloseOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Row, Space, message } from "antd";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { TYPE_FIELD } from "constant/enums";
import InputFields from "components/InputFields";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SystemParamsType } from "constant/types/system";
import { systemApi } from "apis/system";
const { INPUT } = TYPE_FIELD;

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  data: SystemParamsType;
  mutate: () => void;
};

const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
const formSchema = Yup.object().shape({
  value: Yup.string().required("Phải nhập giá trị"),
});

const EditSystemParamsModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  data,
  mutate
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useFormik({
    initialValues: {
      id: data.id,
      systemParametersGroupId: data.systemParametersGroupId,
      systemParametersName: data.systemParametersName,
      value: data.value
    } as SystemParamsType,
    validationSchema: formSchema,
    onSubmit: async (data: SystemParamsType) => {
      try {
        setIsLoading(true);
        const res = await systemApi.update(data);
        if (res.data.code === 200) {
          message.success(res.data.message);
          mutate();
          closeModal();
        } else message.error(res.data.message);
      } catch (error: any) {
        message.error("Lỗi cập nhật")
      }
      setIsLoading(false);
    },
  });
  useEffect(() => {
    if (data) {
      form.setValues(data);
    }
  }, [data]);
  const handleChangeData = (data: SystemParamsType) => {
    form.setValues({ ...form.values, ...data });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Tham số",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT,
      value: form.values.systemParametersName,
      disable: true,
      error:
        form.errors.systemParametersName && form.touched.systemParametersName
          ? form.errors.systemParametersName
          : "",
    },
    {
      key: 2,
      label: "Giá trị",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT,
      value: form.values.value,
      onChange: (value: string) =>
        handleChangeData({
          value: value,
        }),
      error: form.errors.value && form.touched.value ? form.errors.value : "",
    },
  ];
  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalEditAssignment"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalEditAssignment-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title={"Sửa tham số"} />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={closeModal}
            size="small"
          />
        </Row>
        <Form labelAlign="left" labelWrap size="small">
          <Row gutter={[24, 4]}>
            <InputFields data={inputFields} />
          </Row>
        </Form>
        <Row
          justify={"end"}
          style={{ padding: "0 8px 8px 0" }}
          className="button-row"
        >
          <Space>
            <ButtonCustom label="Hủy bỏ" onClick={closeModal} />
            <ButtonCustom
              loading={isLoading}
              label="Lưu lại"
              type="primary"
              onClick={form.submitForm}
              bgColor="rgba(40, 98, 175, 1)"
            />
          </Space>
        </Row>
      </Space>
    </Modal>
  );
};
export default EditSystemParamsModal;
