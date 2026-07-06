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
import { systemApi } from "apis/system";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
import { CreateUtilityType, UpdateUtilityType } from "constant/types/system";
const { INPUT, INPUT_NUMBER, MULTI_SELECT_SEARCH } = TYPE_FIELD;

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  utilityCombo: any;
  modalType: "add" | "edit" | null;
  mutate: () => void;
};

const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
const labelCol = { xs: 8, sm: 8, md: 6, lg: 6, xl: 6 };
const wrapperCol = { xs: 16, sm: 16, md: 18, lg: 18, xl: 18 };

const formSchema = Yup.object().shape({
  name: Yup.string().required("Phải nhập nhóm tiện ích"),
  // utilityIds: Yup.array()
  //   .min(1, "Phải chọn ít nhất 1 tiện ích")
  //   .required("Phải chọn tiện ích"),
  rate: Yup.number().required("Phải nhập tham số tiện ích"),
});

const EditSysUtilitiesTableModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  utilityCombo,
  modalType,
  mutate,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { utilitiesOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );
  const form = useFormik({
    initialValues: {
      id: utilityCombo.id || null,
      name: utilityCombo.name,
      utilityIds: utilityCombo.utilityIds || [],
      rate: utilityCombo.rate,
    },
    validationSchema: formSchema,
    onSubmit: async (data) => {
      try {
        setIsLoading(true);
        if (modalType === "edit") {
          const dataUpdate: UpdateUtilityType = {
            id: utilityCombo.id,
            name: data.name,
            utilityIds: data.utilityIds || [],
            rate: data.rate,
          };
          const res = await systemApi.updateUtilityCombo(dataUpdate);
          if (res.data.code === 200) {
            message.success("Cập nhật thành công");
            mutate();
            closeModal();
          } else message.error("Cập nhật thất bại");
        } else {
          const dataCreate: CreateUtilityType = {
            name: data.name,
            utilityIds: data.utilityIds,
            rate: data.rate,
          };
          const res = await systemApi.createUtilityCombo(dataCreate);
          if (res.data.code === 200) {
            message.success("Thêm combo tiện ích thành công");
            mutate();
            closeModal();
          } else message.error("Thêm combo tiện ích thất bại");
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        message.error("Có lỗi xảy ra");
      }
    },
  });

  useEffect(() => {
    form.resetForm();
    if (modalType === "edit") {
      console.log(utilityCombo);
      form.setValues({
        id: utilityCombo.id,
        name: utilityCombo.name,
        utilityIds: utilityCombo.utilityIds || [],
        rate: utilityCombo.rate,
      });
    }
  }, [modalType]);

  const handleChangeData = (data: any) => {
    form.setValues({ ...form.values, ...data });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Nhóm tiện ích",
      css: css,
      labelCol,
      wrapperCol,
      type: INPUT,
      value: form.values.name,
      onChange: (e: any) =>
        handleChangeData({
          name: e?.target?.value,
        }),
      require: true,
      error: form.errors.name,
      touched: form.touched.name,
    },
    {
      key: 2,
      label: "Tiện ích",
      placeholder: "Nhập",
      type: MULTI_SELECT_SEARCH,
      // require: true,
      value: form.values.utilityIds,
      error: form.errors.utilityIds,
      touched: form.touched.utilityIds,
      labelCol,
      wrapperCol,
      css: css,
      options: utilitiesOptions.map((el) => ({
        ...el,
        value: el.value.toString(),
      })),
      onChange: (value: any) =>
        handleChangeData({
          utilityIds: value,
        }),
    },
    {
      key: 3,
      label: "Tham số tiện ích",
      css: css,
      labelCol,
      wrapperCol,
      type: INPUT_NUMBER,
      value: form.values.rate,
      onChange: (value: any) =>
        handleChangeData({
          rate: value,
        }),
      require: true,
      error: form.errors.rate,
      touched: form.touched.rate,
    },
  ];

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalEditSysFastExpertise"
      style={{ display: "flex", justifyContent: "center" }}
      width={650}
    >
      <Space
        direction="vertical"
        size={"small"}
        className="space-sysFastRealPosition"
      >
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalSysFastRealPosition-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate
            title={
              modalType === "add"
                ? "Thêm cấu hình tiện ích"
                : "Sửa cấu hình tiện ích"
            }
            color="#FFF"
          />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={closeModal}
            size="small"
          />
        </Row>
        <Form labelAlign="left" labelWrap size="small">
          <Row gutter={[20, 8]}>
            <InputFields data={inputFields} />
          </Row>
          <Row
            justify={"end"}
            className="button-row"
            style={{ padding: "8px 0" }}
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
        </Form>
      </Space>
    </Modal>
  );
};
export default EditSysUtilitiesTableModal;
