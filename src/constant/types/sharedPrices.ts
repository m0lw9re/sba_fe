type AssetListApprovalWaitingType = {
  key?: number;
  storeCode: string;
  climsCode: string;
  categoryType: string;
  realAddress: string;
  trafficLine: string;
  purposeLandUsage: string;
  area: number;
  singlePrice: number;
  creater: string;
  status: string;
  sourceInfor: string;
};

type ComparedAssetLandEstateCreateType = {
  key?: string;
  assetCode: string | null;
  dataSourceId: number | null;
  infoSourceId: number | null;
  contact: string | null;
  transactionStatus: string | null;
  transactionTime: Date | null;
  appraisalTime: string | null;
  addressProvince: string | null;
  addressDistrict: string | null;
  addressWard: string | null;
  addressStreet: string | null;
  addressDetail: string | null;
  address: string | null;
  positionId?: string | null;
  positionName?: string | null;
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
  usingPurposeId?: string | null;
  usingPurposeName?: string | null;
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
  approved: string | null;
  sentiment: string | null;
  sentimentApproved: string | null;
  storedType: string | null;
  storedTypeId: number | null;
  priceInPlan?: number | null;
  description?: string | null;
  areaInPlan?: number | null;
  structure?: string | null;
  frontage?: number | null;
  roadContiguousTypeId?: number | null;
  geographicDescription?: string | null;
  addressMap?: string | null;
};

type ComparedAssetAppartmentCreateType = {
  key?: string;
  assetCode: string | null;
  assetId: string | null;
  dataSourceId: number | null;
  infoSourceId: number | null;
  contact: string | null;
  transactionStatus: string | null;
  transactionTime: Date | null;
  appraisalTime: string | null;
  addressProvince: string | null;
  addressProvinceName?: string;
  addressDistrict: string | null;
  addressDistrictName?: string;
  addressWard: string | null;
  addressWardName?: string;
  addressStreet: string | null;
  addressDetail: string | null;
  address: string | null;
  positionId?: string | null;
  positionName?: string | null;
  mapSheetNumber: string | null;
  landPlotNumber: string | null;
  latitude: number | null;
  longitude: number | null;
  projectName: string | null;
  assetImage: string | null;

  // khác
  coordinate: {
    latitude: number | null;
    longitude: number | null;
  };
  appraisalUnit: string | null;
  usingPurposeName?: string | null;
  building: string | null;
  numberApartment: number | null;
  floorNo: number | null;
  totalFloor: number | null;
  surfaces: number | null;
  furniture: string | null;
  // Tiện ích
  utilities: string | null;
  toilets?: number | null;
  bedrooms?: number | null;
  kitchens?: number | null;
  businessAdvantage: string | null;
  otherFactor: string | null;
  buildupArea: number | null;
  extendArea: number | null;
  totalFloorArea: number | null;
  privateUseArea: number | null;
  transactionPrice: number | null;
  estimatePrice: number | null;
  singlePriceExchangeArea: number | null;
  sentiment: string | null;
  storedTypeId: number | null;
  storedType: string | null;
  unitPrice?: number | null;
  clearanceArea?: number | null;
  apartmentCode?: string | null;
  legal?: string | null;
  description?: string | null;
  geographicDescription?: string | null;
};

type ComparedAssetRoadVehicleCreateType = {
  key?: string;
  assetId: string | null;
  assetCode: string | null;
  dataSourceId: number | null;
  infoSourceId: string | null;
  contact: string | null;
  transactionStatus: string | null;
  transactionTime: Date | null;

  //Địa chỉ
  addressProvince: string | null;
  addressProvinceName?: string;
  addressDistrict: string | null;
  addressDistrictName?: string;
  addressWard: string | null;
  addressWardName?: string;
  addressDetail: string | null;
  addressStreet: string | null;

  assetImage: string | null;
  name: string | null;
  vehicleBrand: string | null;
  vehicleModel: string | null;
  vehicleColor: string | null;
  maxOutputRpm: number | null;
  yearMfg: number | null;
  countryMfgId: string | null;
  odo: number | null;
  remainQuality: number | null;
  description: string | null;
  legalMaxOutputRpm: number | null;
  numberOfKilometersUsed: number | null;
  storedTypeId: number | null;
  type: number | null;
  gearBoxId: number | null;
  wheelFormulaId: number | null;
  fuelId: number | null;
  vehicleIdNumber: number | null;
  engineNumber: number | null;
  plateNumber: string | null;
  overallDims: string | null;
  weightBase: number | null;
  weightAll: number | null;
  wheelBase: string | null;
  personCarry: number | null;
  engineDisp: string | null;
  numberOfTires: string | null;
  currentUseSituation: string | null;
  noteLegalSBA: string | null;

  // ĐỐI VỚI  XE TẢI/ XE CHUYÊN DỤNG/ XE Ô TÔ ĐẦU KÉO/ RƠ - MOOC/ SƠ MI RƠ MOOC
  vehicleTrunkSize: number | null;
  volumeOfGoodsTransported: number | null;
  volumeOfTowedGoods: number | null;
  tankCapacity: string | null;

  // Giá giao dịch/rao bán, Tỉ lệ ước tính, Giá ước tính
  transactionPrice: number | null;
  estimatedPrice: number | null;
  estimatedRate: number | null;

  approved: boolean | null;
};

type ComparedAssetWaterVehicleType = {
  key?: string;
  assetId: string | null;
  assetCode: string | null;
  dataSourceId: number | null; // Nguồn dữ liệu
  infoSourceId: number | null; // Nguồn thông tin
  contact: string | null; // Người liên hệ - SĐT
  transactionStatus: string | null; // Tình trạng giao dịch
  transactionTime: string | null; // Thời điểm

  addressProvince: string | null; // Tỉnh/Thành phố
  addressProvinceName?: string;
  addressDistrict: string | null; // Thành phố/Quận/Huyện/Thị xã
  addressDistrictName?: string;
  addressWard: string | null; // Xã/Phường/Thị trấn
  addressWardName?: string;
  addressDetail: string | null; // Mô tả chi tiết
  address?: string;
  assetImage: string | null; // Hình ảnh
  name: string | null; // Tên phương tiện
  registerNumber: number | null; // Số đăng ký
  model: number | null; // Số loại/Model
  imoNumber: number | null; // Số nhận dạng tàu/Số IMO
  brand: string | null; // // Nhãn hiệu
  yearMfg: number | null; // Năm sản xuất
  yearReconstructed: string | null; // Năm hoán cải
  // countryMfg -> countryMfgId
  countryMfgId: number | null; // Nước sản xuất
  // LISTBOX
  manufacturingLocation: string | null; //Nơi đóng tàu
  manufacturingLocationName?: string | null;
  shipbuildingBrand: string | null; // Hãng đóng tàu
  registerCountry: string | null; // Quốc gia đăng ký
  shipUtilities: string | null; // Công năng sử dụng
  personCarry: number | null; // Số lượng người được phép chở
  designLength: number | null; // Chiều dài thiết kế (m)
  designWidth: number | null; // Chiều rộng thiết kế (m)
  maxLength: number | null; // Chiều dài lớn nhất (m)
  boardHeight: number | null; // Chiều cao mạn (m)
  sink: number | null; // Chiều chìm (m)
  freeBoard: number | null; // Mạn khô (m)
  machineNum: number | null; // số lượng máy chính
  machinePower: number | null; // công suất máy(kW)
  deadWeight: number | null; // Trọng tải toàn phần (MT)
  grossTonnage: number | null; // Tổng dung tích (GT)
  useTonnage: number | null; // Dung tích thực dụng (NT)
  speed: number | null; // Tốc độ tàu (HL)
  additionalContent: string | null; // Nội dung khác
  currentUseSituation: string | null; // Hiện trạng sử dụng
  numberOfDaysUsed: string | null; // Số thời gian đã qua sử dụng (Ngày)
  remainQuality: number | null; // Chất lượng còn lại(%)
  transactionPrice: number | null; // Giá giao dịch/ rao bán (đồng)
  estimatedRate: number | null; // Tỷ lệ ước tính (%)
  estimatePrice: number | null; // Giá ước tính (đồng)
  noteLegalSBA: string | null;

  shipType: number | null; // phan loai ts
  note: string | null; // ý kiến

  storedTypeId: number | null;
  approved: boolean | null;
  dateCreate: string | null;
  whoCreate: string | null;

  // chưa được sử dụng
  description: string | null; //mô tả chi tiết
  addressStreet: string | null; // Đường phố
  appraisalTime: string | null; // thời điểm đánh giá
  sentiment: string | null;
  color: string | null; //màu sắc
  usingOrigin: string | null; // nguồn gốc sử dụng
};

type ComparedAssetDeviceCreateType = {
  key?: string;
  assetId: string | null;
  assetCode: string | null;
  dataSourceId: number | null;
  infoSourceId: number | null;

  assetLevelThreeId: number | null;
  contact: string | null;
  transactionStatus: string | null;
  transactionTime: Date | null;
  name: string | null;
  brand: string | null;
  model: string | null;
  yearMfg: number | null;
  countryMfgId: number | null; // GET trả về "countryMfg" để hiển thị
  countryMfg?: string;
  manufacturer: string | null;
  power: number | null;
  transactionPrice: number | null;
  estimatePrice: number | null;

  usingOrigin: string | null;
  workingPrinciple: string | null;
  currentUseSituation: string | null;
  liquidity: string | null;
  remainQuality: number | null;
  disputeInfor: string | null;
  note: string | null;

  color: string | null;
  mfr: string | null;
  controlType: string | null;
  noteLegalSBA: string | null;

  size: number | null; // số
  specs: string | null;
  engine: number | null;
  electricEngine: number | null;
  mainEngine: number | null;
  engineSystem: string | null;
  commonMachine: number | null;
  additionalContent: string | null;
  numberOfDaysUsed: string | null;
  estimatedRate: number | null;

  approved: boolean | null; // chưa được duyệt là trạng thái mặc định
  description: string | null;
  assetImage: string | null;
  optimizePrice: number | null;
  positionId: string | null;
  usingPurposeId: number | null;
  appraisalTime: string | null;
  addressProvince: string | null; // GET trả về "addressProvinceName" để hiển thị, ko dùng addressProvinceId
  addressDistrict: string | null; // GET trả về "addressDistrictName" để hiển thị, ko dùng addressDistrictId
  addressWard: string | null; // GET trả về "addressWardName" để hiển thị, ko dùng addressWardId
  addressProvinceName?: string;
  addressDistrictName?: string;
  addressWardName?: string;
  addressStreet: string | null;
  addressDetail: string | null;
  address?: string | null;

  storedTypeId: number | null;
  climsId?: string | null;
  productionLineName: string | null;

  engineNo: string | null;
};

type ComparedAssetProjectCreateType = {
  key?: string;
  assetCode: string | null;
  dataSourceId: number | null;
  infoSourceId: number | null;
  contact: string | null;
  transactionStatus: string | null;
  transactionTime: Date | null;
  appraisalTime: string | null;
  addressProvince: string | null;
  addressDistrict: string | null;
  addressWard: string | null;
  addressStreet: string | null;
  addressDetail: string | null;
  address: string | null;
  positionId?: string | null;
  positionName?: string | null;
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
  usingPurposeId?: string | null;
  usingPurposeName?: string | null;
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
  approved: string | null;
  sentiment: string | null;
  sentimentApproved: string | null;
  storedType: string | null;
  storedTypeId: number | null;
  priceInPlan?: number | null;
  roadContiguousTypeId?: number | null;
  geographicDescription?: string | null;
  structure?: string | null;
};

type ComparedAssetEstimateCreateType = {
  key?: string;
  assetCode: string | null;
  dataSourceId: number | null;
  infoSourceId: number | null;
  contact: string | null;
  transactionStatus: string | null;
  transactionTime: Date | null;
  appraisalTime: string | null;
  addressProvince: string | null;
  addressDistrict: string | null;
  addressWard: string | null;
  addressStreet: string | null;
  addressDetail: string | null;
  address: string | null;
  positionId?: string | null;
  positionName?: string | null;
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
  usingPurposeId?: string | null;
  usingPurposeName?: string | null;
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
  approved: string | null;
  sentiment: string | null;
  sentimentApproved: string | null;
  storedType: string | null;
  storedTypeId: number | null;
  priceInPlan?: number | null;
  roadContiguousTypeId?: number | null;
  geographicDescription?: string | null;
  structure?: string | null;
};

export type {
  AssetListApprovalWaitingType,
  ComparedAssetLandEstateCreateType,
  ComparedAssetAppartmentCreateType,
  ComparedAssetRoadVehicleCreateType,
  ComparedAssetWaterVehicleType,
  ComparedAssetDeviceCreateType,
  ComparedAssetProjectCreateType,
  ComparedAssetEstimateCreateType,
};
