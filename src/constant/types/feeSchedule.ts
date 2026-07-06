type feeScheduleFilter = {
  feeCode?: string | null;
  assetLevelTwo?: number;
  assetLevelThree?: number;
  assetValidationForm?: number | null;
  assetValidationUpTo?: number | null;
  minimumFee?: number | null;
  maximumFeeHstdNew?: number | null;
  maximumFeeReissued?: number | null;
  newDossierAppraisalFee?: number | null;
  maximumFeeHstdReissue?: number | null;
  feeLevel?: number | null;
  newHstdRegistrationFee?: number | null;
  registrationFeeHstdReissuance?: number | null;
  effectiveFrom?: string | null;
  validUntil?: string | null;
  applyPromotion?: boolean | null;
  status?: number | null;
};

type createFeeSchedule = {
  assetLevelTwo: number | null;
  assetLevelThree: number | null;
  assetValidationForm?: number | null;
  assetValidationUpTo?: number | null;
  minimumFee?: number | null;
  maximumFeeHstdNew?: number | null;
  maximumFeeHstdReissue?: number | null;
  newHstdRegistrationFee?: number | null;
  registrationFeeHstdReissuance?: number | null;
  effectiveFrom?: string | null;
  validUntil?: string | null;
  applyPromotion?: boolean | null;
  status?: number | null;
  feeLevel?: number | null;
  idFeeScheduleIdNew: number | null;
  feeCode: string | null;
  parentId: number | null;
  newHstdRegistrationFeePercent: number | null;
  registrationFeeHstdReissuancePercent: number | null;
};

type updateFeeSchedule = {
  id?: number;
  assetLevelTwo?: number;
  assetLevelThree?: number;
  assetValidationForm?: number;
  assetValidationUpTo?: number;
  minimumFee?: number;
  maximumFeeHstdNew?: number;
  maximumFeeHstdReissue?: number;
  newHstdRegistrationFee?: number;
  registrationFeeHstdReissuance?: number;
  effectiveFrom?: string;
  validUntil?: string;
  applyPromotion?: boolean;
  status?: boolean;
  feeLevel?: number;
  idFeeScheduleIdNew: number | null;
  feeCode: string | null;
  parentId: number | null;
  newHstdRegistrationFeePercent: number | null;
  registrationFeeHstdReissuancePercent: number | null;
};

type FeeScheduleType = {
  feeScheduleId: number;
  feeScheduleName: string;
};

export type {
  feeScheduleFilter,
  createFeeSchedule,
  updateFeeSchedule,
  FeeScheduleType,
};
