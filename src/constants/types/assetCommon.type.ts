import { ConnstructionShort, RiskAsset, AssetLandInforShort } from "./assetInfor_new_type";
import { FileItem } from "./common.type";

export type AssetClassification = {
  assetClassificationId: number;
  assetClassificationName: string;
  description: string;
};

export type AssetForms = {
  assetFormId: number;
  assetFormName: string;
  description: string;
};

export type ConstructionDtos = {
  constructionId?: number;
  assetId?: string;
  constructionTypeId: number;
  constructionTypeName?: string;
  structureDescribe: string;
  floors: number;
  grossFloorArea: number;
  remainingQuality: number;
  yearsOfUsed: number;
  whoCreate: string;
  whoCreateName: string;
  dateCreate: string;
  dateModify: string;
};

export type AssetTypes = {
  assetTypeId: string;
  assetTypeName: string;
  description: string;
};

export type BorrowerOwnerRelationship = {
  borrowerOwnerRelationshipId: number;
  borrowerOwnerRelationshipName: string;
  customerTypeId: number;
  description: string;
};

export type RepairHistory = {
  repairHistoryId: number | null;
  assetId: string | null;
  note: string | null;
  dateRepair: string | null;
  repairStatus: string | null;
  repairDocument: string | null;
  filename: string | null;
};

export type RepairHistoryParams = {
  assetId: string | null;
  note: string | null;
  dateRepair: string | null;
  repairStatus: string | null;
  repairDocument: string | null;
};

export type AssetLandInfor = {
  assetLandInforId: number | null;
  assetId: string;
  landPlotNumber: string;
  mapSheetNumber: string;
  realAddressDetail: string;
  realAddressStreet: string;
  realAddressWard: string;
  realAddressDistrict: string;
  realAddressProvince: string;
  legalAddressDetail: string;
  legalAddressStreet: string;
  legalAddressWard: string;
  legalAddressDistrict: string;
  legalAddressProvince: string;
  distanceToMainRoad: number | null;
  roadContiguousTypeId: number | null;
  roadSmallestWidthToMainRoad: number | null;
  distanceToNearestBranch: number | null;
  positionInPriceRangeId: number | null;
  zoneId: number | null;
  legalMainDirectionId: number | null;
  legalShape: string;
  legalNumberOfFacade: number | null;
  legalFacadeLength: number | null;
  legalLandLength: number | null;
  legalPrivateUseArea: number | null;
  realMainDirectionId: number | null;
  realShape: string;
  realNumberOfFacade: number | null;
  realFacadeLength: number | null;
  realLandLength: number | null;
  realPrivateUseArea: number | null;
  realCommonUseArea: number | null;
  usingPeriodId: number | null;
  businessAdvantage: number | null;
  liquidity: number | null;
  currentUseSituationID: number | null;
  disputeInformation: string;
  isPlanned: number | null;
  planningInformation: string;
  note: string;
  unitPrice: number | null;
  totalPrice: number | null;
  whoCreate: string;
  dateCreate: string;
  dateModify: string;
  isFinish: boolean;
  legalInformations: LegalInformation[];
  constructionShortDtos: ConnstructionShort[] | null;
  legalCommonUseArea: number | null;
  isDispute: boolean;
};

export type Construction = {
  constructionId: number | null;
  assetId: string;
  legalNumber: string;
  constructionTypeId: number;
  constructionTypeName: string;
  constructionLevelId: number;
  constructionLevelName: string;
  structureDescribe: string;
  floors: number;
  grossFloorArea: number;
  constructYear: number;
  remainingQuality: number;
  yearsOfUsed: number;
  whoCreate: string;
  whoCreateName: string;
  dateCreate: string;
  dateModify: string;
  assetLandInforShortDtos: Array<AssetLandInforShort> | null;
};

export type ConstructionUpdate = {
assetLandInforId: number | null,
baseFloors: number | null,
constructionArea: number | null,
constructionId: number | null,
constructionType: ConstructionType
constructionYear: number | null,
constructionTypeId: number | null,
dateCreate: string | null,
dateModify: string | null,
describe:string | null,
floors:number | null,
legalInformationTypeId:number | null,
name: string | null,
remainingQuality:number | null,
repairYear:number | null,
whoCreate:number | null,
}

export type AssetImages = {
  assetImageId: number,
  assetId?: string,
  filepath?: FileItem | null,
  thumb?: string,
  description: string,
  dateCreate?: string
};

export type ConstructionType = {
  constructionTypeId: number;
  constructionTypeName: string;
  description: string;
};

export type LegalInformationType = {
  legalInformationTypeId: number;
  legalInformationTypeName: string;
  description: string;
};

export type AssetOwners = {
  assetOwnerId: number | null;
  assetId: string;
  assetOwnerName: string;
  identification: string;
  yearOfBirth: number;
};

export type Direction = {
  directionId: number;
  directionName: string;
  description: string;
};

export type BussinessAdvantages = {
  name: string;
  id: number;
};

export type Zone = {
  zoneId: number;
  zone: string;
  description: string;
};

export type AssetLandRealEstateUsingPurposeTypes = {
  assetLandRealEstateUsingPurposeTypeId: number;
  assetLandRealEstateUsingPurposeTypeName: string;
  description: string;
};

export type AssetLandRealEstateUsingOriginTypes = {
  assetLandRealEstateUsingOriginTypeId: number;
  assetLandRealEstateUsingOriginTypeName: string;
  description: string;
};

export type UsingPeriods = {
  usingPeriodId: number;
  usingPeriod: string;
  assetTypeId: number;
  description: string;
};

export type Liquidities = {
  name: string;
  id: number;
};

export type CreateConstructionData = {
  assetId?: string;
  constructionTypeId?: number;
  structureDescribe?: string;
  remainingQuality?: number;
  timeBuilding?: number;
  floors?: number;
  grossFloorArea?: number;
  yearsOfUsed?: number;
};

export type AddAssetOwnersData = {
  assetId?: string;
  assetOwnerName?: string;
  identification?: string;
  yearOfBirth?: number;
};

export type LegalInformation = {
  legalInformationId: number | null;
  legalInformationTypeId: number;
  assetId: string;
  assetLandInforId: number | null;
  legalInformationName: string;
  legalInformationNumber: string;
  issueUnit: string;
  issueDate: string;
  details: string;
  whoCreate: string;
  dateCreate: string;
  dateModify: string;
};

export type UpdateConstructionData = {
  assetId?: string;
  constructionId?: number;
  constructionTypeId: number;
  structureDescribe: string;
  remainingQuality: number;
  floors: number;
  grossFloorArea: number;
  yearsOfUsed: number;
};

export type CreateLegalInfoData = {
  legalInformationTypeId?: number;
  assetId?: string;
  legalInformationName?: string;
  legalInformationNumber?: string;
  issueUnit?: string;
  issueDate?: string;
  details?: string;
};

export type ValuationInfo = {
  assetId?: string;
  documentAssetStorage?: string;
  dateEffective?: string;
  dateEffectiveEnd?: string;
  assetValueStorage?: number;
  filePath?: any;
  dateCreateStorage?: string;
};

export type GetAllAssetRealEstateStorage = {
  assetId: string;
  assetName: string;
  assetCode: string;
  appraisalPurposeId: number;
  landPlotNumber: string;
  mapSheetNumber: string;
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
  legalMainDirectionId: number;
  legalShape: string;
  legalNumberOfFacade: number;
  legalFacadeLength: number;
  legalLandLength: number;
  legalPrivateUseArea: number;
  legalCommonUseArea: number;
  realMainDirectionId: number;
  realShape: string;
  realNumberOfFacade: number;
  realFacadeLength: number;
  realLandLength: number;
  realPrivateUseArea: number;
  realCommonUseArea: number;
  businessAdvantage: number;
  liquidity: number;
  currentUseSituationID: number;
  disputeInformation: string;
  isPlanned: number;
  planningInformation: string;
  note: string;
  filesRiskId: number;
  filesRiskDescribe: string;
  assetStateRiskId: number;
  assetStateRiskDescribe: string;
  valueRiskId: number;
  valueRiskDescribe: string;
  appraisalDate: string;
  unitPrice: number;
  totalPrice: number;
  positioningImage: string;
  whoCreateId: string;
  whoApprovedId: string;
  status: string;
  dateCreate: string;
  dateModify: string;
  expiredDate: string;
  isDispute: number;
};

export type RiskDetail = {
  riskDetailId: number | null;
  assetId: string;
  riskAssetId: number;
  riskAssetDto: RiskAsset;
  riskTypeId: number;
  riskTypeName: string;
  description: string;
};

export type AppartmentType = {
  apartmentTypeId: number;
  apartmentTypeName: string;
};

export type OwnerType = {
  ownerTypeId: number;
  ownerTypeName: string;
};

export type AssetApartmentUsingPurposeTypes = {
  assetApartmentUsingPurposeTypeId: number;
  assetApartmentUsingPurposeTypeName: string;
  description: string | null;
};

export type Equipments = {
  equipmentId: number;
  equipmentName: string;
};

export type ConstructionLevel = {
  constructionLevelId: number;
  constructionLevelName: string;
};

export type ListAssetLevelId = {
  lv1Id: number;
  lv2Id: number;
  lv3Id: number;
};

export type RoadVehicleBrand = {
  roadVehicleBrandId: number;
  roadVehicleBrandName: string;
};

export type Fuelds = {
  fuelId: number;
  fuelName: string;
};

export type RoadVehicleModel = {
  roadVehicleModelId: number;
  roadVehicleModelName: string;
  brandId: number;
};

export type CountryProduce = {
  id: number;
  apartmentTypeId: number;
  iso: string;
  name: string;
  vnName: string;
  niceName: string;
  iso3: string;
  numCode: number;
  phoneCode: number;
};

export type GearBox = {
  gearBoxId: number;
  gearBoxName: string;
};

export type WheelFormula = {
  wheelFormulaId: number;
  wheelFormulaName: string;
};

export type AssetRoadVehicleUsingOrigins = {
  assetRoadVehicleUsingOriginId: number;
  assetRoadVehicleUsingOriginName: string;
};

export type AssetRoadVehicleUsingPurposes = {
  assetRoadVehicleUsingPurposeId: number;
  assetRoadVehicleUsingPurposeName: string;
};
