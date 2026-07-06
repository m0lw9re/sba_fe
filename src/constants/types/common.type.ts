import { UploadFile } from "antd";
import { Rule } from "antd/es/form";
import { TYPE_FIELD } from "constant/enums";

export type StatusValue = number;

export type CommonGetAllParams = {
  page?: number;
  limit?: number;
  status?: number;
  total?: number;
  direction?: number;
  totalElements?: number;
  count?: number;
  totalCount?: number;
  sortBy?:string;
  sortType?: string;
};
export type CommonSearchAllParams = {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: number;
  start?: string;
  end?: string;
  type?: number;
  identity?: string;
};
export type GetDetailCustomerParams = {
  id?: string;
};
export type UpdateCustomerStatus = {
  id: string;
  status?: number;
};
export type DeleteKeyParams = {
  id?: string;
};
export type Account = {
  email?: string;
  lastname?: string;
  firstname?: string;
  gender?: string;
  birth?: string;
  age?: number;
  role?: string;
  status?: 0 | 1;
};

export type Staff = {
  staffId?: any;
  staffNumber?: any;
  staffName?: any;
  dateOfBirth?: Date;
  personIdentification?: string;
  departmentPositionId?: string;
  departmentId?: string;
  departmentName?: string;
  professionalTitle?: string;
  username?: any;
  password?: string;
  roleId?: string | null;
  roleName?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateCreate?: Date;
  dateModify?: Date;
  status?: 1 | 0;
};
export type GetAccountDetailParams = {
  username?: string;
};

export type ChangePasswordParams = {
  username?: string;
};
export type ChangePassworData = {
  oldPassword?: string;
  newPassword?: string;
};

export type CreateAccountData = {
  username?: string;
  password?: string;
  staffId?: string;
  roleId?: string;
  status?: number;
};

export type CreateAccountRoleData = {
  roleCode?: string;
  roleName?: string;
};

export type UpdateAccountRoleData = {
  roleCode?: string;
  roleName?: string;
};

export type UpdateAccountData = {
  accountId?: number;
  ownerName?: string;
  workingUnit?: string;
  username?: string;
  role?: string;
  customerId?: string;
};

export type CreateCategoryRegionsData = {
  regionCode?: string;
  regionName?: string;
};

export type EditCategoryRegions = {
  addressProvince?: string;
  addressDistrict?: string;
  addressWard?: string;
  addressStreet?: string;
  addressDetail?: string;
  companyBranchName?: string;
  code?: string;
  companyBranchId?: number;
};

export type EditCategoryRisk = {
  riskAssetId?: number;
  riskContent?: string;
  riskLevel?: number;
  assetLevelTwoId?: number;
  description?: string;
};

export type ChangeStatusParams = {
  staffId?: string;
  status?: 1 | 0;
};

export interface FileItem extends UploadFile {
  url?: string;
  thumbUrl?: string;
}

export type DocumentRelate = {
  doc_name?: string;
  doc_num?: string;
  doc_date_created?: string;
  doc_benefit_relate?: string;
  doc_status?: string;
  documentImage?: Array<FileItem>;
};

export type CreatePropertyData = {
  //property category
  property_name?: string;
  property_address?: string;
  owner?: string;
  date_of_issue_legal?: string;
  construction?: string;
  documents_property_ownership?: string;
  num_legal_document?: number;
  propose_using_land?: string;
  current_propose_is_true?: string;
  dispute?: string;
  property_status?: string;
  propertyImage?: Array<UploadFile>;

  // land location
  lot_num?: number;
  cadastral_num?: number;
  land_area?: number;
  land_shape?: string;
  land_size?: string;
  actual_land_status?: string;
  area_diff_reality?: string;
  land_propose?: string;
  term_of_land_use?: string;
  regional_sewer_sys?: string;
  road_width?: string;
  main_road_location?: string;
  pri_school_locat?: string;
  sec_school_locat?: string;
  hig_school_locat?: string;
  headquaters_locat?: string;
  regional_elec_sys?: string;
  other_des_locat?: string;

  // contruction
  contruction_area?: string;
  using_area?: string;
  house_level?: string;
  house_direct?: string;
  house_texture?: string;
  house_quality?: string;
  contractor?: string;
  house_propose_using?: string;
  bedroom_num?: number;
  restroom_num?: number;
  contruction_elec_sys?: string;
  contruction_sewer_sys?: string;

  // document
  document_relate?: Array<DocumentRelate>;
};

export type AppraisaOrgId = {
  appraisalOrgId: string;
  creditAgencyCode: string;
  creditAgencyName: string;
  email: string;
  phoneNumber: string;
};

export type CreditAgency = {
  creditAgencyId: number;
  creditAgencyCode: string;
  creditAgencyName: string;
  email: string;
  phoneNumber: string;
};

export type getLegalInformationsParams = {
  assetId?: string;
};
export type ColumnProps = {
  title?: string;
  dataIndex: string;
  key: string | number;
  show?: boolean;
  align?: "center" | "left" | "right";
  render?: (value: any, record: any, index: any) => void;
  width?: number | string;
  fixed?: "left" | "right";
  rules?: Rule[];
  percentable?: boolean;
  disabled?: boolean;
  currencable?: boolean;
  type?: TYPE_FIELD;
  hidden?: boolean;
  sorter?: boolean;
};
