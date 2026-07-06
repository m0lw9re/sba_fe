import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import { ASSET_LV3 } from "constant/enums";
import { ComparedAssetRoadVehicleCreateType } from "constant/types";
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

const initialValue: Array<ComparedAssetRoadVehicleCreateType> = [];

const defaultItem: ComparedAssetRoadVehicleCreateType = {
  key: "",
  assetId: null,
  assetCode: null,
  dataSourceId: 4,
  infoSourceId: null,
  contact: null,
  transactionStatus: null,
  transactionTime: null,

  //Địa chỉ
  addressProvince: null,
  addressDistrict: null,
  addressWard: null,
  addressDetail: null,
  addressStreet: null,

  assetImage: null,

  name: null,
  vehicleBrand: null,
  vehicleModel: null,
  vehicleColor: null,
  maxOutputRpm: null,
  odo: null,
  remainQuality: null,
  yearMfg: null,
  countryMfgId: null,
  description: null,
  legalMaxOutputRpm: null,
  numberOfKilometersUsed: null,
  storedTypeId: 2,
  type: null,
  gearBoxId: null,
  wheelFormulaId: null,
  fuelId: null,
  vehicleIdNumber: null,
  engineNumber: null,
  plateNumber: null,
  overallDims: null,
  weightBase: null,
  weightAll: null,
  wheelBase: null,
  personCarry: null,
  engineDisp: null,
  numberOfTires: null,
  currentUseSituation: null,
  noteLegalSBA: null,

  // ĐỐI VỚI  XE TẢI/ XE CHUYÊN DỤNG/ XE Ô TÔ ĐẦU KÉO/ RƠ - MOOC/ SƠ MI RƠ MOOC
  vehicleTrunkSize: null,
  volumeOfGoodsTransported: null,
  volumeOfTowedGoods: null,
  tankCapacity: null,

  // Giá giao dịch/rao bán, Tỉ lệ ước tính, Giá ước tính
  transactionPrice: null,
  estimatedPrice: null,
  estimatedRate: null,

  approved: null,
};
const roadVehicleCompareAssetFormSchema = Yup.object().shape({
  compareAssets: Yup.array().of(
    Yup.object().shape({
      dataSourceId: Yup.number()
        .required("Vui lòng chọn nguồn dữ liệu")
        .nullable(),
      infoSourceId: Yup.string()
        .required("Vui lòng chọn nguồn thông tin")
        .nullable(),
      contact: Yup.string().required("Vui lòng nhập SĐT").nullable(),
      transactionStatus: Yup.string()
        .required("Vui lòng nhập tình trạng giao dịch")
        .nullable(),
      transactionTime: Yup.string()
        .required("Vui lòng chọn thời điểm giao dịch")
        .nullable(),
      type: Yup.string().required("Vui lòng phân loại tài sản").nullable(),
      // name: Yup.string().required('Vui lòng nhập tên phương tiện').nullable(),
      vehicleBrand: Yup.string()
        .required("Vui lòng nhập nhãn hiệu xe")
        .nullable(),
      // vehicleModel: Yup.string()
      //   .required("Vui lòng nhập số loại/Model xe")
      //   .nullable(),
      // vehicleColor: Yup.string().required("Vui lòng nhập màu sơn").nullable(),
      // countryMfgId: Yup.string()
      //   .required("Vui lòng chọn nước sản xuất")
      //   .nullable(),
      // gearBoxId: Yup.string().when("type", {
      //   is: (value: string) => value !== ASSET_LV3.MOTO.toString(),
      //   then: Yup.string().nullable(),
      //   otherwise: Yup.string().nullable(),
      // }),
      addressProvince: Yup.string()
        .required("Vui lòng chọn Tỉnh/TP")
        .nullable(),
      addressDistrict: Yup.string()
        .required("Vui lòng chọn Thành phố/Quận/Huyện/Thị xã")
        .nullable(),
      addressWard: Yup.string()
        .required("Vui lòng chọn Xã/Phường/Thị trấn")
        .nullable(),
      addressDetail: Yup.string()
        .required("Vui lòng nhập địa chỉ chi tiết")
        .nullable(),
      //
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
      estimatedRate: Yup.string()
        .required("Vui lòng nhập tỷ lệ ước tính")
        .nullable(),
      transactionPrice: validateCurrencyMaxLength.required(
        "Vui lòng nhập giá giao dịch/ rao bán"
      ),
      estimatePrice: validateCurrencyMaxLength,
      noteLegalSBA: Yup.string()
        .nullable()
        .max(500, "Ghi chú pháp lý không quá 500 ký tự")
        .required("Vui lòng nhập pháp lý"),
    })
  ),
});

for (let i = 0; i < 1; i++) {
  const item: ComparedAssetRoadVehicleCreateType = {
    ...defaultItem,
    key: randomId(),
  };
  initialValue.push(item);
}

export {
  columnsTb,
  defaultItem,
  initialValue,
  roadVehicleCompareAssetFormSchema,
};
