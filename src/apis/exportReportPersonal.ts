import { FilterPersonalReports } from "constant/types";
import { SBAAxiosClient } from "./base";
import { LOCAL_STORAGE_KEY } from "constant/enums";
import { serialize } from "utils";

export const exportReportPersonal = {
  exportExcel: (params: FilterPersonalReports) => {
    let url = `/bussiness/api/v1/statistic/personal/report/export_excel?${serialize(
      params
    )}`;

    return SBAAxiosClient(url, {
      method: "GET",
      responseType: "arraybuffer",
      timeout: 5 * 60 * 1000,
      headers: {
        x_access_token: LOCAL_STORAGE_KEY.ACCESS_TOKEN,
      },
    });
  },
};
