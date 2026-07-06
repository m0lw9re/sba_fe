import { SBAAxiosClient } from "./base";

export const reportsApi = {
  exportReportRecordArise: () => {
    return SBAAxiosClient(`/bussiness/api/v1/recordArise/chart`, {
      method: "GET",
    });
  },
};
