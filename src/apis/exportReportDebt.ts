import { CommonGetAllParams } from "constants/types/common.type";
import { SBAAxiosClient } from "./base";
import { LOCAL_STORAGE_KEY, TYPE_FIELD } from "constant/enums";
import { FilterReportDebtMonthYear } from "constant/types";
import { serialize } from "utils/validate";

export const exportReportDebt = {
  exportExcell: (params?: any) => {
    let url = "/bussiness/api/v1/statistic/debt/report/export_excel";

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
  exportExcelDebtMonthly: (params?: any) => {
    let url = "/bussiness/api/v1/statistic/debt/monthly/export_excel";

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
    });
  },
  exportExcelReportWeekMonth: (
    params?: CommonGetAllParams,
    filters?: FilterReportDebtMonthYear
  ) => {
    let url = `/bussiness/api/v1/statistic/debt/report/month/export_excel?${serialize(
      {
        ...params,
      }
    )}`;

    return SBAAxiosClient(url, {
      method: "GET",
      responseType: "arraybuffer",
      headers: {
        x_access_token: LOCAL_STORAGE_KEY.ACCESS_TOKEN,
      },
    });
  },
  exportExcelReportsTotalDebt: (filters?: FilterReportDebtMonthYear) => {
    let url = `/bussiness/api/v1/statistic/debt/export_excel?${serialize({
      ...filters,
    })}`;

    return SBAAxiosClient(url, {
      method: "GET",
      responseType: "arraybuffer",
      headers: {
        x_access_token: LOCAL_STORAGE_KEY.ACCESS_TOKEN,
      },
    });
  },
};