type CategoryTransactionType = {
  key?: string;
  addressProvince: string | null;
  addressDistrict: string | null;
  addressWard: string | null;
  addressStreet: string | null;
  addressDetail: string | null;
  transactionOfficeName: string | null;
  code: string | null;
};

type CreateCategoryTransactionType = {
  branchCode?: string | null;
  branchName?: string | null;
  address?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  regionCode?: string | null;
  regionName?: string | null;
};

type EditCategoryTransactionType = {
  branchCode: string;
  branchName: string;
  address?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  regionCode: string;
};

type CreatePGDType = {
  transOfficeCode: string;
  transOfficeName: string;
  address?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  branchCode: string;
};

type EditPGDType = {
  transOfficeCode: string | null;
  transOfficeName: string | null;
  address?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  branchCode: string | null;
};

type ModalViewType = {
  transOfficeCode?: string | null;
  transOfficeName?: string | null;
  address?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  branchCode?: string | null;
};

type FilterCategoryTransactionType = {
  keyword?: string;
  isFiltering?: boolean;
};

type RegionType = {
  regionCode: string;
  regionName: string;
};

type TransactionBranchType = {
  regionCode: string;
  branchCode: string;
  branchName: string;
  address: string;
  email: string;
  phoneNumber: string;
  transactionOffices: Array<TransactionOfficeType>;
};

type TransactionOfficeType = {
  transOfficeCode: string | null;
  transOfficeName: string | null;
  address: string | null;
  email: string | null;
  phoneNumber: string | null;
  branchCode: string;
};

export type {
  CategoryTransactionType,
  CreateCategoryTransactionType,
  FilterCategoryTransactionType,
  EditCategoryTransactionType,
  ModalViewType,
  CreatePGDType,
  EditPGDType,
  RegionType,
  TransactionBranchType,
  TransactionOfficeType,
};
