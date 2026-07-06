import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Tooltip,
  message,
} from "antd";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { TYPE_FIELD } from "constant/enums";
import InputFields from "components/InputFields";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SystemFastExpertiseRealEstate } from "constant/types/system";
import { categoryApi } from "apis/category";
import { systemApi } from "apis/system";
import renderRequired from "components/RenderRequire";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
const { SELECT, INPUT_NUMBER } = TYPE_FIELD;

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  realEstatePosition: SystemFastExpertiseRealEstate;
  modalType: "add" | "edit" | null;
  mutate: () => void;
};

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };

const formSchema = Yup.object().shape({
  rateId: Yup.number().required("Phải chọn vị trí"),
  ratePerMain: Yup.number().required("Phải nhập tỉ lệ"),
  description: Yup.string().required("Phải nhập mô tả"),
});

const EditSysFastRealPositionModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  realEstatePosition,
  modalType,
  mutate,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listPosition, setListPosition] = useState<any>([]);
  const form = useFormik({
    initialValues: {
      id: realEstatePosition.id,
      type: realEstatePosition.type,
      typeName: realEstatePosition.typeName,
      rateId: realEstatePosition.rateId,
      rateName: realEstatePosition.rateName,
      ratePerMain: realEstatePosition.ratePerMain,
      description: realEstatePosition.description,
    },
    validationSchema: formSchema,
    onSubmit: async (data: SystemFastExpertiseRealEstate) => {
      try {
        setIsLoading(true);
        if (modalType === "edit") {
          const dataUpdate: SystemFastExpertiseRealEstate = {
            id: data.id,
            type: data.type,
            rateId: data.rateId,
            ratePerMain: data.ratePerMain,
            description: data.description,
            assetType: ASSET_PRICES_SHARED_TYPE.PLAN_USING,
          };
          const res = await systemApi.updateFastExpRealEstate(dataUpdate);
          if (res.data.code === 200) {
            message.success("Cập nhật thành công");
            mutate();
            closeModal();
          } else message.error("Cập nhật thất bại");
        } else {
          const dataCreate: SystemFastExpertiseRealEstate = {
            type: 0,
            rateId: data.rateId,
            ratePerMain: data.ratePerMain,
            description: data.description,
            assetType: ASSET_PRICES_SHARED_TYPE.PLAN_USING,
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
  const getListPositions = async () => {
    try {
      const res = await categoryApi.getPositions();
      setListPosition(
        res.data.map((item: any) => ({
          value: item.positionId,
          label: item.positionName,
        }))
      );
    } catch (error) {}
  };

  useEffect(() => {
    getListPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.rateId]);

  useEffect(() => {
    form.resetForm();
    if (modalType === "edit") {
      form.setValues({
        id: realEstatePosition.id,
        type: realEstatePosition.type,
        typeName: realEstatePosition.typeName,
        rateId: realEstatePosition.rateId,
        rateName: realEstatePosition.rateName,
        ratePerMain: realEstatePosition.ratePerMain,
        description: realEstatePosition.description,
      });
    }
  }, [modalType]);
  const handleChangeData = (data: SystemFastExpertiseRealEstate) => {
    form.setValues({ ...form.values, ...data });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Vị trí",
      css: css,
      labelCol: { xs: 6, sm: 6, md: 6, lg: 8, xl: 8 },
      wrapperCol: { xs: 18, sm: 18, md: 18, lg: 16, xl: 16 },
      type: SELECT,
      value: form.values.rateId,
      onChange: (value: number) =>
        handleChangeData({
          rateId: value,
        }),
      options: listPosition ? listPosition : [],
      require: true,
      error: form.errors.rateId,
      touched: form.touched.rateId,
    },
    {
      key: 2,
      label: "Tỉ lệ so với Mặt tiền",
      placeholder: "Nhập",
      type: INPUT_NUMBER,
      require: true,
      value: form.values.ratePerMain,
      error: form.errors.ratePerMain,
      touched: form.touched.ratePerMain,
      labelCol: { xs: 6, sm: 6, md: 6, lg: 8, xl: 8 },
      wrapperCol: { xs: 18, sm: 18, md: 18, lg: 16, xl: 16 },
      css: css,
      onChange: (e: number) => handleChangeData({ ratePerMain: e }),
    },
  ];

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalEditSysFastRealPosition"
      style={{ display: "flex", justifyContent: "center" }}
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
                ? "Thêm cấu hình vị trí"
                : "Sửa cấu hình vị trí"
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
            <Col span={24}>
              <Form.Item
                className="form-item-custom"
                labelCol={{ span: 4 }}
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
                    {renderRequired("Mô tả")}
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
                    handleChangeData({ description: e.target.value });
                  }}
                  className="form-input-custom"
                />
              </Form.Item>
            </Col>
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
export default EditSysFastRealPositionModal;
