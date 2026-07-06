import { SBAAxiosClient } from "./base";
import { CommonGetAllParams, CommonSearchAllParams } from "../constants/types/common.type";
import { GetDetailAppraisalFileParams } from "../constants/types/expertise.type";

export const expertiseApi = {
  getAll: (params?: CommonGetAllParams) => {
    return SBAAxiosClient("/bussiness/api/v1/proposals", {
      method: "GET",
      params,
    });
  },
  search: (params?: CommonSearchAllParams) => {
    return SBAAxiosClient("/bussiness/api/v1/proposals/search",{
      method: 'GET',
      params,
    })
  },
  getOne: (params?: GetDetailAppraisalFileParams) => {
    return SBAAxiosClient("/bussiness/api/v1/proposal" , {
      method: "GET",
      params
    });
  },
  getFileStates: () => {
    return SBAAxiosClient("/bussiness/api/v1/filesStates", {
      method: "GET"
    });
  },
  getFileStatus: () => {
    return SBAAxiosClient("/bussiness/api/v1/filesStatus", {
      method: "GET"
    });
  },
};
