import { SBAAxiosClient, request } from "./base";
import { CommonGetAllParams } from "../constants/types/common.type";
import { CreateCategoryRegionsType } from "constant/types";
import { EditCategoryRegions } from "constants/types/common.type";
import { CommonSearchAllParams } from "../constants/types/common.type";
import { EditCategoryRegionsType } from "constant/types/categoryregions";

export const regionsApi = {
  getRegions: (params?: CommonGetAllParams) => {
    return SBAAxiosClient("/bussiness/api/v1/common/regions", {
      method: "GET",
      params,
    });
  },
  search: (params?: CommonSearchAllParams) => {
    return SBAAxiosClient("/bussiness/api/v1/common/regions", {
      method: "GET",
      params,
    });
  },
  create: (data?: CreateCategoryRegionsType) => {
    return SBAAxiosClient(`/bussiness/api/v1/companyBranch`, {
      method: "POST",
      data,
    });
  },
  edit: (data: EditCategoryRegionsType) => {
    return SBAAxiosClient(`/bussiness/api/v1/companyBranch`, {
      method: "PUT",
      data,
    });
  },
  delete: (companyBranchId: string) => {
    return SBAAxiosClient(
      "/bussiness/api/v1/cCompanyBranch/" + companyBranchId,
      {
        method: "DELETE",
      }
    );
  },
  getProvinceByBranch: (companyBranchId: number) => {
    return SBAAxiosClient(
      `/bussiness/api/v1/companyBranch/${companyBranchId}`,
      {
        method: "GET",
      }
    );
  },
};
