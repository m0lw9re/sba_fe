type FilterSpecificPricesType = {
  infoSourceId?: number;
  assetType?: number;
  addressProvince?: string | null;
  addressDistrict?: string | null;
  addressWard?: string | null;
  addressStreet?: string | null;
  addressDetail?: string | null;
  approved?: boolean;
  direction?: number;
  sortField?: string;
  dateFrom: string | null;
  dateTo: string | null;
  usingPurposeId?: number;
  storedTypeId?: number;
  assetCode?: string | null;
  legal?: number;
  mapSheetNumber?: string | null;
  landPlotNumber?: string | null;
  priceFrom?: number;
  priceTo?: number;
  positionId?: number;
  projectName?: string | null;
  building?: string | null;
  areaWidth?: number;
  transactionPrice?: number | null;
  assetLevelThreeId?: number | null;
};

type FilterAssetMoveableEstateType = {
  infoSourceId?: number;
  assetType?: number;
  addressProvince?: string | null;
  addressDistrict?: string | null;
  addressWard?: string | null;
  addressStreet?: string | null;
  addressDetail?: string | null;
  approved?: boolean;
  direction?: number;
  sortField?: string;
  dateFrom: string | null;
  dateTo: string | null;
  usingPurposeId?: number;
  storedTypeId?: number;
  assetCode?: string | null;
  legal?: number;
  mapSheetNumber?: string | null;
  landPlotNumber?: string | null;
  priceFrom?: number;
  priceTo?: number;
  positionId?: number;
  projectName?: string | null;
  building?: string | null;
  areaWidth?: number;
  estimatePrice?: number | null;
  transactionPrice?: number | null
  assetLevelThreeId?: number | null;
};

type PricesSpecificAppartmentType = {
  key?: number;
  assetId: string | null;
  assetCode: string | null;
  dataSourceId: number | null;
  infoSourceId: number | null;
  contact: string | null;
  transactionStatus: string | null;
  transactionTime: string | null;
  appraisalTime: string | null;
  addressProvince: string | null;
  addressDistrict: string | null;
  addressWard: string | null;
  addressStreet: string | null;
  addressDetail: string | null;
  address: string | null;
  positionName: null;
  mapSheetNumber: string | null;
  landPlotNumber: string | null;
  latitude: number | null;
  longitude: number | null;
  assetImage: string | null;
  projectName: string | null;
  building: string | null;
  apartmentCode: string | null;
  floorNo: number | null;
  facades: number | null;
  furniture: string | null;
  businessAdvantage: string | null;
  otherFactor: string | null;
  privateUseArea: number | null;
  clearanceArea: number | null;
  buildupArea: number | null;
  extendArea: number | null;
  transactionPrice: number | null;
  estimatePrice: number | null;
  unitPrice: number | null;
  whoCreate: number | null;
  dateCreate: string | null;
  approved: boolean | null;
  sentiment: number | null;
  sentimentApproved: number | null;
  coordinate: {
    latitude: number | null;
    longitude: number | null;
  };
};

type PriceSpecificRealEstateType = {
  key?: string;
  assetId: string | null;
  assetCode: string | null;
  dataSourceId: number | null;
  infoSourceId: number | null;
  contact: string | null;
  transactionStatus: string | null;
  transactionTime: string | null;
  appraisalTime: string | null;
  addressProvince: string | null;
  addressDistrict: string | null;
  addressWard: string | null;
  addressStreet: string | null;
  addressDetail: string | null;
  address: string | null;
  positionName: string | null;
  mapSheetNumber: string | null;
  landPlotNumber: string | null;
  latitude: number | null;
  longitude: number | null;
  assetImage: string | null;
  areaWidth: number | null;
  landLength: number | null;
  areaInplan: number | null;
  areaUnplan: number | null;
  facadeLength: number | null;
  numberOfFacade: number | null;
  shape: string | null;
  widthToMainRoad: number | null;
  distanceToMainRoad: number | null;
  businessAdvantage: string | null;
  legal: string | null;
  traffic: string | null;
  security: string | null;
  infrastructure: string | null;
  usingPurposeName: string | null;
  projectName: string | null;
  note: string | null;
  transactionPrice: number | null;
  estimatePrice: number | null;
  totalFloorArea: number | null;
  constructionUnitPrice: number | null;
  remainQuality: number | null;
  constructionPrice: number | null;
  landUnitPrice: number | null;
  landPrice: number | null;
  rentDayPrice: number | null;
  rentYearPrice: number | null;
  estimateRentYearPrice: number | null;
  rentYearUnitPrice: number | null;
  totalValue: number | null;
  coordinate: {
    latitude: number | null;
    longitude: number | null;
  };
  whoCreate: string | null;
  dateCreate: string | null;
  approved: boolean | null;
  sentiment: number | null;
  sentimentApproved: number | null;
};

type AddressAssetTableType = {
  key: number;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  streetCode: string;
  subStreetCode: string;
  detail: string;
};

type AssetLandValuationTableType = {
  key: number;
  landUseRight: string;
  valuationMethod: string;
  planningInformation: string;
  area: number;
  PHQHArea: number;
  notPHQHArea: number;
  singlePrice: number;
  valuationValue: number;
  proposedValue: number;
};

type AssetValuationHistoryType = {
  key: number;
  time: string;
  assetValue: string;
  note: string;
};

export type {
  FilterSpecificPricesType,
  FilterAssetMoveableEstateType,
  PriceSpecificRealEstateType,
  PricesSpecificAppartmentType,
  AddressAssetTableType,
  AssetLandValuationTableType,
  AssetValuationHistoryType,
};
