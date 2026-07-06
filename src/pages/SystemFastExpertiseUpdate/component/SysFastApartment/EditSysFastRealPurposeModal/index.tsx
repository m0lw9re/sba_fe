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
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
const { INPUT } = TYPE_FIELD;

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  realEstatePurpose: any;
  modalType: "add" | "edit" | null;
  mutate: () => void;
};

const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };

const formSchema = Yup.object().shape({
  // rateId: Yup.number().required("Phải chọn mục đích sử dụng"),
  // ratePerMain: Yup.number().required("Phải nhập tỉ lệ"),
  // description: Yup.string().required("Phải nhập mô tả"),
});

const EditSysFastRealPurposeModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  realEstatePurpose,
  modalType,
  mutate,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useFormik({
    initialValues: {
      id: realEstatePurpose.id,
      typeName: realEstatePurpose.typeName,
      description: realEstatePurpose.description,
    },
    validationSchema: formSchema,
    onSubmit: async (data) => {
      try {
        setIsLoading(true);
        if (modalType === "edit") {
          const dataUpdate = {
            id: data.id,
            type: 4,
            typeName: data.typeName,
            description: data.description,
            assetType: ASSET_PRICES_SHARED_TYPE.APARTMENT,
          };
          const res = await systemApi.updateFastExpRealEstate(dataUpdate);
          if (res.data.code === 200) {
            message.success("Cập nhật thành công");
            mutate();
            closeModal();
          } else message.error("Cập nhật thất bại");
        } else {
          const dataCreate = {
            type: 4,
            typeName: data.typeName,
            description: data.description,
            assetType: ASSET_PRICES_SHARED_TYPE.APARTMENT,
          };
          const res = await systemApi.createFastExpRealEstate(dataCreate);
          if (res.data.code === 200) {
            message.success("Thêm thành công");
            mutate();
            closeModal();
          } else message.error("Thêm thất bại");
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
      form.setValues({
        id: realEstatePurpose.id,
        typeName: realEstatePurpose.typeName,
        description: realEstatePurpose.description,
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
      label: "Tên nhóm",
      css: css,
      labelCol: { xs: 6, sm: 6, md: 4, lg: 4, xl: 4 },
      wrapperCol: { xs: 18, sm: 18, md: 20, lg: 20, xl: 20 },
      type: INPUT,
      value: form.values.description,
      onChange: (e: any) =>
        handleChangeData({
          description: e?.target?.value,
        }),
      require: true,
      error: form.errors.description,
      touched: form.touched.description,
    },
    {
      key: 3,
      label: "Tầng",
      placeholder: "Nhập",
      type: INPUT,
      require: true,
      value: form.values.typeName,
      error: form.errors.typeName,
      touched: form.touched.typeName,
      labelCol: { xs: 6, sm: 6, md: 4, lg: 4, xl: 4 },
      wrapperCol: { xs: 18, sm: 18, md: 20, lg: 20, xl: 20 },
      css: css,
      onChange: (e: any) =>
        handleChangeData({
          typeName: e?.target?.value,
        }),
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
                ? "Thêm cấu hình nhóm tầng"
                : "Sửa cấu hình nhóm tầng"
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
          <Row gutter={[24, 4]}>
            <InputFields data={inputFields} />
            {/* <Col span={24}>
              <Form.Item
                className="form-item-custom"
                labelCol={{span: 4}}
                colon={false}
                validateStatus={
                  form.errors.description && form.touched.description
                    ? "error"
                    : ""
                }
                help={
                  form.errors.description && form.touched.description
                    ? form.errors.description
                    : ""
                }
                label={
                  <Tooltip
                    placement="bottom"
                    title={"Mô tả"}
                    className="title-sys"
                  >
                    {renderRequire("Mô tả")}
                  </Tooltip>
                }
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Nhập"
                  value={
                    form.values.description === undefined
                      ? ""
                      : String(form.values.description)
                  }
                  onChange={(e: any) => {
                    // form.setValues({ ...form.values, description: e.target.value });
                    handleChangeData({description: e.target.value});
                  }}
                  className="form-input-custom"
                />
              </Form.Item>
            </Col> */}
          </Row>
          <Row
            justify={"end"}
            className="button-row"
            style={{ padding: "4px 0" }}
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
function renderRequire(label: string) {
  return (
    <>
      <span style={{ opacity: 0.8 }}>{label}</span>
      <span style={{ color: "#F25B60" }}> *</span>
    </>
  );
}
export default EditSysFastRealPurposeModal;
