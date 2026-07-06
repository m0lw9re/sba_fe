import React, { useEffect, useState } from "react";
import { Modal, Row, Button, Space, Form, message } from "antd";
import "pages/CategoryManage/CategoryRegions/components/EditCategoryRegionsModal/style.scss";
import { regionsApi } from "apis/regions";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { CloseOutlined } from "@ant-design/icons";
import { useAddressProvince } from "utils/request";
import { addressApi } from "apis/adress";
import * as Yup from "yup";
import { EditCategoryRegionsType } from "constant/types/categoryregions";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  regionSelected: EditCategoryRegionsType;
};

const { INPUT, SELECT } = TYPE_FIELD;

const EditCategoryRegionsModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  regionSelected,
}) => {
  const handleEditCategoryRegions = (basicData: EditCategoryRegionsType) => {
    formEditCategoryRegions.setValues((state) => ({
      ...state,
      ...basicData,
    }));
  };

  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const { data: provinces } = useAddressProvince();

  const formSchema = Yup.object().shape({
    addressProvince: Yup.string().required("Phải chọn tỉnh"),
    addressDistrict: Yup.string().nullable().required("Phải chọn huyện"),
    addressWard: Yup.string().nullable().required("Phải chọn xã"),
    code: Yup.string().nullable().required("Phải chọn mã chi nhánh"),
    companyBranchName: Yup.string().required("Phải nhập tên chi nhánh"),
    addressStreet: Yup.string().required("Phải nhập địa chỉ"),
    addressDetail: Yup.string().required("Phải nhập chi tiết địa chỉ"),
  });

  const formEditCategoryRegions = useFormik({
    initialValues: regionSelected
      ? regionSelected
      : {
          code: "",
          companyBranchName: "",
          addressProvince: "",
          addressProvinceName: "",
          addressDistrict: "",
          addressDistrictName: "",
          addressWard: "",
          addressWardName: "",
          addressStreet: "",
          addressDetail: "",
          companyBranchId: 0,
        },
    validationSchema: formSchema,
    onSubmit: async (data: EditCategoryRegionsType) => {
      try {
        const response = await regionsApi.edit(data);
        if (response.data.code === 200) {
          message.success(response.data.message);
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Sửa chi nhánh không thành công");
      }
    },
  });

  useEffect(() => {
    if (formEditCategoryRegions.values.addressProvince) {
      const getDistricts = async () => {
        try {
          const res = await addressApi.getDistricts({
            code: formEditCategoryRegions.values.addressProvince || "",
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
  }, [formEditCategoryRegions.values.addressProvince]);

  useEffect(() => {
    if (formEditCategoryRegions.values.addressDistrict) {
      const getWards = async () => {
        try {
          const res = await addressApi.getWards({
            code: formEditCategoryRegions.values.addressDistrict || "",
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
  }, [formEditCategoryRegions.values.addressDistrict]);

  useEffect(() => {
    if (regionSelected?.companyBranchId) {
      formEditCategoryRegions.setValues(regionSelected);
    }
  }, [regionSelected]);

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "ID chi nhánh",
      type: INPUT,
      value: formEditCategoryRegions.values.companyBranchId,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      require: true,
      disable: true,
      onChange: (e: any) =>
        handleEditCategoryRegions({ companyBranchId: e.target.value }),
    },
    {
      key: 2,
      label: "Mã chi nhánh",
      type: INPUT,
      value: formEditCategoryRegions.values.code,
      error: formEditCategoryRegions.errors.code,
      touched: formEditCategoryRegions.touched.code,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      require: true,
      onChange: (e: any) => handleEditCategoryRegions({ code: e.target.value }),
    },
    {
      key: 3,
      label: "Tên chi nhánh",
      type: INPUT,
      require: true,
      css: css,
      value: formEditCategoryRegions.values.companyBranchName,
      error: formEditCategoryRegions.errors.companyBranchName,
      touched: formEditCategoryRegions.touched.companyBranchName,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      onChange: (e: any) =>
        handleEditCategoryRegions({ companyBranchName: e.target.value }),
    },
    {
      key: 4,
      label: "Tỉnh/Thành phố",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: formEditCategoryRegions.values.addressProvince,
      error: formEditCategoryRegions.errors.addressProvince,
      touched: formEditCategoryRegions.touched.addressProvince,
      onChange: (value: string) => {
        handleEditCategoryRegions({
          addressProvince: value,
          addressDistrict: null,
          addressWard: null,
        });
        setWards([]);
      },
      options: provinces
        ? provinces.map((item: any) => ({
            label: item.fullName,
            value: item.code,
          }))
        : [],
      require: true,
    },
    {
      key: 5,
      label: "Quận/Huyện/Thị xã",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: formEditCategoryRegions.values.addressDistrict,
      error: formEditCategoryRegions.errors.addressDistrict,
      touched: formEditCategoryRegions.touched.addressDistrict,
      require: true,
      //disable: true,
      onChange: (value: string) =>
        handleEditCategoryRegions({
          addressDistrict: value,
          addressWard: null,
        }),
      options: districts,
    },
    {
      key: 6,
      label: "Xã/Phường/Thị trấn",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: formEditCategoryRegions.values.addressWard,
      error: formEditCategoryRegions.errors.addressWard,
      touched: formEditCategoryRegions.touched.addressWard,
      onChange: (value: string) =>
        handleEditCategoryRegions({
          addressWard: value,
        }),
      options: wards,
    },
    {
      key: 7,
      label: "Đường phố",
      placeholder: "Nhập tên đường phố",
      type: INPUT,
      require: true,
      value: formEditCategoryRegions.values.addressStreet,
      error: formEditCategoryRegions.errors.addressStreet,
      touched: formEditCategoryRegions.touched.addressStreet,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) =>
        handleEditCategoryRegions({ addressStreet: e.target.value }),
    },
    {
      key: 8,
      label: "Địa chỉ",
      placeholder: "Nhập tên địa chỉ",
      type: INPUT,
      require: true,
      value: formEditCategoryRegions.values.addressDetail,
      error: formEditCategoryRegions.errors.addressDetail,
      touched: formEditCategoryRegions.touched.addressDetail,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      onChange: (e: any) =>
        handleEditCategoryRegions({ addressDetail: e.target.value }),
    },
  ];
  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalEditCategoryRegionsModal"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalEditCategoryRegionsModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Sửa chi nhánh" />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={closeModal}
            size="small"
          />
        </Row>
        <Form
          labelAlign="left"
          labelWrap
          size="small"
          onFinish={formEditCategoryRegions.handleSubmit}
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
                onClick={formEditCategoryRegions.submitForm}
                bgColor="rgba(40, 98, 175, 1)"
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default EditCategoryRegionsModal;
