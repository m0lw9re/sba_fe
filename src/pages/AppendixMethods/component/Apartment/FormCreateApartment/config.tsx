import { ComparedAssetAppartmentCreateType } from "constant/types";
import { randomId } from "utils";

const initialValue: Array<ComparedAssetAppartmentCreateType> = [];

const defaultItem: ComparedAssetAppartmentCreateType = {
  key: "",
  assetCode: null,
  assetId: null,
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
  positionId: null,
  mapSheetNumber: "",
  landPlotNumber: "",
  latitude: null,
  longitude: null,
  assetImage: "",

  coordinate: {
    latitude: null,
    longitude: null,
  },

  appraisalUnit: null,
  building: "",
  numberApartment: null,
  apartmentCode: null,
  floorNo: null,
  totalFloor: null,
  surfaces: null,
  furniture: null,
  utilities: null,
  businessAdvantage: "",
  otherFactor: "",
  buildupArea: null,
  extendArea: null,
  privateUseArea: null,
  transactionPrice: null,
  unitPrice: null,
  estimatePrice: null,
  singlePriceExchangeArea: null,
  projectName: "",
  sentiment: "",
  totalFloorArea: null,
  storedType: "Tài sản so sánh",
  storedTypeId: 2,
  clearanceArea: null,
  legal: "",
  description: "",
};

for (let i = 0; i < 1; i++) {
  const item: ComparedAssetAppartmentCreateType = {
    ...defaultItem,
    key: randomId(),
  };
  initialValue.push(item);
}

export { initialValue, defaultItem };
