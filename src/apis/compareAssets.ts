import {
  CompareGetParams,
  CompareDeleteParams,
  ComparePostParams,
} from "constants/types/compare.type";
import { SBAAxiosClient } from "./base";
import { CommonSearchAllParams } from "constants/types/common.type";
import { ComparedAssetLandEstateCreateType, ComparedAssetAppartmentCreateType, ComparedAssetRoadVehicleCreateType, ComparedAssetWaterVehicleType, ComparedAssetDeviceCreateType } from "constant/types";
import { serialize } from "utils/validate";

export const compareAssetsAPI = {
  getCompareAssets: (params: CompareGetParams) => {
    return SBAAxiosClient("/assets/api/v1/compareAssets", {
      method: "GET",
      params,
    });
  },
  deleteCompareAssets: (params: CompareDeleteParams) => {
    return SBAAxiosClient("/assets/api​/v1​/compareAssets", {
      method: "DELETE",
      params,
    });
  },
  postCompare: (data: ComparePostParams) => {
    return SBAAxiosClient("/assets/api/v1/compareAsset", {
      method: "POST",
      data,
    });
  },
  getResultExpertise: (assetId: string) => {
    return SBAAxiosClient(
      `/assets/api/v1/assetLandRealEstateValue/${assetId}`,
      {
        method: "GET",
      }
    );
  },
  getAccessStorage: (params?: CommonSearchAllParams) => {
    return SBAAxiosClient(
      `/assets/api/v1/assetLandRealEstateStorages/get_paging`,
      {
        method: "GET",
        params,
      }
    );
  },
  getAssetApartmentStorage: () => {
    return SBAAxiosClient(`/assets/api/v1/assetApartmentsStorage`, {
      method: "GET",
    });
  },
  getAssetRoadVehicleStorage: () => {
    return SBAAxiosClient(`/assets/api/v1/assetRoadVehiclesStorage`, {
      method: "GET",
    });
  },
  getResultApartment: (assetId: string) => {
    return SBAAxiosClient(`/assets/api/v1/assetApartmentValue/${assetId}`, {
      method: "GET",
    });
  },
  getResultRoadVehicle: (assetId: string) => {
    return SBAAxiosClient(`/assets/api/v1/assetRoadVehicleValue/${assetId}`, {
      method: "GET",
    });
  },

  //Thêm tài sản bất động sản kho giá
  createLandEstateStoredAsset: (
    data: ComparedAssetLandEstateCreateType[],
    assetType: number
  ) => {
    return SBAAxiosClient(
      `/assets/api/v2/storedAsset/insert?assetType=${assetType}`,
      {
        method: "POST",
        data,
      }
    );
  },

  // Thêm tài sản CHCC kho giá
  createApartmentEstateStoredAsset: (
    data: ComparedAssetAppartmentCreateType[],
    assetType: number
  ) => {
    return SBAAxiosClient(
      `/assets/api/v2/storedAsset/insert?assetType=${assetType}`,
      {
        method: "POST",
        data,
      }
    );
  },

  // Thêm tài sản PTĐB
  createRoadVehicleEstateStoredAsset: (
    data: ComparedAssetRoadVehicleCreateType[],
    assetType: number
  ) => {
    return SBAAxiosClient(
      `/assets/api/v2/storedAsset/insert?assetType=${assetType}`,
      {
        method: "POST",
        data,
      }
    );
  },

  // Thêm tài sản PTĐT
  createWaterVehicleEstateStoredAsset: (
    data: ComparedAssetWaterVehicleType[],
    assetType: number
  ) => {
    return SBAAxiosClient(
      `/assets/api/v2/storedAsset/insert?assetType=${assetType}`,
      {
        method: "POST",
        data,
      }
    );
  },

  // Thêm tài sản máy móc thiết bị
  createDeviceVehicleEstateStoredAsset: (
    data: ComparedAssetDeviceCreateType[],
    assetType: number
  ) => {
    return SBAAxiosClient(
      `/assets/api/v2/storedAsset/insert?assetType=${assetType}`,
      {
        method: "POST",
        data,
      }
    );
  },

  updateStoredAsset: (data: any, assetType: number) => {
    return SBAAxiosClient(`/assets/api/v2/storedAsset?assetType=${assetType}`, {
      method: "PUT",
      data,
    });
  },

  // check trùng tsss
  checkDuplicatedData: (params: any, filter: any) => {
    return SBAAxiosClient(`/assets/api/v2/storedAsset?${serialize({
      ...params,
      ...filter,
    })}`, {
      method: "GET",
    });
  },

  // update array
  updateStoredAssets: (data: any, assetType: number) => {
    return SBAAxiosClient(`/assets/api/v2/storedAsset/updateMany?assetType=${assetType}`, {
      method: "PUT",
      data,
    });
  },
};
