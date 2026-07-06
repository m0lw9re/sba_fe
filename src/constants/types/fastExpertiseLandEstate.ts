import {
  AssetImages,
  AssetOwners,
  Construction,
  LegalInformation,
  RiskDetail,
} from "constants/types/assetCommon.type";
import { Customer } from "./customer.type";
import { ConnstructionShort } from "./assetInfor_new_type";

export type FastExpertiseLandRealEstate = {
  assetId: string | "";
  assetCode: string | null;
  appraisalPurposeId: number | null | "";
  assetAppaisalWard: string | null;
  assetAppaisalWardName: string | null;
  assetAppaisalDistric: string | null;
  assetAppaisalDistricName: string | null;
  assetAppaisalProvince: string | null;
  assetAppaisalProvinceName: string | null;
  assetLandRealEstateRealUsingPurposeTypeId: number | null | "";
  assetLandRealEstateUsingPurposeTypeId: number | null | "";
  assetLandRealEstateUsingOriginTypeId: number | null | "";
  usingPeriodId: number | null | "";
  businessAdvantage: number | null | "";
  liquidity: number | null | "";
  currentUseSituationID: number | null | "";
  disputeInformation: string | null;
  isPlanned: number | null | "";
  planningInformation: string | null;
  note: string | null;
  appraisalDate: string | null;
  expiredDate: string | null;
  whoCreate: string | null;
  assetLevelOneId: number | null | "";
  assetLevelOneName: string | null;
  assetLevelTwoId: number | null | "";
  assetLevelTwoName: string | null;
  assetLevelThreeId: number | null | "";
  assetLevelThreeName: string | null;
  borrowerOwnerRelationshipId: number | null | "";
  borrowerOwnerRelationshipName: string | null;
  borrowerOwnerRelationshipNote: string | null;
  customerId: string | null;
  dateCreate: string | null;
  dateModify: string | null;
  assetLandInforDGNDtos: Array<AssetLandInforDGNDtos> | null;
  constructionDtos: Array<Construction> | null;
  assetOwners: Array<AssetOwners> | null;
  customerDto: Customer;
  riskDetailDtos: Array<RiskDetail> | null;
  assetImages: Array<AssetImages> | null;
  isDispute: number | null | "";
};

export type AssetLandInforDGNDtos = {
  assetLandInforId: number | null | "";
  assetId: string | null;
  landPlotNumber: string | null;
  mapSheetNumber: string | null;
  realAddressDetail: string | null;
  realAddressStreet: string | null;
  realAddressWard: string | null;
  realAddressDistrict: string | null;
  realAddressProvince: string | null;
  distanceToMainRoad: number | null | "";
  roadContiguousTypeId: number | null | "";
  roadSmallestWidthToMainRoad: number | null | "";
  distanceToNearestBranch: number | null | "";
  positionInPriceRangeId: number | null | "";
  zoneId: number | null | "";
  realMainDirectionId: number | null | "";
  realShape: string | null;
  realNumberOfFacade: number | null | "";
  realFacadeLength: number | null | "";
  realLandLength: number | null | "";
  realPrivateUseArea: number | null | "";
  realCommonUseArea: number | null | "";
  unitPrice: number | null | "";
  totalPrice: number | null | "";
  whoCreate: string | null;
  dateCreate: string | null;
  dateModify: string | null;
  legalInformations: Array<LegalInformation> | null;
  constructionShortDtos: Array<ConnstructionShort> | null;
};
