import { SBAAxiosClient, request } from "./base";
import {
  dayOffVacation as dayOffVacationType,
  editDayOffVacation,
  getDayOffVacation,
} from "constant/types";

export const dayOffVacation = {
  getDayOffVacation: (params?: dayOffVacationType) => {
    return SBAAxiosClient("/admin/api/v1/vacationDay/search", {
      method: "GET",
      params,
    });
  },
  getDayOffVacationByDate: (params?: getDayOffVacation) => {
    return SBAAxiosClient("/admin/api/v1/vacationDay", {
      method: "GET",
      params,
    });
  },
  editDayOffVacation: (data?: editDayOffVacation) => {
    return SBAAxiosClient("/admin/api/v1/vacationDay", {
      method: "POST",
      data,
    });
  },
};
