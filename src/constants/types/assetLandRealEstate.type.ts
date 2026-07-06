import {
  Construction,
  AssetLandInfor,
  RiskDetail,
  AssetImages,
  AssetOwners,
  LegalInformation
} from "./assetCommon.type";

import {
  RiskAsset,
  AssetLandInforShort,
} from "constants/types/assetInfor_new_type";

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
  imageAssetExtra?: Array<AssetImages>;
  positionImageTemp?: string;
};

export type GetAssetRoadVehicleInfoParam = {
  assetId: string;
};

export type AssetLandRealEstateInfoBasicData = {
  assetId?: string;
  assetCode?: string;
  appraisalPurposeId?: number;
  assetLandRealEstateRealUsingPurposeTypeId?: number;
  assetLandRealEstateUsingPurposeTypeId?: number;
  assetLandRealEstateUsingOriginTypeId?: number;
  usingPeriodId?: number;
  businessAdvantage?: number;
  liquidity?: number;
  currentUseSituationID?: number;
  disputeInformation?: string;
  isPlanned?: number;
  planningInformation?: string;
  note?: string;
  appraisalDate?: string;
  expiredDate?: string;
  positioningImage?: string;
  whoCreate?: string;
  dateCreate?: string;
  dateModify?: string;
  isFinish?: boolean;
  constructionDtos?: Construction[];
  assetLandInforDtos?: AssetLandInfor[];
  assetImages?: AssetImages[];
  assetOwners?: AssetOwners[];
  riskDetailDtos?: RiskDetail[];
  isDispute?: number;
  imageAssetExtra?: Array<AssetImages>;
};

export type riskDetalBasic = {
  riskDetailId?: number;
  assetId?: string;
  riskAssetId?: number;
  riskAssetDto?: Array<RiskAsset>;
  riskTypeId?: number;
  riskTypeName?: string;
  description?: string;
};

export type RiskAssetBaisc = {
  riskAssetId?: number;
  riskContent?: string;
  assetLevelTwoId?: number;
  riskTypeId?: number;
  description?: string;
  riskLevel?: number | null;
};

export type AssetOwnersBasicData = {
  assetOwnerId?: number;
  assetId?: string;
  assetOwnerName?: string;
  identification?: string;
  yearOfBirth?: number;
};

export type ConstructionBaisc = {
  constructionId?: number;
  assetId?: string;
  constructionTypeId?: number;
  constructionTypeName?: string;
  constructionLevelId?: number;
  constructionLevelName?: string;
  structureDescribe?: string;
  floors?: number;
  grossFloorArea?: number;
  constructYear?: number;
  remainingQuality?: number;
  yearsOfUsed?: number;
  whoCreate?: string;
  whoCreateName?: string;
  dateCreate?: string;
  dateModify?: string;
  assetLandInforShortDtos?: Array<AssetLandInforShort>;
};

export type AssetLandInforShortBasic = {
  assetLandInforId?: number;
  landPlotNumber?: string;
  mapSheetNumber?: string;
  overlapArea?: number;
  legalInformations?: Array<LegalInformation>;
};

export type AsssetsContructionBasic = {
  constructionId?: number;
  assetId?: string;
  constructionTypeId?: number;
  structureDescribe?: string;
  floors?: number;
  timeBuilding?: number;
  grossFloorArea?: number;
  remainingQuality?: number;
  yearsOfUsed?: number;
};

export type LegalInformationBasic = {
  legalInformationId?: number;
  legalInformationTypeId?: number;
  assetId?: string;
  assetLandInforId?: number;
  legalInformationName?: string;
  legalInformationNumber?: string;
  issueUnit?: string;
  issueDate?: string;
  details?: string;
  whoCreate?: string;
  dateCreate?: string;
  dateModify?: string;
};

export const initialValues: AssetLandRealEstateInfo = {
  assetId: "",
  assetCode: "",
  appraisalPurposeId: 0,
  assetLandRealEstateRealUsingPurposeTypeId: 0,
  assetLandRealEstateUsingPurposeTypeId: 0,
  assetLandRealEstateUsingOriginTypeId: 0,
  usingPeriodId: 0,
  businessAdvantage: 0,
  liquidity: 0,
  currentUseSituationID: 0,
  disputeInformation: "",
  isPlanned: 0,
  planningInformation: "",
  note: "",
  appraisalDate: "",
  expiredDate: "",
  positioningImage: "",
  whoCreate: "",
  dateCreate: "",
  dateModify: "",
  isFinish: false,
  constructionDtos: [],
  assetLandInforDtos: [],
  assetImages: [],
  assetOwners: [],
  riskDetailDtos: [],
  isDispute: 0,
};