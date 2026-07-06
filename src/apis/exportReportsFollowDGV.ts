import { serialize } from "utils/validate";
import { SBAAxiosClient } from "./base";
import {
  FilterFollowDebtByStaff,
  FilterFollowReportsDebt,
} from "constant/types";

export const exportReportsFollow = {
  exportReportsFollowDGV: (filters?: FilterFollowDebtByStaff) => {
    let url = `/bussiness/api/v1/statistic/debt/bystaff/export_excel?${serialize(
      {
        ...filters,
      }
    )}`;

    return SBAAxiosClient(url, {
      method: "GET",
      responseType: "arraybuffer",
    });
  },

  exportReportsFollowDetail: (filters?: FilterFollowReportsDebt) => {
    let url = `/bussiness/api/v1/statistic/debt/detail/export_excel?${serialize(
      {
        ...filters,
      }
    )}`;

    return SBAAxiosClient(url, {
      method: "GET",
      responseType: "arraybuffer",
    });
  },
};