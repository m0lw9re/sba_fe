import React, { useEffect } from "react";
import { Modal, Row, Button, Space, Form, message } from "antd";
import "./style.scss";
import { TYPE_FIELD } from "constants/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { CloseOutlined } from "@ant-design/icons";
// import {CreateRealEstateLegalType} from "constant/types";
import { categoryApi } from "apis/category";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  record: any;
  action: "add" | "update" | null;
  mutate: any;
};

// const initialFormData: CreateRealEstateLegalType = {
//   legalRealEstateName: "",
//   legalRealEstateRequest: "",
// };

const { INPUT, SELECT } = TYPE_FIELD;

const CreateRealEstateModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  record,
  action,
  mutate,
}) => {
  const [form] = Form.useForm();
  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      name: "name",
      label: "Loại hồ sơ",
      type: INPUT,
      require: true,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
    },
    {
      key: 2,
      name: "isRequired",
      label: "Yêu cầu",
      placeholder: "Chọn",
      type: SELECT,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      require: true,
      options: [
        { label: "Không bắt buộc", value: 0 },
        { label: "Bắt buộc", value: 1 },
      ],
    },
  ];
  useEffect(() => {
    form.setFieldsValue(record);
    if (!record || action === "add") {
      form.resetFields();
    }
  }, [record, action]);
  const onSubmit = async (values: any) => {
    const data = {
      ...values,
      customerTypeId: 0,
      assetLevelTwoId: 3,
      isDeleted: 0,
    };
    try {
      if (action === "add") {
        const res = await categoryApi.createLegalDoc(data);
        if (res?.data?.code !== 200) {
          throw { message: "Phải nhập tên hồ sơ pháp lý và chọn loại yêu cầu" };
        }
      } else if (action === "update") {
        if (!data.name || data.isRequired === null) {
          throw { message: "Phải nhập tên hồ sơ và chọn yêu cầu" };
        } else {
          const res = await categoryApi.updateLegalDoc({
            ...data,
            legalDocumentTypeId: record?.legalDocumentTypeId,
          });
          if (res?.data?.code !== 200) {
            throw { message: res?.data?.message };
          }
        }
      }
      message.success(
        `Đã ${action === "add" ? "tạo" : "cập nhật thông tin"} hồ sơ pháp lý`
      );
      mutate();
      closeModal();
    } catch (error: any) {
      message.error(error?.message ?? "Đã có lỗi xảy ra");
    }
  };
  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalCreateRealEstateModal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalCreateRealEstateModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate
            title={
              action === "add" ? "Thêm hồ sơ pháp lý" : "Sửa hồ sơ pháp lý"
            }
          />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={closeModal}
            size="small"
          />
        </Row>
        <Form
          form={form}
          onFinish={onSubmit}
          labelAlign="left"
          labelWrap
          size="small"
        >
          <Row gutter={[24, 4]}>
            <InputFields data={inputFields} />
          </Row>
          <Row
            justify={"end"}
            style={{ padding: "8px 0" }}
            className="button-row"
          >
            <Space>
              <ButtonCustom label="Hủy bỏ" onClick={closeModal} />
              <ButtonCustom
                label="Lưu lại"
                type="primary"
                htmlType="submit"
                bgColor="rgba(40, 98, 175, 1)"
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default CreateRealEstateModal;
