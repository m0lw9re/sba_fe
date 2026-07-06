import { CommonGetAllParams } from "constants/types/common.type";
import { SBAAxiosClient } from "./base";

export const notifyApi = {
  getNotifyList: (params: CommonGetAllParams) => {
    return SBAAxiosClient(`/bussiness/api/v1/filestatushistory/getlistpaging`, {
      method: "GET",
      params: params,
    });
  },

  updateAllSeen: () => {
    return SBAAxiosClient("/bussiness/api/v1/filestatushistory/setallseen", {
      method: "PUT",
    });
  },

  updateStatus: (appraisalFileStatusHistoryId: string) => {
    return SBAAxiosClient(
      `/bussiness/api/v1/filestatushistory/setseen?id=${appraisalFileStatusHistoryId}`,
      {
        method: "PUT",
      }
    );
  },
};
