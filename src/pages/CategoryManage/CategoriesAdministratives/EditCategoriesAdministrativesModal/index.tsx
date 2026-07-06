import { CloseOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Row, Space } from "antd";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { TYPE_FIELD } from "constant/enums";
import InputFields from "components/InputFields";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CategoriesAdministrativesType } from "constant/types/categories";
import { useAddressProvince } from "utils/request";
import { addressApi } from "apis/adress";
const { SELECT } = TYPE_FIELD;

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  province: string | null;
  district: string | null;
  ward: string | null;
  road: string | null;
  modalType: "add" | "edit" | null;
};

const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };

const formSchema = Yup.object().shape({
  province: Yup.string().required("Phải chọn tỉnh"),
  district: Yup.string().nullable().required("Phải chọn huyện"),
  ward: Yup.string().nullable().required("Phải chọn xã"),
});

const EditCategoriesAdministrativesModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  province,
  district,
  ward,
  road,
  modalType,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const { data: provinces } = useAddressProvince();

  const form = useFormik({
    initialValues: {
      province: province,
      district: district,
      ward: ward,
      road: road,
    } as CategoriesAdministrativesType,
    validationSchema: formSchema,
    onSubmit: async (data: CategoriesAdministrativesType) => {
      try {
        if (modalType === "add") {
          console.log("create data: ", data);
        } else {
          console.log("update data: ", data);
        }
      } catch (error: any) {}
    },
  });
  const handleChangeData = (data: CategoriesAdministrativesType) => {
    form.setValues({ ...form.values, ...data });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (form.values.province) {
      const getDistricts = async () => {
        try {
          const res = await addressApi.getDistricts({
            code: form.values.province || "",
          });
          setDistricts(
            res.data?.map((item: any) => ({
              value: item.code,
              label: item.name,
            }))
          );
        } catch (error) {}
      };
      getDistricts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.province]);

  useEffect(() => {
    if (form.values.district) {
      const getWards = async () => {
        try {
          const res = await addressApi.getWards({
            code: form.values.district || "",
          });
          setWards(
            res.data?.map((item: any) => ({
              value: item.code,
              label: item.name,
            }))
          );
        } catch (error) {}
      };

      getWards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.district]);
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Tỉnh/Thành phố",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: form.values.province,
      onChange: (value: string) =>
        handleChangeData({
          province: value,
          district: null,
          ward: null,
        }),
      options: provinces
        ? provinces.map((item: any) => ({
            label: item.name,
            value: item.code,
          }))
        : [],
      require: true,
      error:
        form.errors.province && form.touched.province
          ? form.errors.province
          : "",
    },
    {
      key: 2,
      label: "Quận/Huyện/Thị xã",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: form.values.district,
      require: true,
      //disable: true,
      onChange: (value: string) =>
        handleChangeData({
          district: value,
          ward: null,
        }),
      options: districts,
    },
    {
      key: 3,
      label: "Xã/Phường/Thị trấn",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: form.values.ward,
      onChange: (value: string) =>
        handleChangeData({
          ward: value,
        }),
      options: wards,
      error: form.errors.ward && form.touched.ward ? form.errors.ward : "",
    },
    {
      key: 4,
      label: "Tuyến đường",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: 0,
      onChange: (value: string) => {},
      options: [],
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
          <CardTitleCustomUpdate
            title={
              modalType === "add"
                ? "Thêm địa bàn hành chính"
                : "Sửa địa bàn hành chính"
            }
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
              disabled={isLoading}
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
export default EditCategoriesAdministrativesModal;
