import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import { ComparedAssetLandType } from "constant/types/compareAsset";
import { randomId } from "utils";
import { validateCurrencyMaxLength } from "utils/validate";
import * as Yup from "yup";

const initialValue: Array<ComparedAssetLandType> = [];

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
const defaultItem: ComparedAssetLandType = {
  key: "",
  assetCode: null,
  provinceId: null,
  districtId: null,
  wardId: null,
  positionId: null,
  usingPurposeId: null,
  usingPurposeConsolidationIds: [],
  combineUsingPurposeConsolidationDetail: "",
  dataSourceId: 4,
  infoSourceId: null,
  contact: "",
  transactionStatus: "",
  transactionTime: null,
  appraisalTime: "",
  addressProvince: null,
  addressDistrict: null,
  addressWard: null,
  addressStreet: "",
  addressDetail: "",
  address: "",
  mapSheetNumber: "",
  landPlotNumber: "",
  latitude: null,
  longitude: null,
  assetImage: "",
  areaWidth: null,
  landLength: null,
  areaInplan: null,
  areaUnplan: null,
  facadeLength: null,
  numberOfFacade: null,
  shape: "",
  widthToMainRoad: null,
  distanceToMainRoad: null,
  businessAdvantage: "",
  legal: "",
  traffic: "",
  security: "",
  infrastructure: "",
  projectName: "",
  note: "",
  transactionPrice: null,
  estimatePrice: null,
  totalFloorArea: null,
  constructionUnitPrice: null,
  remainQuality: null,
  constructionPrice: 0,
  landUnitPrice: 0,
  landPrice: null,
  rentDayPrice: null,
  rentMonthPrice: null,
  rentYearPrice: null,
  estimateRentYearPrice: null,
  rentYearUnitPrice: null,
  totalValue: null,
  coordinate: {
    latitude: null,
    longitude: null,
  },
  whoCreate: "",
  dateCreate: "",
  approved: null,
  sentiment: null,
  sentimentApproved: null,
  storedType: "Tài sản so sánh",
  storedTypeId: 2,
  priceInPlan: null,
  structure: "",
  frontage: "",
  geographicDescription: "",
  surfaces: "",
  distanceToAsset: null,
  usingPeriod: null,
  planning: "",
  landLengthDetail: null,
  percent: null,
  lGPrice: null,
  lGUnitPrice: null,
};
export const formStoredAssetLandSchema = Yup.object().shape({
  compareAssets: Yup.array().of(
    Yup.object().shape({
      dataSourceId: Yup.string()
        .nullable()
        .required("Vui lòng chọn nguồn dữ liệu"),
      infoSourceId: Yup.number()
        .nullable()
        .required("Vui lòng chọn nguồn thông tin"),
      contact: Yup.string().nullable().required("Vui lòng nhập SĐT"),
      transactionStatus: Yup.string()
        .nullable()
        .required("Vui lòng nhập tình trạng"),
      addressProvince: Yup.string()
        .nullable()
        .required("Vui lòng chọn Tỉnh/TP"),
      addressDistrict: Yup.string()
        .nullable()
        .required("Vui lòng chọn Quận/Huyện/TP/Thị xã"),
      addressWard: Yup.string().nullable().required("Vui lòng chọn Phường/Xã"),
      addressStreet: Yup.string()
        .nullable()
        .required("Vui lòng nhập đường phố"),
      positionId: Yup.string().nullable().required("Vui lòng nhập vị trí"),
      geographicDescription: Yup.string()
        .nullable()
        .required("Vui lòng nhập vị trí tiếp giáp"),
      areaWidth: Yup.number().nullable().required("Vui lòng nhập diện tích"),
      areaInplan: Yup.number().nullable().required("Vui lòng nhập diện tích"),
      areaUnplan: Yup.number().nullable().required("Vui lòng nhập diện tích"),
      usingPurposeId: Yup.number()
        .nullable()
        .required("Vui lòng nhập mục đích"),
      usingPurposeConsolidationIds: Yup.array()
        .of(Yup.number().nullable())
        .test(
          "usingPurposeConsolidationIds",
          "Vui lòng nhập mục đích",
          function (value) {
            const { usingPurposeId } = this.parent;
            if (usingPurposeId === 80 && (!value || value.length === 0)) {
              return false;
            }
            return true;
          }
        ),
      transactionPrice: validateCurrencyMaxLength.required(
        "Vui lòng nhập giá giao dịch"
      ),
      estimatePrice: validateCurrencyMaxLength.required(
        "Vui lòng nhập giá ước tính"
      ),
      priceInPlan: Yup.number()
        .nullable()
        .test("priceInPlan", "Vui lòng nhập giá PHQH", function (value) {
          const {
            rentYearUnitPrice,
            rentMonthPrice,
            rentYearPrice,
            estimateRentYearPrice,
          } = this.parent;
          if (
            value == null &&
            (!rentYearUnitPrice ||
              !rentMonthPrice ||
              !rentYearPrice ||
              !estimateRentYearPrice)
          ) {
            return false;
          }
          return true;
        }),

      rentMonthPrice: Yup.number()
        .nullable()
        .test("rentMonthPrice", "Vui lòng nhập giá thuê", function (value) {
          const { priceInPlan } = this.parent;
          if (value == null && !priceInPlan) {
            return false;
          }
          return true;
        }),
      rentYearPrice: Yup.number()
        .nullable()
        .test("rentYearPrice", "Vui lòng nhập giá thuê", function (value) {
          const { priceInPlan } = this.parent;
          if (value == null && !priceInPlan) {
            return false;
          }
          return true;
        }),
      remainQuality: Yup.number()
        .nullable()
        .integer("Chỉ được nhập số nguyên")
        .typeError("Chỉ được nhập số nguyên"),
      estimateRentYearPrice: Yup.number()
        .nullable()
        .test(
          "estimateRentYearPrice",
          "Vui lòng giá ước tính",
          function (value) {
            const { priceInPlan } = this.parent;
            if (value == null && !priceInPlan) {
              return false;
            }
            return true;
          }
        ),
      rentYearUnitPrice: Yup.number()
        .nullable()
        .test("rentYearUnitPrice", "Vui lòng nhập đơn giá", function (value) {
          const { priceInPlan } = this.parent;
          if (value == null && !priceInPlan) {
            return false;
          }
          return true;
        }),
      legal: Yup.string().nullable().required("Vui lòng nhập pháp lý"),
      transactionTime: Yup.string()
        .nullable()
        .required("Thời điểm giao dịch không được để trống"),
    })
  ),
});

for (let i = 0; i < 1; i++) {
  const item: ComparedAssetLandType = {
    ...defaultItem,
    key: randomId(),
  };
  initialValue.push(item);
}

export { columnsTb, defaultItem, initialValue };
