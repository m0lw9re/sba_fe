import {
  AppraisalTypeType,
  AssetLevelOneType,
  AssetLevelThreeType,
  AssetLevelTwoType,
  DistrictType,
  LegalStatusType,
  ProvinceType,
  WardType,
} from "constant/types";
import { Customer } from "./customer.type";
import { SurverSchedule } from "./surveySchedule";
import type { UploadFile } from "antd/es/upload/interface";

export type FilesStatesType = {
  filesStateId: number;
  filesStatee: string;
};

export type FilesStatusType = {
  filesStatusId: number;
  filesStatus: string;
};

export type LegalsStatusType = {
  legalStatusId: number;
  legalStatusName: string;
  description: string;
};

export type AppraisalFilesType = {
  appraisalFilesId: string;
  code: string;
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
  customer?: Customer;
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
  surveySchedules: Array<SurverSchedule>;
  surveyGuide: string;
  surveyGuidePhoneNumber: string;
  surveyTime: Date;
  files: Array<UploadFile>;
};

export type FilterAppraisalFileType = {
  startDate?: string;
  endDate?: number;
  start?: number;
  end?: number;
};

export type AppraisalLegalDocumentType = {
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

export type AppraisalLegalDocumentCreateType = {
  appraisalLegalDocumentId?: number;
  customerLegalDocumentTypeId?: number;
  appraisalLegalDocumentName?: string;
  appraisalFilesId?: string;
  type?: number;
  filename?: string;
  whoUpload?: string;
  whoUploadName?: string;
  dateUpload?: string;
  customerLegalDocumentType?: CustomerLegalDocumentType;
};

export type CustomerLegalDocumentType = {
  customerLegalDocumentTypeId: number;
  customerLegalDocumentType: string;
  requiredNumber: number;
  customerTypeId: number;
  assetLevelThreeId: number;
  description: string;
  isRequired: number;
  isDeleted: number;
};

export type BorrowerOwnerRelationshipType = {
  borrowerOwnerRelationshipId: number;
  borrowerOwnerRelationshipName: string;
  customerTypeId: number;
  description: string | null;
};

export type AppraisalPurposeType = {
  key?: number;
  appraisalPurposeId: number;
  appraisalPurposeName: string;
  short_: string | null;
  description: string | null;
};

export type AppraisalFileLegalDocumentType = {
  legalDocumentId: number;
  appraisalFileId: string;
  legalDocumentTypeId: number;
  legalDocumentType: {
    legalDocumentTypeId: number;
    name: string;
    customerTypeId: number;
    assetLevelThreeId: number;
    isRequired: number;
    isDeleted: number;
  };
  documentContent: string;
  ecmId: string;
  filename: string;
  mediaType: string;
  dateUpload: string;
  whoUpload: string;
  type: number;
};

export type AppraisalFileSurveyScheduleType = {
  id?: string;
  surveyScheduleId: number | null;
  appraisalFilesId: string;
  surveyTime: string | null;
  note: string;
  whoCreate: string;
  timeStart: string | null;
  timeEnd: string | null;
};

export type AppraisalFileAssetCommonType = {
  key?: string;
  assetCommonId: number;
  appraisalFileId: string;
  assetCode: string;
  assetLevelOneId: number;
  assetLevelOne: AssetLevelOneType;
  assetLevelTwoId: number;
  assetLevelTwo: AssetLevelTwoType;
  assetLevelThreeId: number;
  assetLevelThree: AssetLevelThreeType;
  assetLevelThreeName?: string;
  appraisalTypeId: number;
  appraisalType: AppraisalTypeType;
  legalStatusId: number;
  legalStatus: LegalStatusType;
  legalNumber: string;
  addressWard: string | null;
  wards: WardType;
  addressDistrict: string | null;
  districts: DistrictType;
  addressProvince: string | null;
  provinces: ProvinceType;
};

export type AppraisalFileBranchType = {
  branchId: number;
  branchCode: string;
  branchName: string;
  address: string;
  email: string;
  phoneNumber: string;
};

export type AppraisalFileTransOfficeType = {
  transOfficeId: number;
  transOfficeName: string;
  transOfficeCode: string;
  address: string;
  email: string;
  phoneNumber: string;
  branchId: number;
};
