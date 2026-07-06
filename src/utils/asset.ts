import { ASSET_LV2 } from "constant/enums";
import { AppraisalFileAssetDetailType } from "constant/types";
import {
  AssetImageType,
  AssetObjectMachineDeviceType,
  AssetObjectOtherPropertyType,
  AssetObjectRealEstateType,
  AssetObjectRoadVehicleType,
  AssetObjectType,
  AssetObjectWaterVehicleType,
} from "constant/types/appraisalFile";
import { isEqual, sortBy } from "lodash";

const { VEHICLE, WATER_VEHICLE, APARTMENT, MACHINE, ESTIMATE, LAND, PROJECT } =
  ASSET_LV2;

const isAssetRealEstate = (assetLevelTwoId: number) => {
  const isAssetRealEstate =
    assetLevelTwoId === LAND ||
    assetLevelTwoId === APARTMENT ||
    assetLevelTwoId === ESTIMATE;
  // assetLevelTwoId === PROJECT ||
  return isAssetRealEstate;
};
const isAssetMovableEstate = (assetLevelTwoId: number) => {
  const isAssetMovableEstate =
    assetLevelTwoId === VEHICLE ||
    assetLevelTwoId === WATER_VEHICLE ||
    assetLevelTwoId === MACHINE;
  return isAssetMovableEstate;
};

// bds
const getAssetRealEstateData = (assetDetail: AppraisalFileAssetDetailType) => {
  const assetObject: AssetObjectType<AssetObjectRealEstateType> = {
    ...assetDetail?.assetObject,
  } as AssetObjectRealEstateType;
  return assetObject;
};
// động sản
const getAssetRoadVehicleData = (assetDetail: AppraisalFileAssetDetailType) => {
  const assetObject: AssetObjectType<AssetObjectRoadVehicleType> = {
    ...assetDetail?.assetObject,
  } as AssetObjectRoadVehicleType;
  return assetObject;
};
const getAssetWaterVehicleData = (
  assetDetail: AppraisalFileAssetDetailType
) => {
  const assetObject: AssetObjectType<AssetObjectWaterVehicleType> = {
    ...assetDetail?.assetObject,
  } as AssetObjectWaterVehicleType;
  return assetObject;
};
const getAssetMachineDeviceData = (
  assetDetail: AppraisalFileAssetDetailType
) => {
  const assetObject: AssetObjectType<AssetObjectMachineDeviceType> = {
    ...assetDetail?.assetObject,
  } as AssetObjectMachineDeviceType;
  return assetObject;
};
// khác
const getAssetOtherPropertyData = (
  assetDetail: AppraisalFileAssetDetailType
) => {
  const assetObject: AssetObjectType<AssetObjectOtherPropertyType> = {
    ...assetDetail?.assetObject,
  } as AssetObjectOtherPropertyType;
  return assetObject;
};

// check images saved
const handleCheckImagesSaved = async (
  originImages: AssetImageType[],
  updateImages: AssetImageType[]
) => {
  const _originImages = sortBy(originImages, "assetImageId").map((item) => {
    return {
      assetImageId: item.assetImageId,
      ecmId: item.ecmId,
      description: item.description,
      type: item.type,
    };
  });
  const _updateImages = sortBy(updateImages, "assetImageId").map((item) => {
    return {
      assetImageId: item.assetImageId,
      ecmId: item.ecmId,
      description: item.description,
      type: item.type,
    };
  });
  const result = isEqual(_originImages, _updateImages);
  return result;
};

export {
  getAssetMachineDeviceData,
  getAssetOtherPropertyData,
  getAssetRealEstateData,
  getAssetRoadVehicleData,
  getAssetWaterVehicleData,
  handleCheckImagesSaved,
  isAssetMovableEstate,
  isAssetRealEstate,
};
