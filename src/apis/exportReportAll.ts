import { serialize } from "utils";
import { SBAAxiosClient } from "./base";
import { LOCAL_STORAGE_KEY } from "constant/enums";

export const exportExcelAll = {
  exportExcell: (params?: any) => {
    let url = "/bussiness/api/v1/reportSynthetic/combine/exportExcel";

    const filteredParam = Object.fromEntries(
      Object.entries(params || {}).filter(
        ([key, value]) => value !== null && value !== undefined
      )
    );

    let isFirstParam = true;
    for (const key in filteredParam) {
      if (Object.prototype.hasOwnProperty.call(filteredParam, key)) {
        if (isFirstParam) {
          url += `?${key}=${filteredParam[key]}`;
          isFirstParam = false;
        } else {
          url += `&${key}=${filteredParam[key]}`;
        }
      }
    }

    return SBAAxiosClient(url, {
      method: "GET",
      responseType: "arraybuffer",
      timeout: 5 * 60 * 1000,
      headers: {
        x_access_token: LOCAL_STORAGE_KEY.ACCESS_TOKEN,
      },
    });
  },

  exportExcelDocToInv: (params?: any) => {
    return SBAAxiosClient(
      `/assets/api/v2/statistic/can_export_bill_report/export_excel?${serialize(
        params
      )}`,
      {
        method: "GET",
        responseType: "arraybuffer",
        timeout: 5 * 60 * 1000,
        headers: {
          x_access_token: LOCAL_STORAGE_KEY.ACCESS_TOKEN,
        },
      }
    );
  },
};
