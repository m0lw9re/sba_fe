import {
  AddAssetOwnersData,
  AssetImages,
  AssetOwners,
  Construction,
  CreateConstructionData,
  CreateLegalInfoData,
  LegalInformation,
  ValuationInfo,
  AssetLandInfor,
  RiskDetail,
} from "constants/types/assetCommon.type";

export type AssetLandRealEstateInfo = {
  assetId: string;
  assetCode: string;
  appraisalPurposeId: number | null;
  assetLandRealEstateRealUsingPurposeTypeId: number;
  assetLandRealEstateUsingPurposeTypeId: number;
  assetLandRealEstateUsingOriginTypeId: number;
  usingPeriodId: number;
  businessAdvantage: number;
  liquidity: number;
  currentUseSituationID: number;
  disputeInformation: string;
  isPlanned: number;
  planningInformation: string;
  note: string;
  appraisalDate: string;
  expiredDate: string;
  positioningImage: string;
  whoCreate: string;
  dateCreate: string;
  dateModify: string;
  isFinish: boolean;
  constructionDtos: Construction[];
  assetLandInforDtos: AssetLandInfor[];
  assetImages: AssetImages[];
  assetOwners: AssetOwners[];
  riskDetailDtos: RiskDetail[];
  isDispute: number;
  imageAssetExtra?: Array<AssetImages>,
  positionImageTemp?: string,
};

export type ConnstructionShort = {
  constructionId: number;
  constructionTypeId: number;
  constructionTypeName: string;
  constructionLevelId: number;
  constructionLevelName: string;
  overlapArea: number;
};

export type AssetLandInforShort = {
  assetLandInforId: number;
  landPlotNumber: string;
  mapSheetNumber: string;
  overlapArea: number;
  legalInformations: Array<LegalInformation>;
};

export type CreateAssetRealEstateData = {
  assetId: string;
  assetCode: string;
  appraisalPurposeId: number;
  landPlotNumber: number;
  mapSheetNumber: number;
  assetRealAddressDetail: string;
  assetRealAddressStreet: string;
  assetRealAddressWard: number;
  assetRealAddressDistrict: number;
  assetRealAddressProvince: number;
  roadInPriceRangeId: number;
  distanceToMainRoad: number;
  roadContiguousTypeId: number;
  roadSmallestWidthToMainRoad: number;
  distanceToNearestBranch: number;
  positionInPriceRangeId: number;
  zoneId: number;
  legalMainDirectionId: number;
  legalShape: string;
  legalNumberOfFacade: number;
  legalFacadeLength: number;
  legalLandLength: number;
  legalPrivateUseArea: number;
  realMainDirectionId: number;
  realShape: string;
  realNumberOfFacade: number;
  realFacadeLength: number;
  realLandLength: number;
  realPrivateUseArea: number;
  realCommonUseArea: number;
  assetLandRealEstateRealUsingPurposeTypeId: number;
  assetLandRealEstateUsingPurposeTypeId: number;
  assetLandRealEstateUsingOriginTypeId: number;
  usingPeriodId: number;
  businessAdvantage: number | null;
  liquidity: number | null;
  currentUseSituationID: number | null;
  isPlanned: number;
  note: string;
  filesRiskId: number;
  filesRiskDescribe: string;
  assetStateRiskId: number;
  assetStateRiskDescribe: string;
  valueRiskId: number;
  valueRiskDescribe: string;
  appraisalDate: string;
  positioningImage: any;
  // whoCreate: string,
  // dateCreate: string,
  // dateModify: string,
  constructionDtos: Array<CreateConstructionData>;
  assetImages: Array<CreateAssetImage>;
  assetOwners: Array<AddAssetOwnersData>;
  legalInformationDtos: Array<CreateLegalInfoData>;
  assetStoragePapers: Array<ValuationInfo>;
  legalCommonUseArea: number;
  isDispute: number;
  expiredDate: string;
};
export type PositionInPriceRanges = {
  positionInPriceRangeId: number;
  positionInPriceRangeName: string;
};

export type RoadContiguousTypes = {
  roadContiguousTypeId: number;
  roadContiguousTypeName: string;
};

export type CurrentUseSituations = {
  currentUseSituationId: number;
  currentUseSituation: string;
  description: string;
};

export type UploadAssetImageData = {
  image?: File;
  description?: string;
  assetId?: string;
};

export type GetExpertiseAssetInfoParam = {
  assetId?: string;
};

export type RiskAsset = {
  riskAssetId: number;
  riskContent: string;
  assetLevelTwoId: number;
  riskTypeId: number;
  description: string;
  riskLevel: number | null;
};

export type CreateAssetRealEstateBasicData = {
  assetId?: string;
  assetCode?: string;
  appraisalPurposeId?: number;
  landPlotNumber?: number;
  mapSheetNumber?: number;
  assetRealAddressDetail?: string;
  assetRealAddressStreet?: string;
  assetRealAddressWard?: number;
  assetRealAddressDistrict?: number;
  assetRealAddressProvince?: number;
  roadInPriceRangeId?: number;
  distanceToMainRoad?: number;
  roadContiguousTypeId?: number;
  roadSmallestWidthToMainRoad?: number;
  distanceToNearestBranch?: number;
  positionInPriceRangeId?: number;
  zoneId?: number;
  legalMainDirectionId?: number;
  legalShape?: string;
  legalNumberOfFacade?: number;
  legalFacadeLength?: number;
  legalLandLength?: number;
  legalPrivateUseArea?: number;
  realMainDirectionId?: number;
  realShape?: string;
  realNumberOfFacade?: number;
  realFacadeLength?: number;
  realLandLength?: number;
  realPrivateUseArea?: number;
  realCommonUseArea?: number;
  assetLandRealEstateRealUsingPurposeTypeId?: number;
  assetLandRealEstateUsingPurposeTypeId?: number;
  assetLandRealEstateUsingOriginTypeId?: number;
  usingPeriodId?: number;
  businessAdvantage?: number | null;
  liquidity?: number | null;
  currentUseSituationID?: number | null;
  isPlanned?: number;
  note?: string;
  filesRiskId?: number;
  filesRiskDescribe?: string;
  assetStateRiskId?: number;
  assetStateRiskDescribe?: string;
  valueRiskId?: number;
  valueRiskDescribe?: string;
  appraisalDate?: string;
  positioningImage?: any;
  constructionDtos?: Array<CreateConstructionData>;
  assetImages?: Array<CreateAssetImage>;
  assetOwners?: Array<AddAssetOwnersData>;
  legalInformationDtos?: Array<CreateLegalInfoData>;
  assetStoragePapers?: Array<ValuationInfo>;
  legalCommonUseArea?: number;
  isDispute?: number;
  expiredDate?: string;
};

export type CreateAssetImage = {
  assetImageId?: number;
  assetId?: string;
  filePath?: any;
  description?: string;
  dateCreate?: string;
};

export type AssetLevelOne = {
  assetLevelOneId: number;
  assetLevelOneName: string;
};

export type AssetLevelTwo = {
  assetLevelTwoId: number;
  assetLevelTwoName: string;
  assetLevelOneId: number;
};

export type AssetLevelThree = {
  assetLevelThreeId: number;
  assetLevelThreeName: string;
  assetLevelTwoId: string;
};
