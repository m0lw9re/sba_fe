import { DistrictType, ProvinceType, WardType } from "./address.type";
import {
  AppraisalTypeType,
  AssetLevelOneType,
  AssetLevelThreeType,
  AssetLevelTwoType,
  DescribeProjectType,
  LegalStatusType,
} from "./asset";
import { OptionType } from "./common";
import { ConstructionType } from "./contruction";
import {
  CustomerLegalDocumentType,
  CustomerType,
  CustomerTypeCreate,
} from "./customer";
import { SurverScheduleType } from "./surveySchedule";
import type { UploadFile } from "antd/es/upload/interface";
import { TreeAssetType } from "constant/types";

type AppraisalLegalDocumentType = {
  appraisalLegalDocumentId: number | null;
  customerLegalDocumentTypeId: number | null;
  appraisalFilesId: string | undefined;
  type: number | null;
  filename: string;
  whoUpload: string;
  whoUploadName: string;
  dateUpload: string;
  customerLegalDocumentType: CustomerLegalDocumentType | null;
};

type AppraisalPurposeType = {
  key?: number;
  appraisalPurposeId: number;
  appraisalPurposeName: string;
  short_: string | null;
  description?: string | null;
  hibernateLazyInitializer?: any;
};

type AppraisalFileAssetCommonCreateType = {
  key?: string;
  assetLevelThreeId: number | null;
  assetLevelThree: AssetLevelThreeType | null;
  appraisalTypeId: number | null;
  appraisalType: AppraisalTypeType | null;
  legalStatusId: number | null;
  legalStatus: LegalStatusType | null;
  legalNumber: string;
  addressWard: string | null;
  wards: WardType | null;
  addressDistrict: string | null;
  districts: DistrictType | null;
  addressDetail: string | null;
  addressStreet: string | null;
  addressProvince: string | null;
  provinces: ProvinceType | null;
  description: string | null;
  orderBy?: number | null;
};

type AppraisalFilesType = {
  appraisalFilesId: string;
  proposalCode?: string;
  proposalDate?: string;
  assetId: string;
  assetName: string;
  reportCode: string;
  assetCode: string;
  assetLevelOneId: number | null;
  assetLevelTwoId: number | null;
  assetLevelThreeId: number | null;
  numberOfAppraisal: number | null;
  legalStatusId: number | null;
  numberOfLegalDocument: string;
  assetLegalAddressDetail: string;
  assetLegalAddressStreet: string;
  assetLegalAddressWard: string | null;
  assetLegalAddressDistrict: string | null;
  assetLegalAddressProvince: string | null;
  branchId: number | null;
  branchName: string;
  transactionOfficeId: number | null;
  transactionOfficeName: string;
  branchStaff: string;
  branchStaffPhone: string;
  branchStaffEmailGetResult: string;
  branchStaffEmailGetInvoice: string;
  customer?: CustomerType;
  appraisalStaffId: number | null;
  analystStaffId: number | null;
  approvedStaffId: number | null;
  filesState: number | null;
  filesStatus: number | null;
  borrowerOwnerRelationShipId: number | null;
  borrowerOwnerRelationShip: string;
  whoCreate: string;
  dateCreate: string | null;
  dateModify: string | null;
  appraisalLegalDocumentDtos: Array<AppraisalLegalDocumentType>;
  customerId: string | null;
  surveySchedules: Array<SurverScheduleType>;
  surveyGuide: string;
  surveyGuidePhoneNumber: string;
  surveyTime: Date;
  files: Array<UploadFile>;
};

type Assignments = {
  appraisalFileId: string | null;
  assignmentId: number;
  companyBranch: {
    addressDetail: string | null;
    addressDistrict: string | null;
    addressProvince: string | null;
    addressStreet: string | null;
    addressWard: string | null;
    code: string | null;
    companyBranchId: number;
    companyBranchName: string | null;
  };
  companyBranchId: number;
  jobAssigner: string | null;
  jobType: any;
  jobTypeId: number;
  note: string | null;
  priorityLevel: string | null;
  staff: string | null;
  status: number;
  timeAssigned: string | null;
};

//new
type AppraisalFileType = {
  code?: number;
  key?: string;
  appraisalFileId: string;
  reportCode: string;
  customerId: string;
  customer: CustomerType; // thong tin khach hang
  branchCode: string | null; // form tt chi nhanh
  branch: AppraisalFileBranchType;
  transOfficeCode: string | null; // form tt chi nhanh
  transOffice: AppraisalFileTransOfficeType;
  rmName: string | null; // form tt chi nhanh
  rmPhone: string | null; // form tt chi nhanh
  resultEmail: string | null; // form tt chi nhanh => email tiep nhan
  invoiceEmail: string | null; // form tt chi nhanh => email trương don vi
  surveyGuide: string | null; // form tt khao sat =>  ho ten nguoi huong dan khao sat
  surveyGuidePhone: string | null; // form tt khao sat
  surveyTime: string | null; // form tt khao sat
  proposalDate: string | null; // form tt khao sat => ngay gui yeu cau
  approvedDate: string | null; // form tt khao sat
  surveyGuidePosition: string | null; // form tt khao sat => chuc vu/quan he voi chu tai san
  fileStatus: number; //trang thai ho so
  feeStatus?: number; //trang thai ho so
  assetName: string | null;
  appraisalPurposeId: number;
  appraisalPurpose: AppraisalPurposeType;
  assetLevelOneId: number;
  assignments: Assignments[];
  assetLevelOne: {
    assetLevelOneId: number;
    assetLevelOneName: string;
  };
  assetLevelTwoId: number;
  assetLevelTwo: {
    assetLevelTwoId: number;
    assetLevelTwoName: string;
    assetLevelOneId: number;
  };

  addressDetail: string | null;
  addressStreet: string | null;
  addressWard: string | null;
  addressDistrict: string | null;
  addressProvince: string;
  flowId: number;
  surveyer: string | null;
  appraiser: string | null;
  appraisalUnit: number | null;
  assetCommons: Array<AppraisalFileAssetCommonType>; //thong tin tai sản tab kiem tra ho so
  //type = 1 => ho so sacombank
  // type = 2 => ho so SBA
  // type = 3 => ho so SBA yeu cau bo sung
  // ID: null => create, để nguyên => update, số âm => delete;
  legalDocuments: Array<AppraisalFileLegalDocumentType>;
  parentLegalDocuments: Array<AppraisalFileLegalDocumentType>; // danh sach file của hồ sơ cha đối với các hồ sơ tái định giá
  surveySchedules: Array<AppraisalFileSurveyScheduleType>; // thoi gian khao sat thong nhat

  //table
  proposalCode: string;
  assetLevelThrees: string;
  address: string | null;
  flow?: {
    flowId: number;
    flowName: string;
  };

  latitude: number;
  longitude: number;
  surveyReportFileName: string | number;
  assetImages: Array<AppraisalFileAssetImageType>;
  appraisalReportFileName: string | null;
  typeCreated?: number | null; //0 là tạo = tay; 1 là tạo từ los
  isReceivedLos?: boolean | null; //1 đã tiếp nhận từ LOS
  isSendToLos?: boolean | null; //đã gửi cho los LOS - Không được sử dụng nữa - thay thế bằng sendToEmail
  receivedLos?: boolean | null; //1 đã tiếp nhận từ LOS
  sendToEmail?: number | null; // sử dụng thay thế cho isSendToLos

  // thông tin khách hàng đối với hồ sơ từ LOS
  customerNameByLos: string | null;
  addressCustomerByLos: string | null;
  typeCustomerByLos: string | null;
  cccdCustomerByLos: string | null;
  checkClimsLos: boolean | null;
  addressCustomDetail: string | null;

  wasNotification: boolean | null; // true: đã thông báo kết quả, false: đã gửi kết quả thẩm định, null: hồ sơ thường
  parentId: string | null; //Nếu có giá trị thì là hồ sơ tái định giá. và ngược lại
  signatureDate: string | null; //ngày ký số

  rePricingNumber: number | null; // số lần tái định giá
  // CR 215 216
  replaceByAppraisalFileId: string | null; // Id hồ sơ thay thế
  cancelNote: string | null; // note hồ sơ thay thế
  replaceDocuments: DocumentReplaceItemType[]; // danh sach file ho so thay the
  refusedStatus: number | null; // từ chối hồ sơ để làm gì
  isLocked: boolean | null;
  currentUserLocked: string | null;
  replaceByAppraisalFileCode?: string | null; // mã hồ sơ thay thế - dùng cho hồ sơ mới
  replaceToAppraisalFileCode?: string | null; // mã hồ sơ thay thế - dùng cho hồ sơ huỷ
  appraisalDate?: string | null;
  reportSignDate?: string | null;
  startProcessReportDate?: string | null; //Trường check ấn nút lập tờ trình
};

type BranchType = {
  branchCode: string | null;
  branchName: string | null;
  address: string | null;
  email: string | null;
  phoneNumber: string | null;
  hibernateLazyInitializer: {};
};

type TransOfficeType = {
  transOfficeCode: string | null;
  transOfficeName: string | null;
  address: string | null;
  email: string | null;
  phoneNumber: string | null;
  branchCode: string | null;
  hibernateLazyInitializer: any;
};

type AppraisalFileCreateType = {
  customer: CustomerTypeCreate | null;
  branchCode: string | null;
  branch: BranchType | null;
  transOfficeCode: string | null;
  transOffice: TransOfficeType | null;
  rmName: string | null;
  rmPhone: string | null;
  resultEmail: string | null;
  invoiceEmail: string | null;
  surveyGuide: string | null;
  surveyGuidePhone: string | null;
  surveyTime: string | null;
  proposalDate: string | null;
  approvedDate: string | null;
  fileStatus: number | null;
  assetName: string | null;
  appraisalPurposeId: number | null;
  appraisalPurpose: AppraisalPurposeType | null;
  assetLevelOneId: number | null;
  assetLevelOne: AssetLevelOneType | null;
  assetLevelTwoId: number | null;
  assetLevelTwo: AssetLevelTwoType | null;
  assetLevelThrees: string | null;
  address: string | null;
  addressDetail: string | null;
  addressStreet: string | null;
  addressWard: string | null;
  addressDistrict: string | null;
  addressProvince: string | null;
  latitude: number | null;
  longitude: number | null;
  flowId: number | null;
  surveyer: string | null;
  appraiser: string | null;
  appraisalUnit: number | null;
  assetCommons: Array<AppraisalFileAssetCommonCreateType>;
  assetImages: Array<any>;
  surveySchedules: Array<AppraisalFileSurveyScheduleCreateType>;
  legalDocuments: Array<AppraisalFileLegalDocumentCreateType>;
  flow: {
    flowId: number | null;
    flowName: string | null;
  } | null;
};

type AppraisalFileAssetImageType = {
  assetImageId: number | null;
  appraisalFileId: string | null;
  ecmId: string | null;
  filename: string | null;
  mediaType: string | null;
  description: string | null;
  whoUpload: string | null;
  dateUpload: string | null;
  type: number | null;
};

type AppraisalFileSurveyScheduleType = {
  key?: string;
  surveyScheduleId: number | null;
  appraisalFilesId: string;
  surveyTime: string | null;
  note: string;
  whoCreate: string;
  timeStart: string | null;
  timeEnd: string | null;
  isMetCustomer?: boolean;
  isNew?: boolean;
  surveyGuideType?: number | null;
};

type AppraisalFileSurveyScheduleCreateType = {
  key?: string;
  timeStart: string | null;
  timeEnd: string | null;
  note: string;
  whoCreate: string;
  surveyGuideType?: number | null;
};

type AppraisalFileAssetCommonType = {
  key?: string;
  assetCommonId: number | null;
  appraisalFileId: string | null;
  assetCode: string;
  climsCode: string | null;
  assetLevelThreeId: number | null;
  assetLevelThree: AssetLevelThreeType | null;
  appraisalTypeId: number | null;
  assetLevelThreeName?: string | null;
  appraisalType: AppraisalTypeType | null;

  legalStatusId: number | null;
  legalStatus: LegalStatusType | null;
  legalNumber: string;
  addressDetail: string | null;
  addressStreet: string | null;
  addressWard: string | null;
  wards: WardType | null;
  addressDistrict: string | null;
  districts: DistrictType | null;
  addressProvince: string | null;
  provinces: ProvinceType | null;
  addressByLos?: string;
  description: string | null;
  orderBy?: number | null;
  parentAssetCode?: string | null;
};

type AppraisalFileTransOfficeType = {
  transOfficeId: number;
  transOfficeName: string;
  transOfficeCode: string;
  address: string;
  email: string;
  phoneNumber: string;
  branchId: number;
  branchCode: string;
  hibernateLazyInitializer?: any;
};

type AppraisalFilesTypeUpdate = {
  key: number;
  code: string;
  assetType: string;
  numberOfLegalDocument: string;
  assetAddress: string;
  customerName: string;
  stream: string;
  surveyName: string;
  alanystName: string;
  senderName: string;
  status: string;
};

type FilterAppraisalFileTest = {
  isFiltering?: boolean;
  startDate: string | null;
  endDate: string | null;
  approveStartDate: string | null;
  approveEndDate: string | null;
  customerName?: string;
  assetCode?: string;
  reportCode?: string;
  assetLevelOneId?: number;
  assetLevelTwoId?: number;
  assetLevelThreeId?: number;
  flowId?: string;
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
  proposalUnit?: string;
  appraisalUnit?: string;
  fileStatusId?: string;
  proposalCode?: string;
  appraisalPurposeId?: string;
  unit?: string;
  rmName?: string;
  climsCode?: string;
  isReceivedLos?: boolean | string;
  feeStatus?: string;
  surveyGuide?: string;
  sendReportResultStartDate?: string | null;
  sendReportResultEndDate?: string | null;
  signatureStartDate?: string | null;
  signatureEndDate?: string | null;
  sendEndResultStartDate?: string | null;
  sendEndResultEndDate?: string | null;
};

type FilterAppraisalFileRePricing = {
  isFiltering?: boolean;
  startDate: string | null;
  endDate: string | null;
  approveStartDate: string | null;
  approveEndDate: string | null;
  customerName?: string;
  assetCode?: string;
  reportCode?: string;
  assetLevelOneId?: number;
  assetLevelTwoId?: number;
  assetLevelThreeId?: number;
  flowId?: string;
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
  proposalUnit?: string;
  appraisalUnit?: string;
  fileStatusId?: string;
  proposalCode?: string;
  appraisalPurposeId?: string;
  unit?: string;
  rmName?: string;
  climsCode?: string;
  isReceivedLos?: boolean | string;
  feeStatus?: string;
  surveyer?: string;
};

type FilterAppraisalFileType = {
  isFiltering?: boolean;
  startDate?: number;
  endDate?: number;
  approveStartDate?: number;
  approveEndDate?: number;
  customerName?: string;
  assetCode?: string;
  reportCode?: string;
  assetLevelOneId?: number;
  assetLevelTwoId?: number;
  assetLevelThreeId?: number;
  flowId?: string;
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
  proposalUnit?: string;
  appraisalUnit?: string;
  fileStatusId?: string;
  proposalCode?: string;
  appraisalPurposeId?: string;
  unit?: string;
  rmName?: string;
  climsCode?: string;
  isReceivedLos?: boolean | string;
  isSendToLos?: boolean | string; // field này sẽ không dùng và được thay thế bằng sendToEmail
  sendReportResultStartDate?: number;
  sendReportResultEndDate?: number;
  sendToEmail?: number | null;
  sendEndResultStartDate?: number;
  sendEndResultEndDate?: number;
};

export type ApprovalHistoryValues = {
  key?: string;
  approvalHistoryValueId: number | null;
  approvalHistoryId: number | null;
  assetChildId: number | null;
  assetGrandChildId: number | null;
  name: string;
  type: number | null;
  totalArea: number | null;
  unitPrice: number | null;
  totalValue: number | null;
  valuationResultLandEstateId: number | null;
  isValuationResultProject?: boolean;

  //MMTB
  realCommonMachine?: number | null;
};
export type ApprovalHistoryConstructionDtos = {
  key?: string;
  approvalHistoryConstructionId: number | null;
  approvalHistoryId: number | null;
  constructionId: number | null;
  assetLandInforId: number | null;
  constructionTypeName: string;
  constructionName: string;
  constructionArea: number | null;
  remainingQuality: number | null;
  mdht: number | null;
  unitPrice: number | null;
  totalValue: number | null;
  orderBy: number | null;
};
type ApprovalHistoryType = {
  key: number;
  time: string;
  preApprover: string;
  nextApprover: string;
  approvalStatus: string;
  approvedLevelNumber: string;
  opinionContent: string;
  approvalComment: string;
  approvalHistoryId: string;
  approvalNextEmployeeId: string;
  approvalSubmissionId: string;
  createdDate: string;
  level: number;
  status: number;
  totalLevel: number;
  approvalEmployeeId: string;
  assignmentId: string;
  approvalHistoryValueDtos: ApprovalHistoryValues[];
  approvalHistoryConstructionDtos: ApprovalHistoryConstructionDtos[];
  constructionFutureValue: number | null;
};
type ApprovalStaffType = {
  staffId: string;
  staffName: string;
  username: string;
  roleCode: string;
  daysOff: string;
  assets: string;
  provinces: string;
};

type FilterAppraisalFileUpdateType = {
  timeSendProposalTo?: number;
  timeSendProposalUntil?: number;
  timeApproveTo?: number;
  timeApproveUntil?: number;
  assetForm?: number;
  assetType?: number;
  assetClassify?: number;
  streamValuation?: number;
  provinceAddress?: string;
  districtAddress?: string;
  wardAddress?: string;
  streetAddress?: string;
  proposalUnit?: number;
  pricingUnit?: number;
  statusAppraisalFile?: number;
  code?: string;
  assetCode?: string;
  numberReport?: number;
  customerName?: string;
  stream?: number;
};

type AppraisalFileBranchType = {
  branchId: number;
  branchCode: string;
  branchName: string;
  address: string;
  email: string;
  phoneNumber: string;
  hibernateLazyInitializer?: any;
};

type AppraisalFileLegalDocumentType = {
  key?: string;
  legalDocumentId: number | null;
  appraisalFileId?: string | null;
  legalDocumentTypeId: number | null;
  legalDocumentType: LegalDocumentTypeType;
  documentContent: string;
  ecmId: string;
  filename: string;
  mediaType: string;
  dateUpload: string;
  whoUpload: string;
  type: number;
  downloading?: boolean;
};

type AppraisalFileLegalDocumentCreateType = {
  key?: string;
  legalDocumentId: number | null;
  legalDocumentTypeId: number | null;
  legalDocumentType: LegalDocumentTypeType;
  documentContent: string;
  ecmId: string;
  filename: string;
  mediaType: string;
  dateUpload: string;
  whoUpload: string;
  type: number;
};

type FileUploadFee = {
  key?: string;
  ecmId: string;
  filename: string;
  mediaType: string;
  whoUpload: string;
  type: number;
};

type LegalDocumentTypeType = {
  legalDocumentTypeId: number | null;
  name: string | null;
  customerTypeId: number | null;
  assetLevelTwoId: number | null;
  isRequired: number | null;
  isDeleted: number | null;
};

type RepairHistoryType = {
  key?: string;
  dowloading?: boolean;
  repairHistoryId: number | null;
  assetId: string | null;
  note: string | null;
  dateRepair: string | null;
  repairStatusId: number | null;
  repairDocument: string | null;
  ecmId: string | null;
  filename: string | null;
  mediaType: number | null;
  dateUpload: string | null;
  whoUpload: string | null;
};

type FilterLegalDocumentType = {
  // customerTypeId: number | null;
  assetLevelTwoId: number | null;
};

type RefuseToPriceType = {
  refuseToPriceTypeId: number;
  name: string;
  assetLevelTwoId: number;
  isRequired: number;
  isDeleted: number;
};

type FilterRefuseToPriceType = {
  assetLevelTwoId: number | null;
};

export type AssetObjectType<Type> = Type extends Array<infer Item>
  ? Item
  : Type;
type AppraisalFileAssetDetailType = {
  assetLevelTwoId: number;
  assetLevelThreeId: number;
  assetCode: string;
  parentAssetCode: string | null;
  assetObject: AssetObjectType<
    [
      // bất động sản
      AssetObjectRealEstateType,

      // động sản
      AssetObjectRoadVehicleType,
      AssetObjectWaterVehicleType,
      AssetObjectMachineDeviceType,

      // tài sản khác
      AssetObjectOtherPropertyType,
    ]
  >;
};

// tài sản cấp 1
type AssetObjectBaseType = {
  assetId: string;
  assetCode: string;
  riskDetails: Array<AssetRiskType>;
  legalInformations:
    | Array<AssetsLegalInformationType>
    | Array<AssetsLegalProjectInformationType>;
  note: string | null;
  whoCreate: string | null;
  dateCreate: string | null;
  dateModify: string | null;
  currentUseSituation: string | null;
  businessAdvantage: number | null;
  liquidity: string | null;
  disputeInfor: string | null;
  planningInfor: string | null;
  legalInformation_full: string | null;
  legalInformationFull: string | null;
  exportType: number | null;
  numberOfKilometersUsed: number;
  usingOrigin: string;
  remainQuality: number;
  odo: number;
  numberOfDaysUsed: number | null;
  noteSpecifications: string | null;
  noteLegalSBA: string | null;
  isShowAppendixDetail: boolean | null;
};
// BĐS
type AssetObjectRealEstateType = AssetObjectBaseType & {
  // hợp thửa property
  combinePrivateArea: null;
  combineCommonArea: null;
  combineAreaWidth: null;
  combineAreaInPlan: null;
  combineAreaUnPlan: null;
  combineNote: string | null;
  combineAppraisalLocation: string | null;
  combineLandShape: string | null;
  combineAreaNotConsiderValue: number | null;
  combineLandAddressDetail: string | null;
  combineAreaWidthDetail: string | null;

  facadeLength: number | null;
  totalLength: number | null;
  assetLandInfors?: Array<AssetLandInfoType>;
  assetApartmentInfors?: Array<AssetApartmentInfoType>;
  assetProjectInfor: AssetProjectInfoType;
  haveLandForRent: boolean;
  landForRentNote: string;
  haveApartment: boolean;
  apartmentNote: string;

  // dự án
  typeService: string | null;
  haveGround: boolean;
  groundNote: string | null;

  // Tiện ích căn hộ chung cư
  garage: boolean;
  pool: boolean;
  innerPark: boolean;
  commercialServiceArea: boolean;
  hospitalSchoolPreschool: boolean;
  receptionHall: boolean;
  elevator: boolean;
  utilities: string;
};

// tài sản khác
type AssetObjectOtherPropertyType = AssetObjectBaseType & {};
// ================= END =================

// tài sản cấp 2 - Bất động sản
type AssetLandInfoType = {
  id?: string;
  key?: string;
  assetLandInforId: number | null;
  assetId: string | null;
  landPlotNumber: string | null;
  mapSheetNumber: string | null;
  realAddressDetail: string | null;
  realAddressStreet: string | null;
  realAddressWard: string | null;
  realAddressDistrict: string | null;
  realAddressProvince: string | null;
  legalAddressDetail: string | null;
  legalAddressStreet: string | null;
  legalAddressWard: string | null;
  legalAddressDistrict: string | null;
  legalAddressProvince: string | null;
  roadInPriceRange: number | null;
  distanceToMainRoad: number | null;
  roadContiguousTypeId: number | null;
  distanceToNearestBranch: number | null;
  positionId: number | null;
  minWidthToMainRoad: number | null;
  maxWidthToMainRoad: number | null;
  note: string | null;
  zoneId: number | null;
  positionInPriceRangeId: number | null;
  legalMainDirection: string | null;
  legalShape: string | null;
  legalNumberOfFacade: number | null;
  legalFacadeLength: number | null;
  legalLandLength: number | null;
  legalAreaWidth: number | null;
  legalAreaInPlan: number | null;
  legalAreaUnPlan: number | null;
  legalPrivateArea: number | null;
  legalCommonArea: number | null;
  legalAreaNotConsiderValue: number | null;
  legalCurrentPrivateUsing: string | null;
  legalLandLengthDetail: string | null;
  realMainDirection: string | null;
  realShape: string | null;
  realNumberOfFacade: number | null;
  realFacadeLength: number | null;
  realLandLength: number | null;
  realAreaWidth: number | null;
  realAreaInPlan: number | null;
  realAreaUnPlan: number | null;
  realPrivateArea: number | null;
  realCommonArea: number | null;
  realAreaNotConsiderValue: number | null;
  realCurrentPrivateUsing: string | null;
  realLandLengthDetail: string | null;
  whoCreate: string | null;
  dateCreate: string | null;
  dateModify: string | null;
  constructions: Array<ConstructionType>;
  assetTrees: Array<TreeAssetType>;
  assetLandUsingPurposes: Array<AssetLanUsingPurposeType>;
  isSelected?: boolean;
  legalDistricts?: OptionType[];
  districts?: OptionType[];
  legalWards?: OptionType[];
  wards?: OptionType[];
  // Dự toán - thông tin tài sản - Công trình xây dựng hình thành trong tương lai
  constructionChecklists?: ConstructionCheckListType[];
  constructionFutureInfors?: ConstructionFutureInforsType[];

  isConsolidation: boolean; //có hợp thửa hay không
  isConsolidationPurpose: boolean; // có mục đích sử dụng hỗn hợp hya không
  isViewManifest: boolean; // có xem bảng kê hay không
};
type AssetApartmentInfoType = {
  id?: string;
  assetApartmentInforId: number | null;
  assetId: string | null;
  landPlotNumber: string | null;
  mapSheetNumber: string | null;
  realAddressDetail: string | null;
  realAddressStreet: string | null;
  realAddressWard: string | null;
  realAddressDistrict: string | null;
  realAddressProvince: string | null;
  legalAddressDetail: string | null;
  legalAddressStreet: string | null;
  legalAddressWard: string | null;
  legalAddressDistrict: string | null;
  legalAddressProvince: string | null;
  realBuilding: string | null;
  numberBasement: number | null;
  nameBuilding: string | null;
  mainRoadWith: number | null;
  positionId: number | null;
  legalApartmentCode: string | null;
  legalFloorNo: number | null;
  legalNumberBedroom: number | null;
  legalNumberToilets: number | null;
  legalFurniture: string | null;
  legalFacades: number | null;
  legalMainBalconyDirection: string | null;
  legalPrivateUseArea: number | null;
  legalClearanceArea: number | null;
  legalBuildupArea: number | null;
  legalExtendArea: number | null;
  legalCurrentPrivateUsing: string | null;
  realApartmentCode: string | null;
  realFloorNo: number | null;
  realNumberBedroom: number | null;
  realNumberToilets: number | null;
  realFurniture: string | null;
  realFacades: number | null;
  realMainBalconyDirection: string | null;
  realPrivateUseArea: number | null;
  realClearanceArea: number | null;
  realBuildupArea: number | null;
  realExtendArea: number | null;
  realCurrentPrivateUsing: string | null;
  whoCreate: string | number | null;
  dateCreate: string | number | null;
  dateModify: string | number | null;
  numberFloors: number | null;
  description: string | null;
  tunnelNumber: number | null;
  uses: string | null;
  totalApartmentArea: number | null;
  usingPurposeTypeId: string | null;
  termOfLandUse: string | null;
  utilities: string | null;
  legalDistricts?: OptionType[];
  districts?: OptionType[];
  legalWards?: OptionType[];
  wards?: OptionType[];
  isConsolidation: boolean; //có hợp khối hay không
  // remainQuantity: number | null;
};
// dự toán
type AssetProjectInFutureType = AssetLandInfoType &
  FutureInfoType &
  ProjectInFutureOthersType & {
    key?: string;
    contructionFutureText: string;
    numOfUnderFloors: string;
    basementFloor: string;
    depth: string;
    constructionFloor: string;
    constructionArea: string;
    turnPart: string;
  };

//dự án
type AssetProjectInfoType = {
  assetId: string | null;
  assetProjectInforId: string | null;
  constructions: Array<ConstructionType>;
  assetTrees: Array<TreeAssetType>;
  assetLandUsingPurposes: Array<AssetLanUsingPurposeType>;
  provinceCode: string | null;
  provinceName: string | null;
  districtCode: string | null;
  districtName: string | null;
  wardCode: string | null;
  wardName: string | null;
  appraisalLocation: string | null;
  areaWidth: number | null;
  currentAsset: string | null;
  description: string | null;
  districts?: OptionType[];
  legalWards?: OptionType[];
  wards?: OptionType[];
  detailDescribes: Array<DescribeProjectType>;
};

// ================= END =================

// tài sản cấp 2 - động sản
type AssetObjectRoadVehicleType = AssetObjectBaseType & {
  assetId: string;
  assetCode: string;
  legalVehicleBrand: string | null;
  legalVehicleModel: string | null;
  legalColor: string | null;
  legalYearMfg: number | null;
  legalCountryMfgId: number | null;
  legalGearBoxId: number | null;
  legalWheelFormulaId: number | null;
  legalFuelId: number | null;
  legalVehicleIdNumber: number | null;
  legalEngineNumber: number | null;
  legalPlateNumber: string | null;
  legalOverallDims: string | null;
  legalWheelBase: string | null;
  legalWeightBase: number | null;
  legalWeightAll: number | null;
  legalPersonCarry: number | null;
  legalEngineDisp: string | null;
  legalMaxOutputRpm: number | null;
  legalInsideContainer: string | null;
  legalDesignPayload: string | null;
  legalDesignTowedMass: number | null;
  legalTankCapacity: string | null;
  legalNumberOfTires: string | null;
  legalVolumeOfTowedGoods: number | null;
  legalVehicleTrunkSize: number | null;
  legalVolumeOfGoodsTransported: number | null;
  realVolumeOfGoodsTransported: number | null;
  realVehicleTrunkSize: number | null;
  realVolumeOfTowedGoods: number | null;
  realNumberOfTires: string | null;
  realVehicleBrand: string | null;
  realVehicleModel: string | null;
  realColor: string | null;
  realYearMfg: number | null;
  realCountryMfgId: number | null;
  realGearBoxId: number | null;
  realWheelFormulaId: number | null;
  realFuelId: number | null;
  realVehicleIdNumber: number | null;
  realEngineNumber: number | null;
  realPlateNumber: string | null;
  realOverallDims: string | null;
  realWheelBase: string | null;
  realWeightBase: number | null;
  realWeightAll: number | null;
  realPersonCarry: number | null;
  realEngineDisp: string | null;
  realMaxOutputRpm: number | null;
  realInsideContainer: string | null;
  realDesignPayload: string | null;
  realDesignTowedMass: number | null;
  realTankCapacity: string | null;
  odo: string | null;
  legalAdditionalContent: string | null;
  realAdditionalContent: string | null;
};
//
export type AssetObjectMachineDeviceType = AssetObjectBaseType & {
  assetMachineInfors?: AssetMachineDeviceInforType[];
  legalInformationFull: string | null; // filed thông tin pháp lý trong thông tin pháp lý
  productLineName: string | null; //Tên dây chuyền sản xuất
  dayUse: number; //field ngày sử dùng trong thông tin khác
};
type AssetMachineDeviceInforType = {
  id?: string;
  assetMachineInforId: number | null;
  assetId: string | null;
  legalName: string | null;
  legalBrand: string | null;
  legalModel: string | null;
  legalColor: string | null;
  legalYearMfg: number | null;
  legalCountryMfgId: number | null;
  legalMfr: string | null;
  legalPower: number | null;
  legalControlType: string | null;
  legalSize: string | null;
  legalSpecs: string | null;
  legalEngine: number | null;
  legalElectricEngine: string | null;
  legalMainEngine: string | null;
  legalEngineSystem: string | null;
  legalCommonMachine: number | null;
  legalOtherContent: string | null;
  legalEngineNo: string | null;
  realName: string | null;
  realBrand: string | null;
  realModel: string | null;
  realColor: string | null;
  realYearMfg: number | null;
  realCountryMfgId: number | null;
  realMfr: string | null;
  realPower: number | null;
  realControlType: string | null;
  realSize: string | null;
  realSpecs: string | null;
  realEngine: number | null;
  realElectricEngine: string | null;
  realMainEngine: string | null;
  realEngineSystem: string | null;
  realCommonMachine: number | null;
  realOtherContent: string | null;
  realEngineNo: string | null;

  repairHistories: Array<RepairHistoryType>;
  currentUseSituation: string | null;
  disputeInfor: string | null;
  liquidity: string | null;
  note: string | null;
  remainQuality: number | null;
  usingOrigin: string;
  dayUse: number | null;
};
type AssetObjectWaterVehicleType = AssetObjectBaseType & {
  legalName: string | null;
  legalRegisterNumber: string | null;
  legalModel: string | null;
  legalImoNumber: string | null;
  legalBrand: string | null;
  legalYearMfg: number | null;
  legalCountryMfg: number | null;
  legalShipbuildingBrand: string | null;
  legalRegisterCountry: number | null;
  legalShipUtilities: string | null;
  legalPersonCarry: number | null;
  legalDesignLength: number | null;
  legalDesignWidth: number | null;
  legalMaxLength: number | null;
  legalBoardHeight: number | null;
  legalSink: number | null;
  legalFreeBoard: number | null;
  legalSkinMaterial: string | null;
  legalMachineNum: number | null;
  legalMachinePower: number | null;
  legalDeadWeight: number | null;
  legalGrossTonnage: number | null;
  legalUseTonnage: number | null;
  legalSpeed: number | null;
  legalShipType: string | null;
  realName: string | null;
  realRegisterNumber: string | null;
  realModel: string | null;
  realImoNumber: string | null;
  realBrand: string | null;
  realYearMfg: number | null;
  realCountryMfg: number | null;
  realShipbuildingBrand: string | null;
  realRegisterCountry: number | null;
  realShipUtilities: string | null;
  realPersonCarry: number | null;
  realDesignLength: number | null;
  realDesignWidth: number | null;
  realMaxLength: number | null;
  realBoardHeight: number | null;
  realSink: number | null;
  realFreeBoard: number | null;
  realSkinMaterial: string | null;
  realMachineNum: number | null;
  realMachinePower: number | null;
  realDeadWeight: number | null;
  realGrossTonnage: number | null;
  realUseTonnage: number | null;
  realSpeed: number | null;
  legalYearReconstructed: number | null;
  realYearReconstructed: number | null;
  legalManufacturingLocation: string | null;
  realManufacturingLocation: string | null;
  legalAdditionalContent: string | null;
  realAdditionalContent: string | null;
  realShipType: string | null;
};
// ================= END =================

type AssetLanUsingPurposeType = {
  key?: string;
  usingPurposeId: number | null;
  usingOrigin: string | null;
  usingPeriod: number | null;
  usingPeriodId: number | null;
  legalAreaWidth: number | null;
  legalAreaInPlan: number | null;
  legalAreaUnPlan: number | null;
  legalPrivateArea: number | null;
  legalCommonArea: number | null;
  legalAreaNotConsiderValue: number | null;
  realAreaWidth: number | null;
  realAreaInPlan: number | null;
  realAreaUnPlan: number | null;
  realPrivateArea: number | null;
  realCommonArea: number | null;
  realAreaNotConsiderValue: number | null;
  isConsolidationPurposeParent: boolean;
  orderBy?: number | null;
  originDetail: string | null;
};
type AssetsLegalInformationType = {
  key?: string;
  id?: string;
  legalInformationTypeId: number | null;
  legalInformationNumber: number | null;
  issueUnit: string | null;
  issueDate: string | null;
  owner: string | null;
  details: string | null;
  isSelected?: boolean;
  orderBy?: number | null;
};

type AssetsLegalProjectInformationType = AssetsLegalInformationType & {
  investor?: string | null;
};

type AssetRiskType = {
  key?: string;
  riskDetailId: number | null;
  assetId: string | null;
  riskAssetId: number | null;
  riskTypeId: number | null;
  description: string;
  orderBy?: number | null;
  riskAsset?: {
    riskAssetId: number | null;
    riskContent: string;
    assetLevelTwoId: number | null;
    description: string;
    riskLevel: number | null;
  };
};
type AssetImageType = {
  assetImageId: number;
  appraisalFileId: string | null;
  ecmId: string;
  filename: string | null;
  mediaType: string | null;
  description: string;
  whoUpload: string;
  dateUpload: string;
  type: number;
  uid?: string | null;
};
type PdfFileType = {
  fileId: number;
  appraisalFileId: string | null;
  ecmId: string;
  filename: string | null;
  mediaType: string;
  description: string;
  whoUpload: string;
  dateUpload: string;
  type: number;
  uid?: string | null;
};

// tab giá trị tài sản
type AssetValuationType = {
  tableKQCTXD?: Array<TableKQCTXDType>;
  tablePP: Array<TablePPType>;
  tableKQDat?: Array<TableKQDatType>;
  tableKQ?: Array<TableKQType>;
  tableTong: TableTongType;
  assetLevelThreeIds?: Array<number>;
  appendices: Array<any> | null;
  assetImages: Array<AssetImageType>;
};

type TableKQCTXDType = {
  constructionId: number;
  assetLandInforId: number;
  constructionTypeId: number;
  constructionType: {
    constructionTypeId: number;
    constructionTypeName: string;
    description: string | null;
  };
  constructionNameId: number;
  constructionName: {
    constructionNameId: number;
    constructionName: string;
    constructionTypeId: number;
    lowPrice: number;
    highPrice: number;
  };
  constructionArea: number;
  constructionLegalTypeId: number;
  floors: number;
  baseFloors: number;
  furnitures: string;
  constructionYear: number;
  repairYear: number;
  remainingQuality: number;
  mdht: number;
  unitPrice: number;
  totalValue: number;
  constructionAreaApprovaled?: number;
  remainingQualityApprovaled?: number;
  totalValueApprovaled?: number;
  unitPriceApprovaled?: number;
  mdhtApprovaled?: number;
  describe: string;
  whoCreate: string;
  dateCreate: string;
  dateModify: string;
  orderBy: number | null;
};

type TablePPType = {
  key?: string;
  assetValuationMethodId: number;
  appraisalFileId: string;
  assetId: string;
  assetName: string;
  assetChildId: number;
  assetChildName: string;
  assetGrandChildId: number;
  assetGrandChildName: string;
  assetLevelTwoId: number;
  valuationMethodDetails: Array<{
    valuationMethodDetailId: number;
    assetValuationMethodId: number;
    valuationMethodId: number;
    unitPriceInPlan: number;
    unitPriceUnPlan: number;
    isCurrent: boolean;
    valuationMethod: {
      valuationMethodId: number;
      valuationMethodName: string;
    };
  }>;
};

type TableKQDatType = {
  valuationResultLandEstateId: number;
  appraisalFileId: string;
  assetId: string;
  name: string | null;
  type: string | null;
  totalArea: string | null;
  unitPrice: number | null;
  totalValue: number | null;
  totalAreaApprovaled?: string;
  totalValueApprovaled?: number | null;
  unitPriceApprovaled?: number | null;
  assetChildId?: number | null;
  assetGrandChildId?: number | null;
  // value của PTĐB
  valuationResultRoadVehicleId?: number;
};

type TableKQDatProjectType = {
  key?: string;
  appraisalFileId: string;
  assetId: string;
  name: string | null;
  totalArea: string | null;
  unitPrice: number | null;
  totalValue: number | null;
  assetChildId?: number | null;
  assetGrandChildId?: number | null;
  isValuationResultProject?: boolean | null;
};

type TableKQType = {
  valuationResultLandEstateId: number;
  appraisalFileId: string;
  assetId: string;
  name: string;
  type: string;
  totalArea: string;
  unitPrice: number | null;
  totalValue: number | null;
  totalAreaApprovaled?: string;
  unitPriceApprovaled?: number | null;
  totalValueApprovaled?: number | null;

  //MMTB
  realCommonMachine: number | null;
  productLineName: string | null;
};

type TableTongType = {
  totalValueLandEstateId: number;
  appraisalFileId: string;
  landValue: number | null;
  landValueApprovaled: number | null;
  constructionValue: number | null;
  constructionValueApprovaled: number | null;
  constructionReferValue: number | null;
  constructionReferValueApprovaled: number | null;
  constructionFutureValue: number | null;
  constructionFutureValueApprovaled: number | null;
  totalValue: number | null;
  totalValueApprovaled: number | null;
  totalValueRounded: number | null;
  totalValueRoundedApprovaled: number | null;
  note: string | null;
};

type AdditionalRequiredData = {
  legalDocumentTypeId: number | null;
  reasonOfRequired: string;
};

type RefuseToPriceData = {
  contentRefused: string;
  refusedStatus: number;
};

type DocumentReplaceItemType = {
  commonDocumentId: string | null;
  dateUpload: string;
  ecmId: string;
  filename: string;
  mediaType: string;
  whoUpload: string;
};

type CancelAppraisalFileData = {
  note?: string;
  appraisalFileId?: string | null;
  appraisalFileIdWillBeReplaced?: string | null;
  listDocument: DocumentReplaceItemType[];
};

type FileBehaviorType = {
  fileBehaviorId: number;
  fileBehaviorName: string;
};

// tài sản dự toán Type

type ConstructionCheckListType = {
  key?: string;
  contructionFutureInforId?: string | null;
  assetLandInforId?: string | null;
  name?: string | null;
  groundFloorArea?: string | null;
  totalFloorArea?: string | null;
  height?: string | null;
  numOfFloor?: string | null;
  length?: string | null;
  depth?: string | null;
  note?: string | null;
};
type ConstructionFutureInforsType = {
  key?: string;
  contructionFutureInforId: string | null;
  assetLandInforId: string | null;
  name: string | null;
  basicDesign: string | null;
  decision: string | null;
};
type FutureInfoType = {
  totalArea: number | null;
  buildingDensity: number | null;
  coeffcientsUsed: number | null;
  height: number | null;
  totalFloorArea: number | null;
  numOfFloors: number | null;
  totalApartments: number | null;
  underTankArea: number | null;
  wasteTankArea: number | null;
};
type ProjectInFutureOthersType = {
  turnPart: string;
  solePart: string;
  towerPart: string;
  constructionTitle: string;
  structuralSolution: string;
  architectualSolution: string;
  systemEngineering: string;
  systemTraffic: string;
  interior: string;
  estimateComment: string;
};

export type {
  AppraisalFilesType,
  FilterAppraisalFileType,
  AppraisalLegalDocumentType,
  AppraisalFilesTypeUpdate,
  FilterAppraisalFileUpdateType,
  AppraisalFileAssetCommonType,
  AppraisalFileBranchType,
  AppraisalFileLegalDocumentType,
  AppraisalFileSurveyScheduleType,
  AppraisalFileTransOfficeType,
  AppraisalFileType,
  LegalDocumentTypeType,
  FilterLegalDocumentType,
  AppraisalFileAssetDetailType,
  AssetLandInfoType,
  AssetRiskType,
  AssetsLegalInformationType,
  AssetObjectWaterVehicleType,
  AssetLanUsingPurposeType,
  RefuseToPriceType,
  FilterRefuseToPriceType,
  AssetImageType,
  PdfFileType,
  AppraisalFileAssetCommonCreateType,
  AssetValuationType,
  TableKQCTXDType,
  TableKQDatType,
  TablePPType,
  TableTongType,
  AppraisalPurposeType,
  AdditionalRequiredData,
  RefuseToPriceData,
  AppraisalFileLegalDocumentCreateType,
  AppraisalFileSurveyScheduleCreateType,
  AppraisalFileCreateType,
  BranchType,
  TransOfficeType,
  ApprovalHistoryType,
  ApprovalStaffType,
  FileBehaviorType,
  AppraisalFileAssetImageType,
  AssetApartmentInfoType,
  TableKQType,
  AssetObjectRoadVehicleType,
  AssetMachineDeviceInforType,
  ConstructionCheckListType,
  ConstructionFutureInforsType,
  AssetProjectInFutureType,
  FutureInfoType,
  RepairHistoryType,
  ProjectInFutureOthersType,
  FilterAppraisalFileTest,
  AssetObjectBaseType,
  AssetObjectRealEstateType,
  AssetObjectOtherPropertyType,
  AssetsLegalProjectInformationType,
  AssetProjectInfoType,
  TableKQDatProjectType,
  FilterAppraisalFileRePricing,
  FileUploadFee,
  CancelAppraisalFileData,
  Assignments as AssignmentsType,
};
