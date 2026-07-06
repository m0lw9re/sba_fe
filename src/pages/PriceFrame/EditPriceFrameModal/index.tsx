import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  DatePickerProps,
  Form,
  Modal,
  Row,
  Space,
  message,
} from "antd";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import InputFields from "components/InputFields";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAddressProvince } from "utils/request";
import { PriceFrameType } from "constant/types/priceFrame";
import { addressApi } from "apis/adress";
import { priceFrameApi } from "apis/framePrice";
import dayjs from "dayjs";
import { disabledEndDate, disabledStartDate } from "utils/date";

const { SELECT, INPUT_NUMBER, INPUT, DATE_PICKER } = TYPE_FIELD;

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  priceFrame: PriceFrameType;
  modalType: "add" | "edit" | null;
  mutate: () => void;
};

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
const labelCol = { xs: 8, sm: 8, md: 8, lg: 10, xl: 10 };
const wrapperCol = { xs: 16, sm: 16, md: 16, lg: 14, xl: 14 };

const formSchema = Yup.object().shape({
  provinceCode: Yup.string().required("Phải chọn tỉnh/thành phố"),
  districtsCode: Yup.string().required("Phải chọn quận/huyện/thị xã"),
  road: Yup.string().required("Phải nhập tên đường"),
  doanDuongTu: Yup.string().required("Phải nhập đoạn đường từ"),
  giaNhaNuoc: Yup.number().required("Phải nhập giá nhà nước hiện hành"),
  giaThiTruongTu: Yup.number().required("Phải nhập giá thị trường thấp nhất"),
  giaThiTruongDen: Yup.number().required("Phải nhập giá thị trường cao nhất"),
  effectiveFrom: Yup.string().required("Phải nhập hiệu lực từ"),
  effectiveTo: Yup.string().required("Phải nhập hiệu lực đến"),
});

const EditPriceFrameModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  priceFrame,
  modalType,
  mutate,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [districts, setDistricts] = useState([]);
  const { data: provinces } = useAddressProvince();
  const form = useFormik({
    initialValues: {
      provinceCode: priceFrame.districtsCode,
      districtsCode: priceFrame.districtsCode,
      road: priceFrame.road,
      doanDuongTu: priceFrame.doanDuongTu,
      doanDuongDen: priceFrame.doanDuongDen,
      giaNhaNuoc: priceFrame.giaNhaNuoc,
      giaThiTruongTu: priceFrame.giaThiTruongTu,
      giaThiTruongDen: priceFrame.giaThiTruongDen,
      effectiveFrom: priceFrame.effectiveFrom,
      effectiveTo: priceFrame.effectiveTo,
    } as PriceFrameType,
    validationSchema: formSchema,
    onSubmit: async (data: PriceFrameType) => {
      try {
        setIsLoading(true);
        if (modalType === "edit") {
          const dataUpdate: PriceFrameType = {
            roadInPriceRangeId: priceFrame.roadInPriceRangeId,
            provinceCode: data.provinceCode,
            districtsCode: data.districtsCode,
            road: data.road,
            doanDuongTu: data.doanDuongTu,
            doanDuongDen: data.doanDuongDen,
            giaNhaNuoc: data.giaNhaNuoc,
            giaThiTruongTu: data.giaThiTruongTu,
            giaThiTruongDen: data.giaThiTruongDen,
            effectiveFrom: data.effectiveFrom,
            effectiveTo: data.effectiveTo,
          };
          const res = await priceFrameApi.updatePriceFrame(dataUpdate);
          if (res.data.body.code === 200) {
            message.success(res.data.body.message);
            mutate();
            closeModal();
          } else {
            message.error(res.data.body.message);
          }
        } else {
          const resCreate = await priceFrameApi.createPriceFrame(data);
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
        setIsLoading(false);
        message.error("Lỗi cập nhật");
      }
    },
  });
  useEffect(() => {
    if (form.values.provinceCode) {
      const getDistricts = async () => {
        try {
          const res = await addressApi.getDistricts({
            code: form.values.provinceCode || "",
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
  }, [form.values.provinceCode]);

  useEffect(() => {
    form.resetForm();
    if (modalType === "edit") {
      form.setValues({
        roadInPriceRangeId: priceFrame.roadInPriceRangeId,
        provinceCode: priceFrame.provinceCode,
        districtsCode: priceFrame.districtsCode,
        road: priceFrame.road,
        doanDuongTu: priceFrame.doanDuongTu,
        doanDuongDen: priceFrame.doanDuongDen,
        giaNhaNuoc: priceFrame.giaNhaNuoc,
        giaThiTruongTu: priceFrame.giaThiTruongTu,
        giaThiTruongDen: priceFrame.giaThiTruongDen,
        effectiveFrom: priceFrame.effectiveFrom,
        effectiveTo: priceFrame.effectiveTo,
      });
    }
  }, [modalType]);
  const handleChangeData = (data: PriceFrameType) => {
    form.setValues({ ...form.values, ...data });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Tỉnh/Thành phố",
      css: css,
      labelCol,
      wrapperCol,
      type: SELECT,
      value: form.values.provinceCode,
      onChange: (value: string) =>
        handleChangeData({
          provinceCode: value,
          districtsCode: null,
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
      key: 2,
      label: "Quận/Huyện/Thị xã",
      css: css,
      labelCol,
      wrapperCol,
      type: SELECT,
      value: form.values.districtsCode,
      onChange: (value: string) =>
        handleChangeData({
          districtsCode: value,
        }),
      options: districts,
      require: true,
      error: form.errors.districtsCode,
      touched: form.touched.districtsCode,
    },
    {
      key: 3,
      label: "Tên đường",
      placeholder: "Nhập",
      type: INPUT,
      require: true,
      value: form.values.road,
      error: form.errors.road,
      touched: form.touched.road,
      labelCol,
      wrapperCol,
      css: css,
      onChange: (e: any) => handleChangeData({ road: e.target.value }),
    },
    {
      key: 4,
      label: "Từ",
      placeholder: "Nhập",
      type: INPUT,
      require: true,
      value: form.values.doanDuongTu,
      error: form.errors.doanDuongTu,
      touched: form.touched.doanDuongTu,
      labelCol,
      wrapperCol,
      css: css,
      onChange: (e: any) => handleChangeData({ doanDuongTu: e.target.value }),
    },
    {
      key: 5,
      label: "Đến",
      placeholder: "Nhập",
      type: INPUT,
      value: form.values.doanDuongDen,
      labelCol,
      wrapperCol,
      css: css,
      onChange: (e: any) => handleChangeData({ doanDuongDen: e.target.value }),
    },
    {
      key: 6,
      label: "Giá NN hiện hành (đồng)",
      css: css,
      labelCol,
      wrapperCol,
      type: INPUT_NUMBER,
      min: 0,
      value: form.values.giaNhaNuoc,
      onChange: (value: number) =>
        handleChangeData({
          giaNhaNuoc: value,
        }),
      require: true,
      error: form.errors.giaNhaNuoc,
      touched: form.touched.giaNhaNuoc,
      currencable: true,
    },
    {
      key: 7,
      label: "Giá TT thấp nhất (đồng)",
      css: css,
      labelCol,
      wrapperCol,
      type: INPUT_NUMBER,
      min: 0,
      value: form.values.giaThiTruongTu,
      onChange: (value: number) =>
        handleChangeData({
          giaThiTruongTu: value,
        }),
      require: true,
      error: form.errors.giaThiTruongTu,
      touched: form.touched.giaThiTruongTu,
      currencable: true,
    },
    {
      key: 8,
      label: "Giá TT cao nhất (đồng)",
      css: css,
      labelCol,
      wrapperCol,
      type: INPUT_NUMBER,
      min: 0,
      value: form.values.giaThiTruongDen,
      onChange: (value: number) =>
        handleChangeData({
          giaThiTruongDen: value,
        }),
      require: true,
      error: form.errors.giaThiTruongDen,
      touched: form.touched.giaThiTruongDen,
      currencable: true,
    },
    {
      key: 9,
      label: "Hiệu lực từ ngày",
      allowClear: true,
      type: DATE_PICKER,
      require: true,
      css: css,
      labelCol,
      wrapperCol,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: form.values.effectiveFrom
        ? dayjs(form.values.effectiveFrom)
        : null,
      error: form.errors.effectiveFrom,
      touched: form.touched.effectiveFrom,
      disabledDate: (value: any) => {
        if (form.values.effectiveTo) {
          return disabledStartDate(value, form.values.effectiveTo);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        handleChangeData({
          effectiveFrom: value
            ? dayjs(value).hour(0).minute(0).second(0).toISOString()
            : null,
        });
      },
    },
    {
      key: 15,
      label: "Hiệu lực đến ngày",
      allowClear: true,
      type: DATE_PICKER,
      require: true,
      css: css,
      labelCol,
      wrapperCol,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: form.values.effectiveTo ? dayjs(form.values.effectiveTo) : null,
      error: form.errors.effectiveTo,
      touched: form.touched.effectiveTo,
      disabledDate: (value: any) => {
        if (form.values.effectiveFrom) {
          return disabledEndDate(value, form.values.effectiveFrom);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        handleChangeData({
          effectiveTo: value
            ? dayjs(value).hour(23).minute(59).second(59).toISOString()
            : null,
        });
      },
    },
  ];

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalEditPriceFrame"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-priceFrame">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalEditPriceFrame-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate
            title={modalType === "add" ? "Thêm khung giá" : "Sửa khung giá"}
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
          <Row gutter={[24, 8]}>
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
export default EditPriceFrameModal;
