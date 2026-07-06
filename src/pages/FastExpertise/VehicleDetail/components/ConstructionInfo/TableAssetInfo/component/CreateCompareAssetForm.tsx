import { Form, Row, Space, Typography } from "antd";
import ButtonCustom from "components/ButtonCustom";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import { FC } from "react";
import * as Yup from "yup";

const { INPUT } = TYPE_FIELD;

type Props = {
  handleAddTSSS: (assetId: string) => void;
  closeModal: () => void;
};

type DataType = {
  assetCode: string;
  dataSourceId: number | null;
  infoSourceId: number | null;
  contact: string;
  transactionStatus: string;
  transactionTime: string;
  appraisalTime: string;
  addressProvince: string;
  addressDistrict: string;
  addressWard: string;
  addressStreet: string;
  addressDetail: string;
  positionId: number | null;
  mapSheetNumber: string;
  landPlotNumber: string;
  latitude: number | null;
  longitude: number | null;
  assetImage: string | null;
  areaWidth: number | null;
  areaInplan: number | null;
  areaUnplan: number | null;
  facadeLength: number | null;
  numberOfFacade: number | null;
  shape: string;
  widthToMainRoad: number | null;
  distanceToMainRoad: number | null;
  businessAdvantage: string;
  legal: string;
  traffic: string;
  security: string;
  infrastructure: string;
  usingPurposeId: number | null;
  note: string;
  transactionPrice: number | null;
  estimatePrice: number | null;
  totalFloorArea: number | null;
  constructionUnitPrice: number | null;
  remainQuality: number | null;
  constructionPrice: number | null;
  landUnitPrice: number | null;
  totalValue: number | null;
  rentDayPrice: number | null;
  rentYearPrice: number | null;
  estimateRentYearPrice: number | null;
  rentYearUnitPrice: number | null;
};

const formSchema = Yup.object().shape({});

const css = { xs: 24, md: 12, xl: 8 };
const cssLabel = { xs: 24 };
const cssInput = { xs: 24 };

const CreateCompareAssetForm: FC<Props> = ({ handleAddTSSS, closeModal }) => {
  const form = useFormik({
    initialValues: {} as any,
    validationSchema: formSchema,
    onSubmit: (data: DataType) => {
      try {
        // call api create TSSS
        // get new id
        // handleAddTSSS(new id)
      } catch (error: any) {}
    },
  });

  const inputsInfo: InputFiledParams[] = [
    {
      key: 1,
      label: "Mã tài sản kho giá",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.assetCode,
      onChange: (e: any) =>
        form.setValues({ ...form.values, assetCode: e.target.value }),
    },
    {
      key: 2,
      label: "Nguồn dữ liệu",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.dataSourceId,
      onChange: (e: any) =>
        form.setValues({ ...form.values, dataSourceId: e.target.value }),
    },
    {
      key: 3,
      label: "Nguồn thông tin",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.infoSourceId,
      onChange: (e: any) =>
        form.setValues({ ...form.values, infoSourceId: e.target.value }),
    },
    {
      key: 4,
      label: "Người liên hệ - SĐT",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.contact,
      onChange: (e: any) =>
        form.setValues({ ...form.values, contact: e.target.value }),
    },
    {
      key: 5,
      label: "Tình trạng giao dịch",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.transactionStatus,
      onChange: (e: any) =>
        form.setValues({ ...form.values, transactionStatus: e.target.value }),
    },
    {
      key: 6,
      label: "Thời điểm",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.transactionTime,
      onChange: (e: any) =>
        form.setValues({ ...form.values, transactionTime: e.target.value }),
    },
    {
      key: 7,
      label: "Kinh độ",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.appraisalTime,
      onChange: (e: any) =>
        form.setValues({ ...form.values, appraisalTime: e.target.value }),
    },
  ];
  const inputsAddress: InputFiledParams[] = [
    {
      key: 8,
      label: "Tỉnh/TP",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.addressProvince,
      onChange: (e: any) =>
        form.setValues({ ...form.values, addressProvince: e.target.value }),
    },

    {
      key: 9,
      label: "Quận/Huyện/TP/Thị xã",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.addressDistrict,
      onChange: (e: any) =>
        form.setValues({ ...form.values, addressDistrict: e.target.value }),
    },
    {
      key: 10,
      label: "Xã/Phường/Thị trấn",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.addressWard,
      onChange: (e: any) =>
        form.setValues({ ...form.values, addressWard: e.target.value }),
    },
    {
      key: 11,
      label: "Đường phố",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.addressStreet,
      onChange: (e: any) =>
        form.setValues({ ...form.values, addressStreet: e.target.value }),
    },
    {
      key: 12,
      label: "Địa chỉ",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.addressDetail,
      onChange: (e: any) =>
        form.setValues({ ...form.values, addressDetail: e.target.value }),
    },
    {
      key: 13,
      label: "Vị trí",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.positionId,
      onChange: (e: any) =>
        form.setValues({ ...form.values, positionId: e.target.value }),
    },
    {
      key: 14,
      label: "Số tờ",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.mapSheetNumber,
      onChange: (e: any) =>
        form.setValues({ ...form.values, mapSheetNumber: e.target.value }),
    },
    {
      key: 15,
      label: "Số thửa",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.landPlotNumber,
      onChange: (e: any) =>
        form.setValues({ ...form.values, landPlotNumber: e.target.value }),
    },
  ];
  const inputsDetail: InputFiledParams[] = [
    {
      key: 16,
      label: "Hình ảnh tài sản",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.assetImage,
      onChange: (e: any) =>
        form.setValues({ ...form.values, assetImage: e.target.value }),
    },
    {
      key: 17,
      label: "Diện tích khuôn viên (m²)",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.areaWidth,
      onChange: (e: any) =>
        form.setValues({ ...form.values, areaWidth: e.target.value }),
    },
    {
      key: 18,
      label: "Diện tích phù hợp quy hoạch (m²)",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.areaInplan,
      onChange: (e: any) =>
        form.setValues({ ...form.values, areaInplan: e.target.value }),
    },
    {
      key: 19,
      label: "Diện tích không phù hợp quy hoạch (m²)",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.areaUnplan,
      onChange: (e: any) =>
        form.setValues({ ...form.values, areaUnplan: e.target.value }),
    },
    {
      key: 20,
      label: "Kích thước mặt tiền",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.facadeLength,
      onChange: (e: any) =>
        form.setValues({ ...form.values, facadeLength: e.target.value }),
    },
    {
      key: 21,
      label: "Số mặt tiền tiếp giáp",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.numberOfFacade,
      onChange: (e: any) =>
        form.setValues({ ...form.values, numberOfFacade: e.target.value }),
    },
    {
      key: 22,
      label: "Hình dạng",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.shape,
      onChange: (e: any) =>
        form.setValues({ ...form.values, shape: e.target.value }),
    },
    {
      key: 23,
      label: "Độ rộng đường/hẻm chính/hẻm phụ (m)",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.widthToMainRoad,
      onChange: (e: any) =>
        form.setValues({ ...form.values, widthToMainRoad: e.target.value }),
    },
    {
      key: 24,
      label: "Khoảng cách tới trục đường chính (m)",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.distanceToMainRoad,
      onChange: (e: any) =>
        form.setValues({ ...form.values, distanceToMainRoad: e.target.value }),
    },
    {
      key: 25,
      label: "Lợi thế kinh doanh",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.businessAdvantage,
      onChange: (e: any) =>
        form.setValues({ ...form.values, businessAdvantage: e.target.value }),
    },
    {
      key: 26,
      label: "Pháp lý",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.legal,
      onChange: (e: any) =>
        form.setValues({ ...form.values, legal: e.target.value }),
    },
    {
      key: 27,
      label: "Giao thông",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.traffic,
      onChange: (e: any) =>
        form.setValues({ ...form.values, traffic: e.target.value }),
    },
    {
      key: 28,
      label: "Bảo mật",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.security,
      onChange: (e: any) =>
        form.setValues({ ...form.values, security: e.target.value }),
    },
    {
      key: 29,
      label: "Bảo hiểm",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.infrastructure,
      onChange: (e: any) =>
        form.setValues({ ...form.values, infrastructure: e.target.value }),
    },
    {
      key: 30,
      label: "Mục đích sử dụng đất",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.usingPurposeId,
      onChange: (e: any) =>
        form.setValues({ ...form.values, usingPurposeId: e.target.value }),
    },
    {
      key: 31,
      label: "Ghi chú",
      require: false,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.note,
      onChange: (e: any) =>
        form.setValues({ ...form.values, note: e.target.value }),
    },
    {
      key: 32,
      label: "Giá giao dịch",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.transactionPrice,
      onChange: (e: any) =>
        form.setValues({ ...form.values, transactionPrice: e.target.value }),
    },
    {
      key: 88,
      label: "Giá ước tính giao dịch",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.estimatePrice,
      onChange: (e: any) =>
        form.setValues({ ...form.values, estimatePrice: e.target.value }),
    },
    {
      key: 33,
      label: "Diện tích sàn",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.totalFloorArea,
      onChange: (e: any) =>
        form.setValues({ ...form.values, totalFloorArea: e.target.value }),
    },
    {
      key: 34,
      label: "Đơn giá xây dựng",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.constructionUnitPrice,
      onChange: (e: any) =>
        form.setValues({
          ...form.values,
          constructionUnitPrice: e.target.value,
        }),
    },
    {
      key: 35,
      label: "Chất lượng còn lại",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.remainQuality,
      onChange: (e: any) =>
        form.setValues({ ...form.values, remainQuality: e.target.value }),
    },
    {
      key: 36,
      label: "Giá xây dựng",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.constructionPrice,
      onChange: (e: any) =>
        form.setValues({ ...form.values, constructionPrice: e.target.value }),
    },
    {
      key: 37,
      label: "Đơn giá đất",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.landUnitPrice,
      onChange: (e: any) =>
        form.setValues({ ...form.values, landUnitPrice: e.target.value }),
    },
    {
      key: 38,
      label: "Giá trị tổng",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.totalValue,
      onChange: (e: any) =>
        form.setValues({ ...form.values, totalValue: e.target.value }),
    },
    {
      key: 39,
      label: "Giá thuê theo ngày",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.rentDayPrice,
      onChange: (e: any) =>
        form.setValues({ ...form.values, rentDayPrice: e.target.value }),
    },
    {
      key: 40,
      label: "Giá thuê theo năm",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.rentYearPrice,
      onChange: (e: any) =>
        form.setValues({ ...form.values, rentYearPrice: e.target.value }),
    },
    {
      key: 41,
      label: "Giá ước tính thuê theo năm",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.estimateRentYearPrice,
      onChange: (e: any) =>
        form.setValues({
          ...form.values,
          estimateRentYearPrice: e.target.value,
        }),
    },
    {
      key: 42,
      label: "Đơn giá thuê theo năm",
      require: true,
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: form.values.rentYearUnitPrice,
      onChange: (e: any) =>
        form.setValues({ ...form.values, rentYearUnitPrice: e.target.value }),
    },
  ];
  return (
    <Space direction="vertical" style={{ padding: "8px", width: "100%" }}>
      <Form
        labelWrap
        labelAlign="left"
        size="small"
        layout="vertical"
        className="add-assets-form-container"
      >
        <Space direction="vertical" size={"small"}>
          <Space
            size={"small"}
            direction="vertical"
            className="commant-wrapper-content"
          >
            <Typography.Title level={5} className="commant-header">
              Thông tin tham chiếu
            </Typography.Title>
            <Row gutter={[8, 8]}>
              <InputFields data={inputsAddress} />
            </Row>
          </Space>
          <Space
            size={"small"}
            direction="vertical"
            className="commant-wrapper-content"
          >
            <Typography.Title level={5} className="commant-header">
              Địa chỉ
            </Typography.Title>
            <Row gutter={[8, 8]}>
              <InputFields data={inputsInfo} />
            </Row>
          </Space>
          <Space
            size={"small"}
            direction="vertical"
            className="commant-wrapper-content"
          >
            <Typography.Title level={5} className="commant-header">
              Chi tiết
            </Typography.Title>
            <Row gutter={[8, 8]}>
              <InputFields data={inputsDetail} />
            </Row>
          </Space>
        </Space>
      </Form>
      <div
        style={{
          display: "flex",
          justifyContent: "right",
          gap: "8px",
        }}
      >
        <ButtonCustom label="Hủy bỏ" onClick={closeModal} />
        <ButtonCustom
          label="Lưu"
          type="primary"
          htmlType="submit"
          bgColor="rgba(40, 98, 175, 1)"
          //onClick={handleSaveTSSS}
        />
      </div>
    </Space>
  );
};

export default CreateCompareAssetForm;
