
export type CompareGetParams = {
  assetId?: string;
  assetLevelTwoId?: number;
};

export type CompareDeleteParams = {
  compareAssetId?: number;
};

export type ComparePostParams = {
  compareAssetId?: number;
  assetId: string;
  assetCompareId: string;
  whoCreate?: string;
  dateCreate?: string;
};

export type CompareAccess = {
  assetCode: number;
  assetName: string;
  realPrivateUseArea: number;
  realCommonUseArea: number;
  unitPrice: number;
  totalPrice: number;
  isLoadingGet: boolean;
};

export type ResultGetParams = {
  assetId: string;
  assetLevelTwoId?: number;
  assetLevelOneId?: number;
  assetLevelThreeId?: number;
};

export type GetAssetCompareParams = {
  assetLevelTwoId?: number;
  assetLevelOneId?: number;
  assetLevelThreeId?: number;
};
export type ResultExpertise = {
  // assetId: "d8eceff7-d0e9-46df-bb57-7bf4de9d38b6",
  legalCommonUseArea: number;
  unitPrice: number;
  totalPrice: number;
  isLoadingGet: boolean;
};

export type AccessStorage = {
  assetId: string;
  assetName: string;
  assetCode: string;
  assetRealAddressDetail: string;
  assetRealAddressStreet: string;
};
