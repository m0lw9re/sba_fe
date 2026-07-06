export interface ListSelect {
  value: string | number;
  label: string;
}

export type GetAllFastExpertiseParams = {
  page?: number;
  limit?: number;
  keyword?: string;
  assetLevelTwoId?: number;
};

export type FastExpertise = {
  assetId: string;
  assetCode: string;
  whoCreate: string;
  assetLevelTwoName: string;
  assetLevelOneId: number;
  assetLevelTwoId: number;
  assetLevelThreeId: number;
  totalPrice: number;
  customerName: string;
  customerTypeName: string;
  dateCreate: string;
};

export type FilterFastAppraisalFileType = {
  page?: number;
  limit?: number;
  keyword?: string;
  assetLevelTwoId?: number;
};
