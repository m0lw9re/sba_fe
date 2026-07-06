type FilterCategoryPurposeType = {
  usingPurposeCode?: string | null;
  usingPurposeName?: string;
  usingPurposeId?: string;
  insideOutside?: number | null;
  idFeeScheduleIdNew?: number | null;
  status?: boolean | null;
};

type CreateCategoryPurposeType = {
  usingPurposeCode: string | null;
  usingPurposeName: string | null;
  assetLevelTwoId: null;
  insideOutside: number | null;
  idFeeScheduleIdNew: number | null;
  status: boolean | null;
};

type EditCategoryPurposeType = {
  usingPurposeCode?: string | null;
  usingPurposeName?: string;
  assetLevelTwoId?: null;
  insideOutside: number | null;
  idFeeScheduleIdNew: number | null;
  status: boolean | null;
};

export type {
  FilterCategoryPurposeType,
  CreateCategoryPurposeType,
  EditCategoryPurposeType,
};
