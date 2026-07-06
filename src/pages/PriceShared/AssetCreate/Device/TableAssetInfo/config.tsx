import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import * as Yup from "yup";
import { ComparedAssetDeviceCreateType } from "constant/types";
import { randomId } from "utils";
import { ASSET_LV3 } from "constant/enums";
import { validateCurrencyMaxLength, validLengthInput } from "utils/validate";

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

const initialValue: Array<ComparedAssetDeviceCreateType> = [];

const defaultItem: ComparedAssetDeviceCreateType = {
  key: "",
  assetId: null,
  assetCode: null,
  dataSourceId: 4,
  infoSourceId: null,
  contact: "",
  transactionStatus: "",
  transactionTime: null,
  addressProvince: null,
  addressDistrict: null,
  addressWard: null,
  addressStreet: "",
  addressDetail: "",
  assetImage: "",
  brand: null,
  model: null,
  power: null,
  remainQuality: null,
  transactionPrice: null,
  estimatePrice: null,
  yearMfg: null,
  name: "",
  manufacturer: "",
  note: "",
  description: "",
  appraisalTime: null,
  approved: null,
  assetLevelThreeId: null,
  color: null,
  commonMachine: null,
  controlType: null,
  countryMfgId: null,
  currentUseSituation: null,
  disputeInfor: null,
  engine: null,
  electricEngine: null,
  engineSystem: null,
  liquidity: null,
  mainEngine: null,
  mfr: null,
  optimizePrice: null,
  positionId: null,
  size: null,
  specs: null,
  usingOrigin: null,
  usingPurposeId: null,
  workingPrinciple: null,
  climsId: null,
  additionalContent: null,
  numberOfDaysUsed: null,
  estimatedRate: null,
  storedTypeId: 2,

  productionLineName: null,
  noteLegalSBA: null,

  engineNo: null,
};

for (let i = 0; i < 1; i++) {
  const item: ComparedAssetDeviceCreateType = {
    ...defaultItem,
    key: randomId(),
  };
  initialValue.push(item);
}
const deviceCompareAssetFormSchema = Yup.object().shape({
  compareAssets: Yup.array().of(
    Yup.object().shape({
      dataSourceId: Yup.string()
        .required("Vui lòng chọn nguồn dữ liệu")
        .nullable(),
      infoSourceId: Yup.string()
        .required("Vui lòng chọn nguồn thông tin")
        .nullable(),
      contact: Yup.string()
        .required("Vui lòng nhập người liên hệ và SĐT")
        .nullable(),
      transactionStatus: Yup.string()
        .required("Vui lòng nhập tình trạng giao dịch")
        .nullable(),
      transactionTime: Yup.string()
        .required("Vui lòng chọn thời điểm giao dịch")
        .nullable(),

      // Địa chỉ
      addressProvince: Yup.string()
        .required("Vui lòng chọn Tỉnh/Thành phố")
        .nullable(),
      addressDistrict: Yup.string()
        .required("Vui lòng chọn Quận/Huyện/Thị xã/Thành phố")
        .nullable(),
      addressWard: Yup.string()
        .required("Vui lòng chọn Xã/Phường/Thị trấn")
        .nullable(),
      addressDetail: Yup.string()
        .required("Vui lòng nhập mô tả chi tiết")
        .nullable(),

      // Chi tiết
      name: Yup.string().required("Vui lòng nhập tên MMTB").nullable(),
      brand: Yup.string().nullable().nullable(),
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
      productionLineName: Yup.string()
        .nullable()
        .test(
          "productionLineName",
          "Vui lòng nhập tên dây chuyền sản xuất",
          function (value) {
            const { assetLevelThreeId } = this.parent;
            if (assetLevelThreeId === ASSET_LV3.PRODUCTION_LINE) {
              return Boolean(value);
            }
            return true;
          }
        ),
      estimatedRate: Yup.number()
        .required("Vui lòng nhập Tỉ lệ ước tính")
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

export { columnsTb, deviceCompareAssetFormSchema, defaultItem, initialValue };
