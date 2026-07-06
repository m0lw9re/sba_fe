import { SBAAxiosClient } from "./base";
import { LOCAL_STORAGE_KEY } from "constant/enums";

export const exportExcelDetailWeek = {
  exportExcell: (params?: any, type?: "tab2" | "tab4") => {
    let url = `${
      type === "tab2"
        ? "/bussiness/api/v1/reportSynthetic/weekDetail/exportExcel"
        : "/bussiness/api/v1/reportSynthetic/delay/export_excel"
    }`;

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
      headers: {
        x_access_token: LOCAL_STORAGE_KEY.ACCESS_TOKEN,
      },
    });
  },
};
