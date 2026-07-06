import { ComparedAssetAppartmentCreateType } from "constant/types";
import { randomId } from "utils";

const initialValue: Array<ComparedAssetAppartmentCreateType> = [];

const defaultItem: ComparedAssetAppartmentCreateType = {
  key: "",
  assetCode: null,
  assetId: null,
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

  coordinate: {
    latitude: null,
    longitude: null,
  },
  
  appraisalUnit: "",
  building: "",
  numberApartment: null,
  floorNo: null,
  totalFloor: null,
  surfaces: null,
  furniture: null,
  utilities: null,
  toilets: null,
  bedrooms: null,
  kitchens: null,
  businessAdvantage: "",
  otherFactor: "",
  buildupArea: null,
  extendArea: null,
  clearanceArea: null,
  privateUseArea: null,
  transactionPrice: null,
  estimatePrice: null,
  singlePriceExchangeArea: null,
  projectName: "",
  usingPurposeName: "",
  sentiment: '',
  totalFloorArea: null,
  storedType: 'Tài sản so sánh',
  storedTypeId: 2,
  apartmentCode: '',
  geographicDescription: "",
  legal: '',
  unitPrice: null,
};

for (let i = 0; i < 1; i++) {
  const item: ComparedAssetAppartmentCreateType = {
    ...defaultItem,
    key: randomId(),
  };
  initialValue.push(item);
}

export { initialValue, defaultItem };
