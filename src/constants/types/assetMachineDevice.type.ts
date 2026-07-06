import {
  RiskDetail,
  AssetImages,
  AssetOwners,
  LegalInformation,
  RepairHistory,
} from "constants/types/assetCommon.type";

export type AssetMachineDevice = {
  assetId: string;
  assetCode: string | null;
  appraisalPurposeId: number | null;
  legalName: string | null;
  legalBrandId: number | null;
  legalModelId: number | null;
  legalMfr: string | null;
  legalYearMfg: number | null;
  legalCountryMfgId: number | null;
  legalVolta: number | null;
  legalPower: number | null;
  realName: string | null;
  realBrandId: number | null;
  realModelId: number | null;
  realMfr: string | null;
  realYearMfg: number | null;
  realCountryMfgId: number | null;
  realVolta: number | null;
  realPower: number | null;
  extendSpecs: string | null;
  currentUseSituationId: number | null;
  remainQuality: number | null;
  usingPurposeTypeId: number | null;
  usingOriginTypeId: number | null;
  usingPeriodId: number | null;
  liquidity: number | null;
  isDispute: number | null;
  disputeInfor: string | null;
  note: string | null;
  appraisalDate: string | null;
  expiredDate: string | null;
  totalPrice: number | null;
  whoCreate: string | null;
  dateCreate: string | null;
  dateModify: string | null;
  isFinish: true;
  assetImages: Array<AssetImages>;
  assetOwners: Array<AssetOwners>;
  legalInformations: Array<LegalInformation>;
  riskDetailDtos: Array<RiskDetail>;
  repairHistories: Array<RepairHistory>;
  propertyExtend?: Array<PropertyAssetMachineExtend>;
};

export type AssetMachineDeviceDataBasic = {
  assetId?: string;
  assetCode?: string | null;
  appraisalPurposeId?: number | null;
  legalName?: string | null;
  legalBrandId?: number | null;
  legalModelId?: number | null;
  legalMfr?: string | null;
  legalYearMfg?: number | null;
  legalCountryMfgId?: number | null;
  legalVolta?: number | null;
  legalPower?: number | null;
  realName?: string | null;
  realBrandId?: number | null;
  realModelId?: number | null;
  realMfr?: string | null;
  realYearMfg?: number | null;
  realCountryMfgId?: number | null;
  realVolta?: number | null;
  realPower?: number | null;
  extendSpecs?: string | null;
  currentUseSituationId?: number | null;
  remainQuality?: number | null;
  usingPurposeTypeId?: number | null;
  usingOriginTypeId?: number | null;
  usingPeriodId?: number | null;
  liquidity?: number | null;
  isDispute?: number | null;
  disputeInfor?: string | null;
  note?: string | null;
  appraisalDate?: string | null;
  expiredDate?: string | null;
  totalPrice?: number | null;
  whoCreate?: string | null;
  dateCreate?: string | null;
  dateModify?: string | null;
  isFinish?: true;
  assetImages?: Array<AssetImages>;
  assetOwners?: Array<AssetOwners>;
  legalInformations?: Array<LegalInformation>;
  riskDetailDtos?: Array<RiskDetail>;
  repairHistories?: Array<RepairHistory>;
  propertyExtend?: Array<PropertyAssetMachineExtend[]>;
};

export type GetAssetMachineDeviceInforParam = {
  assetId: string;
};

export type AssetMachineUsingOrigin = {
  assetMachineUsingOriginId: number;
  assetMachineUsingOriginName: string;
};

export type AssetMachineUsingPurpose = {
  assetMachineUsingPurposeId: number;
  assetMachineUsingPurposeName: string;
};

export type SpecificationRoadVehicleProperty = {
  legalName: string | null;
  legalBrandId: number | null;
  legalModelId: number | null;
  legalMfr: string | null;
  legalYearMfg: number | null;
  legalCountryMfgId: number | null;
  legalVolta: number | null;
  legalPower: number | null;
  realName: string | null;
  realBrandId: number | null;
  realModelId: number | null;
  realMfr: string | null;
  realYearMfg: number | null;
  realCountryMfgId: number | null;
  realVolta: number | null;
  realPower: number | null;
};

export type AssetMachineDeviceBranch = {
  machineBrandId: number;
  machineBrandName: string;
}

export type AssetMachineDeviceModel = {
  machineModelId: number;
  machineModelName: string;
  brandId: number;
}

export type PropertyAssetMachineExtend = {
  property: string;
  legalValue: string;
  realValue: string;
}