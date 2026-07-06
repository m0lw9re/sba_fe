import {
  CreateUtilityType,
  SystemParamsType,
  UpdateUtilityType,
} from "constant/types/system";
import { SBAAxiosClient } from "./base";

export const systemApi = {
  update: (data?: SystemParamsType) => {
    return SBAAxiosClient("/admin/api/v1/systemParameters", {
      method: "POST",
      data,
    });
  },
  getAllGroups: () => {
    return SBAAxiosClient("/admin/api/v1/systemParametersGroup", {
      method: "GET",
    });
  },
  getFastExpRealEstate: (params: any) => {
    return SBAAxiosClient("/assets/api/v1/storedAssetRate", {
      method: "GET",
      params,
    });
  },
  updateFastExpRealEstate: (data: any) => {
    return SBAAxiosClient("/assets/api/v1/storedAssetRate", {
      method: "PUT",
      data,
    });
  },
  createFastExpRealEstate: (data: any) => {
    return SBAAxiosClient("/assets/api/v1/storedAssetRate/insert", {
      method: "POST",
      data,
    });
  },
  deleteFastExpRealEstate: (id: string) => {
    return SBAAxiosClient(`/assets/api/v1/storedAssetRate/${id}`, {
      method: "DELETE",
    });
  },
  getListUtility: () => {
    return SBAAxiosClient("/assets/api/v1/apartment/detail/utilities", {
      method: "GET",
    });
  },
  createUtilityCombo: (data: CreateUtilityType) => {
    return SBAAxiosClient("/assets/api/v1/apartment/detail/combo/insert", {
      method: "POST",
      data,
    });
  },
  updateUtilityCombo: (data: UpdateUtilityType) => {
    return SBAAxiosClient("/assets/api/v1/apartment/detail/combo", {
      method: "PUT",
      data,
    });
  },
  deleteUtilityCombo: (id: string) => {
    return SBAAxiosClient(`/assets/api/v1/apartment/detail/combo/${id}`, {
      method: "DELETE",
    });
  },
};
