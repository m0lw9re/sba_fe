import { CommonGetAllParams } from "constants/types/common.type";
import { SBAAxiosClient } from "./base";

export const addressApi = {
  getProvinces: (params?: CommonGetAllParams) => {
    return SBAAxiosClient("/bussiness/api/v1/provinces" , {
      method: "GET",
      params
    });
  },
  getDistricts: (params: { code: string }) => {
    return SBAAxiosClient("/bussiness/api/v1/district/" + params.code, {
      method: "GET",
    });
  },
  getWards: (params: { code: string }) => {
    return SBAAxiosClient("/bussiness/api/v1/wards/" + params.code, {
      method: "GET",
    });
  },
};
