import { SBAAxiosClient } from "./base";
import { RepairHistoryParams } from "constants/types/assetCommon.type";

export const repairHistoryApi = {
  addRepairHistory: (data: FormData, params: RepairHistoryParams) => {
    return SBAAxiosClient("/assets/api/v1/repairHistory?", {
      method: "POST",
      data,
      params,
    });
  },
  getRepairHistory: (assetId: string) => {
    return SBAAxiosClient("/assets/api/v1/repairHistorys/" + assetId, {
      method: "GET",
    });
  },
  deleteRepairHistory: (repairHistoryId: string) => {
    return SBAAxiosClient("/assets/api/v1/repairHistory/" + repairHistoryId, {
      method: "DELETE",
    });
  },
};
