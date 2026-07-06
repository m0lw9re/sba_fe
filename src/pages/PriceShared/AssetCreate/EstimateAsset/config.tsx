import { ComparedAssetEstimateCreateType } from "constant/types";
import { randomId } from "utils";

const initialValue: Array<ComparedAssetEstimateCreateType> = [];

const defaultItem: ComparedAssetEstimateCreateType = {
  key: "",
  assetCode: null,
  dataSourceId: null,
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
  positionName: "",
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
  usingPurposeName: "",
  projectName: "",
  note: "",
  transactionPrice: null,
  estimatePrice: null,
  totalFloorArea: null,
  constructionUnitPrice: null,
  remainQuality: null,
  constructionPrice: null,
  landUnitPrice: null,
  landPrice: null,
  rentDayPrice: null,
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
  storedType: 'Tài sản so sánh',
  storedTypeId: 2,
  priceInPlan: null,
  structure: "",
  roadContiguousTypeId: null,
  geographicDescription: "",
};

for (let i = 0; i < 1; i++) {
  const item: ComparedAssetEstimateCreateType = {
    ...defaultItem,
    key: randomId(),
  };
  initialValue.push(item);
}

export { initialValue, defaultItem };
