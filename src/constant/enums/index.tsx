import { DATE_TIME_FORMAT } from "./dateFormat";
enum TYPE_FIELD {
  INPUT = "INPUT",
  SELECT = "SELECT",
  DATE_PICKER = "DATE_PICKER",
  TIME_PICKER = "TIME_PICKER",
  INPUT_NUMBER = "INPUT_NUMBER",
  INPUT_PASSWORD = "INPUT_PASSWORD",
  SELECT_SEARCH = "SELECT_SEARCH",
  TEXT_AREA = "TEXT_AREA",
  AUTO_COMPLETE = "AUTO_SEARCH",
  RANGE_PICKER = "RANGE_PICKER",
  MULTI_SELECT_SEARCH = "MULTI_SELECT_SEARCH",
  LOCAL = "LOCAL",
  LOCAL_COORDINATE = "LOCAL_COORDINATE",
  IMAGE = "IMAGE",
  PERCENT = "PERCENT",
  CHECKBOX = "CHECKBOX",
  RADIO = "RADIO",
  MULTI_ITEMS = "MULTI_ITEMS",
  CHECKBOX_GROUP = "CHECKBOX_GROUP",
  CALCULATE_INPUT = "CALCULATE_INPUT",
  DAY_PICKER = "DAY_PICKER",
  POPUP_INPUT = "POPUP_INPUT",
  MULTI_TEXT_ITEMS = "MULTI_TEXT_ITEMS",
  GET_LOCATION_BTN = "GET_LOCATION_BTN",
  WEEK_PICKER = "WEEK_PICKER",
  INPUT_NUMBER_ONLY = "INPUT_NUMBER_ONLY", // chỉ là số, không có thêm dấu phân tách: 2024 not 2.024
}

enum PAGE_SIZE_OPTIONS {
  DEFAULT_VALUE = 10,
  OPTION_5 = 5,
  OPTION_10 = 10,
  OPTION_15 = 15,
  OPTION_25 = 25,
  OPTION_50 = 50,
  OPTION_5_LABEL = "5 dòng",
  OPTION_10_LABEL = "10 dòng",
  OPTION_15_LABEL = "15 dòng",
  OPTION_25_LABEL = "25 dòng",
  OPTION_50_LABEL = "50 dòng",
}

enum LOCAL_STORAGE_KEY {
  PAGE_SIZE = "page_size",
  ACCESS_TOKEN = "access_token",
  USERNAME = "username",
  MENUS = "menus",
  USER_ID = "userId",
  PAGE_PARAMS = "PAGE_PARAMS",
  PRICE_SPECIFIC = "PRICE_SPECIFIC",
  PRICE_SPECIFIC_KEY = "PRICE_SPECIFIC_KEY",
  APPRAISAL = "APPRAISAL",
  APPRAISAL_GIVE = "APPRAISAL_GIVE",
  APPRAISAL_RECEIVE = "APPRAISAL_RECEIVE",
  APPRAISAL_KEY = "APPRAISAL_KEY",
  DEBT = "DEBT",
  DEBT_KEY = "DEBT_KEY",
  CHECK_BOX = "CHECK_BOX",
  CHECK_BOX_KEY = "CHECK_BOX_KEY",
  PRICESHARED_COLLECTED = "PRICESHARED_COLLECTED",
}

enum APPRAISAL_LEGAL_DOCUMENT_TYPE {
  // loại của hồ sơ tài liệu Sacombank
  SACOMBANK = 1,
  // loại của hồ sơ tài liệu SBA
  SBA = 2,
  // loại của hồ sơ tài liệu SBA yêu cầu bổ sung
  SBA_REQUIRED = 3,
}

enum UTILITIES_APARTMENT {
  GARAGE = "garage",
  POOL = "pool",
  INNER_PARK = "innerPark",
  COMMERCIALSERVICEAREA = "commercialServiceArea",
  HOSPITAL_SCHOOL_PRESCHOOL = "hospitalSchoolPreschool",
  RECEPTIONHALL = "receptionHall",
  ELEVATOR = "elevator",
  GARAGE_LABEL = "Hầm/Tầng để xe",
  POOL_LABEL = "Hồ bơi",
  INNER_PARK_LABEL = "Công viên nội khu",
  COMMERCIALSERVICEAREA_LABEL = "Khu thương mại/Dịch vụ",
  HOSPITAL_SCHOOL_PRESCHOOL_LABEL = "Bệnh viện/Trường học/Trường mầm non",
  RECEPTIONHALL_LABEL = "Sảnh lễ tân",
  ELEVATOR_LABEL = "Thang máy",
}
enum ASSET_LV1 {
  // real estate
  REAL_ESTATE = 1, // Bất động sản
  MOVABLE_ESTATE = 2, // Tài sản di động
  OTHER_ASSET = 3, // Tài sản khác
}
enum ASSET_LV2 {
  // real estate
  LAND = 1, // BĐS nhà đất
  APARTMENT = 2, // Căn hộ chung cư
  PROJECT = 8, // Dự án
  ESTIMATE = 9, // Dự toán

  // Movable estate
  VEHICLE = 3, // Phương tiện vận tải đường bộ
  WATER_VEHICLE = 4, // Phương tiện vận tải đường thủy
  MACHINE = 5, // Máy móc thiết bị
}

enum ASSET_LV3 {
  //MMTB
  MACHINE = 41,
  PRODUCTION_LINE = 42,

  //PTĐB
  CAR = 21, // Xe con
  BUS = 22, // Xe khách
  TRUCK = 23, // Xe tải
  SPECIALIZED = 26, // Xe chuyên dùng
  TRACTORTRUCK = 24, // Xe oto đầu kéo
  RERMOCTRUCK = 25, // Xe Rermoc
  MOTO = 27, // Xe 2 bánh

  // PTDT
  SHIP = 28, // tàu biển
}

enum APPENDIX_FILE_TYPE {
  LOS = 0, // file gửi cho los
  LOCAL = 1, // file nội bộ
  MANIFEST = 2, // file xem bảng kê
}

export {
  TYPE_FIELD,
  DATE_TIME_FORMAT,
  PAGE_SIZE_OPTIONS,
  LOCAL_STORAGE_KEY,
  APPRAISAL_LEGAL_DOCUMENT_TYPE,
  UTILITIES_APARTMENT,
  ASSET_LV1,
  ASSET_LV2,
  ASSET_LV3,
  APPENDIX_FILE_TYPE,
};
