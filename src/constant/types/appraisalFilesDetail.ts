import { BranchType } from "./appraisalFile";
import { UploadFile } from "antd/es/upload/interface";

type AppraisalFileSbaTableType = {
  key: number;
  documentType: string;
  content: string;
  fileName: string;
  dateUpload: string;
  senderName: string;
  documentLevel: string;
};

type SurveyDatetimeTableType = {
  key: number;
  contactsTime: number;
  surveyDatetime: string;
  note: string;
};

type OwnerInforAssetLandTableType = {
  key: number;
  ownerName: string;
  indentification: string;
  yearOfBirth: number;
};

type LegalInforAssetLandTableType = {
  key: number;
  profileName: string | null;
  numberLegal: string;
  providedUnit: string;
  provideDate: string;
  detail: string;
};

type LegalInforTransportTableType = {
  key: number;
  profileName: string | null;
  numberLegal: string;
  providedUnit: string;
  provideDate: string;
  mentor: string;
  detail: string;
};

interface AppraisalInfoType {
  customerName: string;
  personIdentification: string | null;
  assetName: string | null;
  address: string | null;
  appraisalPurposeId: number | string | undefined;
}

type OtherInfoLand = {
  businessAdvantage: number | null;
  liquidity: string | null;
  currentUseSituation: string | null;
  disputeInfor: string | null;
  planningInfor: string | null;
  note: string | null;
};

type OtherInfoProjectType = {
  businessAdvantage: number | null;
  liquidity: string | null;
  currentUseSituation: string | null;
  disputeInfor: string | null;
  planningInfor: string | null;
  note: string | null;
  // Khi nào có chủ sở hữu field điền ở đây
};

type FeeNotificationType = {
  key?: string;
  feeNotificationId: string | null;
  appraisalFileId: string | null;
  proposalCode: string;
  reportCode: string;
  notificationCode: string;
  assetName: string;
  addressAsset: string;
  appraisalPurposeId: string;
  appraisalPurposeName?: string;
  natureId: string;
  natureName: string;
  branchCode: string;
  branch?: BranchType;
  branchName?: string;
  fullName: string;
  addressCustomer: string;
  mst: string;
  email: string;
  status: string;
  whoCreate: string;
  dateCreate: string;
  dateCreate2nd: string;
  dateModify: string;
  dateModify2nd: string;
  fileName?: string;
  ecmId?: string;
  feeContents: FeeContentType[];
  dateSendToLos?: string;
  dateSendTb?: string;
  addressCustomDetail?: string;
};
type FeeContentType = {
  key?: string | null;
  feeContentId: string | null;
  feeNotificationId: string | null;
  content: string | null;
  code: string | null;
  dateNotification: string | null;
  dateUpload: string | null;
  contentId: number | null;
  price: number | null;
  soTienXuatHoaDonThucTe?: number | null;
  soTienCanXuatHoaDon?: number | null;
  totalPrice: number | null;
  received?: number | null;
  internalRecordType?: number | null;
  status: number | null;
  statusEms: number | null;
  receiveDate?: string | null;
  reductFeeDate?: string | null;
  note: string | null;
  dateConfirm: string | null;
  noteByLos: string | null;
  fileName?: string | null;
  ecmId?: string | null;
  whoCreate: string | null;
  congNo?: number | null;
  revenue?: number | null;
  daThu?: number | null;
  isChecked: boolean | null;
  dateCreate: string | null;
  ngayThuTien?: string | null;
  ngayXuatHd?: string | null;
  ngayDeNghiXuatHd?: string | null;
  dateModify: string | null;
  fileList?: Array<UploadFile>;
  //dong y fee
  fileNameAgreeFee?: string | null;
  ecmIdAgreeFee?: string | null;
  mediaTypeAgreeFee?: string | null;
  noteAgreeFee?: string | null;
  dateAgreeFee?: string | null;
  fileAgreeFeeList?: Array<UploadFile>;

  reducedFee: number | null;
  reduceFeePercent: number | null;

  isFullyReceived?: number | null;
  dateUploadReduceFee?: number | null;
  isLocked?: boolean; // khoá từng dòng phí
  listDocuments?: Array<FeeListDocumentItemType>;
  soTienCanKhopConLai?: number | null;
};

type FeeContentAgreeFeeFileCreateType = {
  key?: string | null;
  //dong y fee
  noteAgreeFee?: string | null;
  dateAgreeFee: string;
};

type FeeContentReduceFeeCreateType = {
  key?: string | null;
  //dong y fee
  note?: string | null;
  dateUpload: string;
  dateUploadReduceFee?: string | null;
};

type FeeContentAgreeFeeFileType = {
  key?: string;
  appraisalFileId?: string | null;
  ecmIdAgreeFee: string;
  noteAgreeFee?: string | null;
  fileNameAgreeFee: string;
  mediaTypeAgreeFee: string;
  dateAgreeFee: string;
};

type FeeContentReduceFee = {
  key?: string;
  appraisalFileId?: string | null;
  ecmId: string;
  note?: string | null;
  fileName: string;
  mediaType: string;
  dateUpload: string;
  dateUploadReduceFee?: string | null;
};

type FeeListDocumentItemType = {
  commonDocumentId?: number | null;
  appraisalFileId?: number | null;
  targetId?: string;
  documentContent?: string;
  ecmId?: string;
  filename?: string;
  mediaType?: string;
  dateUpload?: string;
  whoUpload?: string | null;
  type?: number; //10, 11, 12 FEE_LIST_DOCUMENT
  status?: number | boolean | null;
  key?: string | null;
};

type CollectFeeLOS = {
  fromDate?: string;
  toDate?: string;
  clientId?: number | null;
  options?: number | null;
  profileCode?: string;
  issuedInvoiceOnly?: boolean;
  paidOnly?: boolean;
};
type ProfileExpenseLOS = {
  feeNotificationId: string | null;
  feeContentIds: Array<string>;
};
type AccDataDto = {
  fromDate?: string | null;
  reportCode?: string | null;
  proposalCode?: string | null;
  toDate?: string | null;
  statusEms?: number;
  refDate?: string | null;
  phaseDescription?: string | null;
  page: number;
  limit: number;
  customerName?: string;
  proposalUnit?: string;
};

type AppraisalFilesCompareFilter = {
  keywords?: string | null;
  regionCode?: string | null;
  page: number;
  limit: number;
  isFiltering?: boolean;
};
type GenericDataTable = {
  data: any[];
  limit: number;
  page: number;
  total: number;
};

type LockEditDataType = {
  appraisalFileId: string;
  isLocked: boolean;
};

export type {
  AppraisalFileSbaTableType,
  SurveyDatetimeTableType,
  OwnerInforAssetLandTableType,
  LegalInforAssetLandTableType,
  LegalInforTransportTableType,
  AppraisalInfoType,
  OtherInfoLand,
  OtherInfoProjectType,
  FeeContentType,
  FeeNotificationType,
  CollectFeeLOS,
  AccDataDto,
  GenericDataTable,
  AppraisalFilesCompareFilter,
  ProfileExpenseLOS,
  FeeContentAgreeFeeFileType,
  FeeContentAgreeFeeFileCreateType,
  FeeContentReduceFee,
  FeeContentReduceFeeCreateType,
  LockEditDataType,
  FeeListDocumentItemType,
};
