import { GetExpertiseAssetInfoParam } from "constants/types/assetInfor_new_type";
import { SBAAxiosClient } from "./base";
import { CommonGetAllParams } from "constants/types/common.type";

export const assetCommonApi = {
  getAssetClassifications: () => {
    return SBAAxiosClient("/bussiness/api/v1/assetClassifications", {
      method: "GET",
    });
  },
  getAssetForms: () => {
    return SBAAxiosClient("/bussiness/api/v1/assetForms", {
      method: "GET",
    });
  },
  getAssetTypes: () => {
    return SBAAxiosClient("/bussiness/api/v1/assetTypes", {
      method: "GET",
    });
  },
  getBussinessAdvantages: () => {
    return SBAAxiosClient("/assets/api/v1/bussinessAdvantages", {
      method: "GET",
    });
  },
  getZones: () => {
    return SBAAxiosClient("/assets/api/v1/zones", {
      method: "GET",
    });
  },
  getAssetLandRealEstateUsingPurposeTypes: () => {
    return SBAAxiosClient(
      "/assets/api/v1/assetLandRealEstateUsingPurposeTypes",
      {
        method: "GET",
      }
    );
  },
  getAssetLandRealEstateUsingOriginTypes: () => {
    return SBAAxiosClient(
      "/assets/api/v1/assetLandRealEstateUsingOriginTypes",
      {
        method: "GET",
      }
    );
  },
  getUsingPeriods: (parmas?: { assetLevelTwoId?: number }) => {
    return SBAAxiosClient(
      "/assets/api/v1/usingPeriods/" + parmas?.assetLevelTwoId,
      {
        method: "GET",
      }
    );
  },
  getLiquidities: () => {
    return SBAAxiosClient("/assets/api/v1/liquidities", {
      method: "GET",
    });
  },
  getAborrowerOwnerRelationship: () => {
    return SBAAxiosClient("/bussiness/api/v1/borrowerOwnerRelationships", {
      method: "GET",
    });
  },
  getAborrowerOwnerRelationshipTypeCus: (params?: {
    customerTypeId?: number;
  }) => {
    return SBAAxiosClient(
      "/bussiness/api/v1/borrowerOwnerRelationships/" + params?.customerTypeId,
      {
        method: "GET",
      }
    );
  },
  getAssetLevel1: () => {
    return SBAAxiosClient("/assets/api/v1/assetLevelOne/get_all", {
      method: "GET",
    });
  },
  getAssetLevel2: (assetLevelOneId: number) => {
    return SBAAxiosClient(
      "/assets/api/v1/assetLevelTwo/get_by_asset_level_one/" + assetLevelOneId,
      {
        method: "GET",
      }
    );
  },
  getAssetLevel3: (assetLevelTwoId: number) => {
    return SBAAxiosClient(
      "/assets/api/v1/assetLevelThree/get_by_asset_level_two/" +
        assetLevelTwoId,
      {
        method: "GET",
      }
    );
  },
  getEquipments: () => {
    return SBAAxiosClient("/assets/api/v1/equipments", {
      method: "GET",
    });
  },
  getAssetAppartment: (parmas?: GetExpertiseAssetInfoParam) => {
    return SBAAxiosClient("/assets/api/v1/assetApartment/" + parmas?.assetId, {
      method: "GET",
    });
  },
  getRoadVehicleBrands: () => {
    return SBAAxiosClient("/assets/api/v1/roadVehicleBrands", {
      method: "GET",
    });
  },
  getRoadVehicleModels: (branchId: number) => {
    return SBAAxiosClient("/assets/api/v1/roadVehicleModels/" + branchId, {
      method: "GET",
    });
  },
  getFuelds: () => {
    return SBAAxiosClient("/assets/api/v1/fuels", {
      method: "GET",
    });
  },
  getWheelFormulas: () => {
    return SBAAxiosClient("/assets/api/v1/wheelFormulas", {
      method: "GET",
    });
  },
  getGearBoxs: () => {
    return SBAAxiosClient("/assets/api/v1/gearBoxs", {
      method: "GET",
    });
  },
  getProducedCountries: () => {
    return SBAAxiosClient("/assets/api/v1/countrys", {
      method: "GET",
    });
  },
  getAssetRoadVehicleUsingOrigins: () => {
    return SBAAxiosClient("/assets/api/v1/assetRoadVehicleUsingOrigins", {
      method: "GET",
    });
  },
  getAssetRoadVehicleUsingPurposes: () => {
    return SBAAxiosClient("/assets/api/v1/assetRoadVehicleUsingPurposes", {
      method: "GET",
    });
  },
  getFastExpertiseApartment: (parmas?: GetExpertiseAssetInfoParam) => {
    return SBAAxiosClient(
      "/assets/api/v1/assetApartmentDGN/" + parmas?.assetId,
      {
        method: "GET",
      }
    );
  },
  getFastExpertiseRoadVehicle: (parmas?: GetExpertiseAssetInfoParam) => {
    return SBAAxiosClient(
      "/assets/api/v1/assetRoadVehicleDGN/" + parmas?.assetId,
      {
        method: "GET",
      }
    );
  },
  createAssetLandEstate: (data: any) => {
    return SBAAxiosClient(
      "/assets/api/v1/storedAssetLandEstate",
      {
        method: "POST",
        data
      }
    );
  },
  getAssetType: (params?: CommonGetAllParams) => {
    return SBAAxiosClient("/bussiness/api/v1/commitmentDate/assetType", {
      method: "GET",
      params,
    });
  },
  getAllAssetLevelTwo: () => {
    return SBAAxiosClient("/assets/api/v1/assetLevelTwo/get_all", {
      method: "GET",
    });
  }
};
