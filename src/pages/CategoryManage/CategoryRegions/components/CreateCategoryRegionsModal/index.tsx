import React, { useEffect, useState } from "react";
import { Modal, Row, Button, Space, Form, message } from "antd";
import "pages/CategoryManage/CategoryRegions/components/CreateCategoryRegionsModal/style.scss";
import { TYPE_FIELD } from "constant/enums";
import { regionsApi } from "apis/regions";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { CloseOutlined } from "@ant-design/icons";
import * as Yup from "yup";
import { CreateCategoryRegionsType } from "constant/types";
import { useAddressProvince } from "utils/request";
import { addressApi } from "apis/adress";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
};

const formSchema = Yup.object().shape({
  addressProvince: Yup.string().required("Phải chọn tỉnh"),
  addressDistrict: Yup.string().nullable().required("Phải chọn huyện"),
  addressWard: Yup.string().nullable().required("Phải chọn xã"),
  code: Yup.string().nullable().required("Phải chọn mã chi nhánh"),
  companyBranchName: Yup.string().required("Phải nhập tên chi nhánh"),
  addressStreet: Yup.string().required("Phải nhập địa chỉ"),
  addressDetail: Yup.string().required("Phải nhập chi tiết địa chỉ"),
});

const initialFormData: CreateCategoryRegionsType = {
  code: "",
  companyBranchName: "",
  addressProvince: "",
  addressDistrict: "",
  addressWard: "",
  addressStreet: "",
  addressDetail: "",
};

const { INPUT, SELECT } = TYPE_FIELD;

const CreateCategoryRegionsModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
}) => {
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const { data: provinces } = useAddressProvince();

  const formCreate = useFormik({
    initialValues: initialFormData,
    validationSchema: formSchema,
    validateOnChange: false,
    onSubmit: async (data: CreateCategoryRegionsType) => {
      try {
        const response = await regionsApi.create(data);
        if (response.data.code === 200) {
          message.success(response.data.message);
          formCreate.resetForm();
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Tạo chi nhánh không thành công");
      }
    },
  });

  const handleChangeData = (data: CreateCategoryRegionsType) => {
    formCreate.setValues({
      ...formCreate.values,
      ...data,
    });
  };

  useEffect(() => {
    if (formCreate.values.addressProvince) {
      const getDistricts = async () => {
        try {
          const res = await addressApi.getDistricts({
            code: formCreate.values.addressProvince || "",
          });
          setDistricts(
            res.data?.map((item: any) => ({
              value: item.code,
              label: item.fullName,
            }))
          );
        } catch (error) {}
      };
      getDistricts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formCreate.values.addressProvince]);

  useEffect(() => {
    if (formCreate.values.addressDistrict) {
      const getWards = async () => {
        try {
          const res = await addressApi.getWards({
            code: formCreate.values.addressDistrict || "",
          });
          setWards(
            res.data?.map((item: any) => ({
              value: item.code,
              label: item.fullName,
            }))
          );
        } catch (error) {}
      };

      getWards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formCreate.values.addressDistrict]);

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Mã chi nhánh",
      placeholder: "Nhập mã chi nhánh",
      type: INPUT,
      value: formCreate.values.code,
      error: formCreate.errors.code,
      touched: formCreate.touched.code,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      require: true,
      onChange: (e: any) => handleChangeData({ code: e.target.value }),
    },
    {
      key: 2,
      label: "Tên chi nhánh",
      placeholder: "Nhập tên chi nhánh",
      type: INPUT,
      require: true,
      value: formCreate.values.companyBranchName,
      error: formCreate.errors.companyBranchName,
      touched: formCreate.touched.companyBranchName,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) =>
        handleChangeData({
          companyBranchName: e.target.value,
        }),
    },
    {
      key: 3,
      label: "Tỉnh/Thành phố",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      placeholder: "Chọn tỉnh/thành phố",
      value: formCreate.values.addressProvince,
      error: formCreate.errors.addressProvince,
      touched: formCreate.touched.addressProvince,
      onChange: (value: string) =>
        handleChangeData({
          addressProvince: value,
          addressDistrict: null,
          addressWard: null,
        }),
      options: provinces
        ? provinces.map((item: any) => ({
            label: item.fullName,
            value: item.code,
          }))
        : [],
      require: true,
    },
    {
      key: 4,
      label: "Quận/Huyện/Thị xã",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: formCreate.values.addressDistrict,
      error: formCreate.errors.addressDistrict,
      touched: formCreate.touched.addressDistrict,
      require: true,
      placeholder: "Chọn quận/huyện",
      //disable: true,
      onChange: (value: string) =>
        handleChangeData({
          addressDistrict: value,
          addressWard: null,
        }),
      options: districts,
    },
    {
      key: 5,
      label: "Xã/Phường/Thị trấn",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      placeholder: "Chọn xã/phường/thi trấn",
      value: formCreate.values.addressWard,
      error: formCreate.errors.addressWard,
      touched: formCreate.touched.addressWard,
      onChange: (value: string) =>
        handleChangeData({
          addressWard: value,
        }),
      options: wards,
    },
    {
      key: 6,
      label: "Đường phố",
      placeholder: "Nhập tên đường phố",
      type: INPUT,
      require: true,
      value: formCreate.values.addressStreet,
      error: formCreate.errors.addressStreet,
      touched: formCreate.touched.addressStreet,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) => handleChangeData({ addressStreet: e.target.value }),
    },
    {
      key: 7,
      label: "Địa chỉ",
      placeholder: "Nhập tên địa chỉ",
      type: INPUT,
      require: true,
      value: formCreate.values.addressDetail,
      error: formCreate.errors.addressDetail,
      touched: formCreate.touched.addressDetail,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) => handleChangeData({ addressDetail: e.target.value }),
    },
  ];
  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalCreateCategoryRegionsModal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalCreateCategoryRegionsModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Thêm chi nhánh mới" />
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
          <Row
            justify={"end"}
            style={{ padding: "8px 0" }}
            className="button-row"
          >
            <Space>
              <ButtonCustom
                label="Hủy bỏ"
                onClick={() => {
                  formCreate.resetForm();
                  closeModal();
                }}
              />
              <ButtonCustom
                label="Lưu lại"
                type="primary"
                htmlType="submit"
                bgColor="rgba(40, 98, 175, 1)"
                onClick={formCreate.submitForm}
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default CreateCategoryRegionsModal;
