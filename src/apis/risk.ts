import { CreateCategoryRiskDataType } from "constant/types";
import { SBAAxiosClient, request } from "./base";
import {
  CommonGetAllParams,
  // CreateCategoryRiskDataType,
  EditCategoryRisk,
} from "../constants/types/common.type";
import { CommonSearchAllParams } from "../constants/types/common.type";

export const riskApi = {
  getCategotyRisk: (params?: CommonGetAllParams) => {
    return SBAAxiosClient("/assets/api/v1/riskAsset/getAllRiskAsset", {
      method: "GET",
      params,
    });
  },
  getAssetLevelTwo: () => {
    return SBAAxiosClient("/assets/api/v1/riskAsset/getAllAssetLevelTwo", {
      method: "GET",
    });
  },
  search: (params?: CommonSearchAllParams) => {
    return SBAAxiosClient("/assets/api/v1/riskAsset/getAllRiskAsset", {
      method: "GET",
      params,
    });
  },
  create: (data?: CreateCategoryRiskDataType) => {
    return SBAAxiosClient(`/assets/api/v1/riskAsset`, {
      method: "POST",
      data,
    });
  },
  edit: (data?: EditCategoryRisk) => {
    return SBAAxiosClient(`/assets/api/v1/riskAsset`, {
      method: "PUT",
      data,
    });
  },
  getRiskLevel: (params?: CommonGetAllParams) => {
    return SBAAxiosClient("/assets/api/v1/riskAsset/searchRiskAsset?", {
      method: "GET",
      params,
    });
  },
  delete: (riskAssetId: string) => {
    return SBAAxiosClient("/assets/api/v1/riskAsset/" + riskAssetId, {
      method: "DELETE",
    });
  },
};
