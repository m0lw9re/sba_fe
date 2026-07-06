import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import { VIETNAM_ID } from "constant/common";
import { ComparedAssetWaterVehicleType } from "constant/types";
import { randomId } from "utils";
import { validateCurrencyMaxLength, validLengthInput } from "utils/validate";
import * as Yup from "yup";

const columnsTb: ColumnsEdit = [
  {
    title: "Nội dung",
    dataIndex: "name",
    key: "name",
    colSpan: 2,
  },
  {
    title: "lable",
    dataIndex: "lable",
    key: "lable",
    colSpan: 0,
  },
  {
    title: "TS 1",
    dataIndex: "ts1",
    key: "ts1",
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
  },
];
const initialValue: Array<ComparedAssetWaterVehicleType> = [];

const defaultItem: ComparedAssetWaterVehicleType = {
  key: randomId(),
  assetId: null,
  assetCode: null,
  dataSourceId: 4,
  infoSourceId: null,
  contact: null,
  transactionStatus: null,
  transactionTime: null,

  addressProvince: null,
  addressDistrict: null,
  addressWard: null,
  addressDetail: null,
  assetImage: null,
  name: null,
  registerNumber: null,
  model: null,
  imoNumber: null,
  brand: null,
  yearMfg: null,
  yearReconstructed: null,
  countryMfgId: null,
  // LISTBOX
  manufacturingLocation: null,
  shipbuildingBrand: null,
  registerCountry: null,
  shipUtilities: null,
  personCarry: null,
  designLength: null,
  designWidth: null,
  maxLength: null,
  boardHeight: null,
  sink: null,
  freeBoard: null,
  machineNum: null,
  machinePower: null,
  deadWeight: null,
  grossTonnage: null,
  useTonnage: null,
  speed: null,
  additionalContent: null,
  currentUseSituation: null,
  numberOfDaysUsed: null,
  remainQuality: null,
  transactionPrice: null,
  estimatedRate: null,
  estimatePrice: null,
  shipType: null,

  note: null,

  storedTypeId: 2,
  approved: null,
  dateCreate: null,
  whoCreate: null,

  // chưa được sử dụng
  description: null,
  addressStreet: null,
  appraisalTime: null,
  sentiment: null,
  color: null,
  usingOrigin: null,
  noteLegalSBA: null,
};

for (let i = 0; i < 1; i++) {
  const item: ComparedAssetWaterVehicleType = {
    ...defaultItem,
    key: randomId(),
  };
  initialValue.push(item);
}
const waterVehicleCompareAssetFormSchema = Yup.object().shape({
  compareAssets: Yup.array().of(
    Yup.object().shape({
      dataSourceId: Yup.number()
        .required("Vui lòng chọn nguồn dữ liệu")
        .nullable(),
      infoSourceId: Yup.number()
        .required("Vui lòng chọn nguồn thông tin")
        .nullable(),
      contact: Yup.string().required("Vui lòng nhập SĐT").nullable(),
      transactionStatus: Yup.string()
        .required("Vui lòng nhập tình trạng giao dịch")
        .nullable(),
      transactionTime: Yup.string()
        .required("Vui lòng chọn thời điểm giao dịch")
        .nullable(),
      addressProvince: Yup.string()
        .required("Vui lòng chọn tỉnh/thành phố")
        .nullable(),
      addressDistrict: Yup.string()
        .required("Vui lòng chọn quận/huyện")
        .nullable(),
      addressWard: Yup.string().required("Vui lòng chọn phường/xã").nullable(),
      addressDetail: Yup.string()
        .required("Vui lòng nhập địa chỉ chi tiết")
        .nullable(),
      shipType: Yup.string().required("Vui lòng phân loại tài sản").nullable(),
      name: Yup.string().required("Vui lòng nhập tên phương tiện").nullable(),
      // registerNumber: Yup.string()
      //   .required("Vui lòng nhập số đăng ký")
      //   .nullable(),
      // model: Yup.string().required("Vui lòng nhập số loại/Model").nullable(),
      // imoNumber: Yup.string().required("Vui lòng nhập số IMO").nullable(),
      estimatedRate: Yup.number()
        .required("Vui lòng nhập Tỉ lệ ước tính")
        .positive("Chỉ chấp nhận số nguyên dương")
        .integer("Chỉ chấp nhận số nguyên")
        .max(999, "Tối đa 3 ký số")
        .test(
          "length",
          "Tối đa 3 ký số",
          (value) => value === null || String(value).length <= 3
        )
        .nullable()
        .label("Nhập"),
      transactionPrice: validateCurrencyMaxLength.required(
        "Vui lòng nhập giá giao dịch/ rao bán"
      ),
      // yearMfg: Yup.number()
      //   .nullable()
      //   .test("constructionYearFormSchema", "Chỉ nhập được 4 ký tự", (val) =>
      //     validLengthInput(val, 4)
      //   ),
      estimatePrice: validateCurrencyMaxLength,
      yearMfg: Yup.number()
        .nullable()
        .integer("Chỉ được nhập số nguyên")
        .min(1700, "Năm sản xuất phải lớn hơn 1700")
        .max(9999, "Chỉ nhập được 4 ký tự")
        .test(
          "length",
          "Chỉ nhập được 4 ký tự",
          (value) => !value || String(value).length <= 4
        )
        .test(
          "no-decimal-or-comma",
          "Không dùng dấu chấm hoặc dấu phẩy",
          (value: any) => !value || /^[0-9]+$/.test(value)
        )
        .label("Nhập"),
      yearReconstructed: Yup.number()
        .nullable()
        .integer("Chỉ được nhập số nguyên")
        .min(1700, "Năm hoán cải phải lớn hơn 1700")
        .max(9999, "Chỉ nhập được 4 ký tự")
        .test(
          "length",
          "Chỉ nhập được 4 ký tự",
          (value) => !value || String(value).length <= 4
        )
        .test(
          "no-decimal-or-comma",
          "Không dùng dấu chấm hoặc dấu phẩy",
          (value: any) => !value || /^[0-9]+$/.test(value)
        )
        .label("Nhập"),
      // countryMfgId: Yup.number()
      //   .required("Vui lòng chọn nước sản xuất")
      //   .nullable(),
      // ss
      // registerCountry: Yup.string()
      //   .required("Vui lòng quốc gia đăng ký")
      //   .nullable(),
      // shipUtilities: Yup.string()
      //   .required('Vui lòng nhập Công năng sử dụng')
      //   .nullable(),
      noteLegalSBA: Yup.string()
        .nullable()
        .max(500, "Ghi chú pháp lý không quá 500 ký tự")
        .required("Vui lòng nhập pháp lý"),
    })
  ),
});

export {
  columnsTb,
  defaultItem,
  initialValue,
  waterVehicleCompareAssetFormSchema,
};
