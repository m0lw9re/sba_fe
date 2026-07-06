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
import { CategoriesBussinessFeeType } from "constant/types/categories";
import { useAddressProvince } from "utils/request";
import { categoryApi } from "apis/category";
import { CompanyBranchType } from "constant/types";
const { SELECT, INPUT_NUMBER } = TYPE_FIELD;

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  provinceCode: string | null;
  branchCode: string | null;
  bussinessFee: number | null;
  bussinessFeeId: number | null;
  modalType: "add" | "edit" | null;
  mutate: () => void;
};

const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };

const formSchema = Yup.object().shape({
  provinceCode: Yup.string().nullable().required("Phải chọn điểm đến"),
  branchCode: Yup.string().nullable().required("Phải chọn điểm đi"),
  businessFee: Yup.number().required("Phải nhập phí công tác"),
});

const EditCategoriesBussinessFeeModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  provinceCode,
  branchCode,
  bussinessFee,
  bussinessFeeId,
  modalType,
  mutate,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: provinces } = useAddressProvince();
  const [branchs, setBranchs] = useState<CompanyBranchType[]>([]);

  const getBranchs = async () => {
    try {
      const res = await categoryApi.getCompanyBranchs();
      setBranchs(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBranchs();
  }, []);
  const form = useFormik({
    initialValues: {
      provinceCode: provinceCode,
      branchCode: branchCode,
      bussinessFee: bussinessFee,
    } as CategoriesBussinessFeeType,
    validationSchema: formSchema,
    onSubmit: async (data: CategoriesBussinessFeeType) => {
      try {
        setIsLoading(true);
        if (modalType === "edit") {
          const dataUpdate: CategoriesBussinessFeeType = {
            feeBusinessId: data.feeBusinessId,
            provinceCode: data.provinceCode,
            businessFee: data.businessFee,
            branchCode: data.branchCode,
          };

          const res = await categoryApi.updateBussinessFee(dataUpdate);
          if (res.data.body.code === 200) {
            message.success(res.data.body.message);
            mutate();
            closeModal();
          } else {
            message.error(res.data.body.message);
          }
        } else {
          const resCreate = await categoryApi.createBussinessFee(data);
          if (resCreate.data.body.code === 200) {
            message.success(resCreate.data.body.message);
            mutate();
            closeModal();
          } else {
            message.error(resCreate.data.body.message);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    form.resetForm();
    if (modalType === "edit") {
      form.setValues({
        feeBusinessId: bussinessFeeId,
        branchCode: branchCode,
        provinceCode: provinceCode,
        businessFee: bussinessFee,
      });
    }
  }, [modalType]);
  const handleChangeData = (data: CategoriesBussinessFeeType) => {
    form.setValues({ ...form.values, ...data });
  };

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Điểm đi",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: form.values.branchCode,
      onChange: (value: string) =>
        handleChangeData({
          branchCode: value,
        }),
      options: branchs
        ? branchs.map((item: any) => ({
            label: item.companyBranchName,
            value: item.code,
          }))
        : [],
      require: true,
      error: form.errors.branchCode,
      touched: form.touched.branchCode,
    },
    {
      key: 2,
      label: "Điểm đến",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: form.values.provinceCode,
      onChange: (value: string) =>
        handleChangeData({
          provinceCode: value,
        }),
      options: provinces
        ? provinces.map((item: any) => ({
            label: item.fullName,
            value: item.code,
          }))
        : [],
      require: true,
      error: form.errors.provinceCode,
      touched: form.touched.provinceCode,
    },
    {
      key: 3,
      label: "Phí công tác (đồng)",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT_NUMBER,
      value: form.values.businessFee,
      onChange: (value: number) =>
        handleChangeData({
          businessFee: value,
        }),
      require: true,
      error: form.errors.businessFee,
      touched: form.touched.businessFee,
      currencable: true,
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
              modalType === "add" ? "Thêm phí công tác" : "Sửa phí công tác"
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
export default EditCategoriesBussinessFeeModal;
