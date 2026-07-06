import { getLegalInformationsParams } from "constants/types/common.type";
import { SBAAxiosClient } from "./base";
import {
  GetExpertiseAssetInfoParam,
  AssetLandRealEstateInfo,
} from "constants/types/assetInfor_new_type";
import {
  AddAssetOwnersData,
  AssetOwners,
  CreateConstructionData,
  CreateLegalInfoData,
  LegalInformation,
} from "constants/types/assetCommon.type";
import { AssetRoadVehicle } from "constants/types/assetRoadVehicle.type";
import { GetAssetRoadVehicleInfoParam } from "constants/types/assetLandRealEstate.type";
import { AssetAppartmentType } from "constants/types/assetAppartment.type";

export const assetDetailApi = {
  getLandInfoRealEstate: (params?: getLegalInformationsParams) => {
    return SBAAxiosClient(
      "/assets/api/v1/assetLandRealEstate/" + params?.assetId,
      {
        method: "GET",
      }
    );
  },
  updateLandInfoRealEstate: (data: AssetLandRealEstateInfo) => {
    return SBAAxiosClient("/assets/api/v1/assetLandRealEstate", {
      method: "PUT",
      data,
    });
  },
  getAssetRoadVehicle: (params: GetAssetRoadVehicleInfoParam) => {
    return SBAAxiosClient("/assets/api/v1/assetRoadVehicle/" + params.assetId, {
      method: "GET",
    });
  },
  updateAssetRoadVehicle: (data: AssetRoadVehicle) => {
    return SBAAxiosClient("/assets/api/v1/assetRoadVehicle", {
      method: "PUT",
      data,
    });
  },
  AddLegalInfo: (data?: CreateLegalInfoData) => {
    return SBAAxiosClient("/assets/api/v1/legalInformation", {
      method: "POST",
      data,
    });
  },
  updateLegalInfo: (data?: LegalInformation) => {
    return SBAAxiosClient("/assets/api/v1/legalInformation", {
      method: "PUT",
      data,
    });
  },
  getLegalInformations: (params?: GetExpertiseAssetInfoParam) => {
    return SBAAxiosClient(
      "/assets/api/v1/legalInformations/" + params?.assetId,
      {
        method: "GET",
      }
    );
  },
  getLegalInformationTypes: () => {
    return SBAAxiosClient("/assets/api/v1/legalInformationTypes", {
      method: "GET",
    });
  },
  getPositionInPriceRanges: () => {
    return SBAAxiosClient("/assets/api/v1/positionInPriceRanges", {
      method: "GET",
    });
  },
  getRoadContiguousTypes: () => {
    return SBAAxiosClient("/assets/api/v1/roadContiguousTypes", {
      method: "GET",
    });
  },
  getCurrentUseSituations: () => {
    return SBAAxiosClient("/assets/api/v1/currentUseSituations", {
      method: "GET",
    });
  },
  getCurrentUseSituationByAssetLevelTwoId: (assetLevelTwoId: number) => {
    return SBAAxiosClient(
      "/assets/api/v1/currentUseSituations/" + assetLevelTwoId,
      {
        method: "GET",
      }
    );
  },
  getDirection: () => {
    return SBAAxiosClient("/assets/api/v1/directions", {
      method: "GET",
    });
  },
  getBorrowerOwnerRelationShip: (params?: { customerTypeId?: number }) => {
    return SBAAxiosClient(
      "/bussiness/api/v1/borrowerOwnerRelationships/" + params?.customerTypeId,
      {
        method: "GET",
      }
    );
  },

  getImage: (params?: { type?: string; fileName?: string }) => {
    return SBAAxiosClient(
      "/assets/api/v1/loadimages/" + params?.type + "/" + params?.fileName,
      {
        method: "GET",
      }
    );
  },
  AddAssetImage: (
    data?: FormData,
    params?: { assetId: string; description: string }
  ) => {
    return SBAAxiosClient(
      `/assets/api/v1/assetImage/?assetId=${params?.assetId}&description=${params?.description}`,
      {
        method: "POST",
        data,
      }
    );
  },
  getAssetImageByAssetId: (assetId: string) => {
    return SBAAxiosClient("/assets/api/v1/assetImages/" + assetId, {
      method: "GET",
    });
  },
  deleteAssetImage: (assetId: string) => {
    return SBAAxiosClient("/assets/api/v1/assetImage/" + assetId, {
      method: "DELETE",
    });
  },
  getConstruction: (params: { assetId?: string }) => {
    return SBAAxiosClient("/assets/api/v1/constructions/" + params.assetId, {
      method: "GET",
    });
  },
  updateConstruction: (data?: CreateConstructionData) => {
    return SBAAxiosClient("/assets/api/v1/construction", {
      method: "PUT",
      data,
    });
  },
  getConstructionTypes: () => {
    return SBAAxiosClient("/assets/api/v1/constructionTypes/", {
      method: "GET",
    });
  },
  getConstructionLevel: () => {
    return SBAAxiosClient("/assets/api/v1/constructionLevels", {
      method: "GET",
    });
  },
  AddConstruction: (data?: CreateConstructionData) => {
    return SBAAxiosClient("/assets/api/v1/construction", {
      method: "POST",
      data,
    });
  },
  deleteConstruction: (params: { constructionId?: number }) => {
    return SBAAxiosClient(
      "/assets/api/v1/construction/" + params.constructionId,
      {
        method: "DELETE",
      }
    );
  },
  getRiskAssets: (params: { assetLevelTwoId: number }) => {
    return SBAAxiosClient(
      "/assets/api/v1/riskAssets/" + params.assetLevelTwoId,
      {
        method: "GET",
      }
    );
  },
  getRiskDetail: (params: { riskId: number }) => {
    return SBAAxiosClient("/assets/api/v1/riskAsset/" + params?.riskId, {
      method: "GET",
    });
  },
  AddAssetOwners: (data?: AddAssetOwnersData) => {
    return SBAAxiosClient("/assets/api/v1/assetOwner", {
      method: "POST",
      data,
    });
  },
  updateAssetOwners: (data?: AssetOwners) => {
    return SBAAxiosClient("/assets/api/v1/assetOwner", {
      method: "PUT",
      data,
    });
  },
  updatePositionImage: (data?: FormData) => {
    return SBAAxiosClient("/assets/api/v1/assetLandRealEstate/positioning", {
      method: "PUT",
      data,
    });
  },
  updateApartmentPositionImage: (
    data?: FormData,
    params?: { assetId: string }
  ) => {
    return SBAAxiosClient(
      `/assets/api/v1/assetApartment/positioning?assetId=${params?.assetId}`,
      {
        method: "PUT",
        data,
      }
    );
  },
  updateAssetLandPositionImage: (
    data: FormData,
    params: { assetId: string }
  ) => {
    return SBAAxiosClient(
      `/assets/api/v1/assetLandRealEstate/positioning?assetId=${params.assetId}`,
      {
        method: "PUT",
        data,
      }
    );
  },
  updateAssetAppartment: (data: AssetAppartmentType) => {
    return SBAAxiosClient("/assets/api/v1/assetApartment", {
      method: "PUT",
      data,
    });
  },
  getAssetAppartmentInfor: (params: { assetId: string }) => {
    return SBAAxiosClient("/assets/api/v1/assetApartment/" + params.assetId, {
      method: "GET",
    });
  },
};
