import { SBAAxiosClient, request } from "./base";

export const syncEMSApi = {
  syncEMS: (data: any) => {
    return SBAAxiosClient("/bussiness/api/v1/feeNotification/syn_known", {
      method: "POST",
      data,
    });
  },
  unSyncEMS: (data: any) => {
    return SBAAxiosClient("/bussiness/api/v1/feeNotification/syn_unknown", {
      method: "POST",
      data,
    });
  },
  updateStatusEms: (data: any) => {
    return SBAAxiosClient("/bussiness/api/v1/feeNotification/updateStatusEms", {
      method: "PUT",
      data,
    });
  },
};
