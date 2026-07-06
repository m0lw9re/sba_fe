export type CategoryConfigApproveType = {
  assetValueId: number;
  valueFrom: number;
  valueTo: number;
  valueFromTxt: string;
  valueToTxt: string;
  approvalConfigDtos: ApprovalConfigDtos[];
};

export type ApprovalConfigDtos = {
  approvalConfigId: number;
  assetValueId: number;
  companyBranchId: number;
  companyBranch: {
    companyBranchId: number;
    companyBranchName: string;
    addressDetail: string;
    addressStreet: string;
    addressWard: string;
    addressDistrict: string;
    addressProvince: string;
    code: string;
  };
  level1: string[] | null;
  level2: string[] | null;
  level3: string[] | null;
  level4: string[] | null;
  level5: string[] | null;
  level6: string[] | null;
};
