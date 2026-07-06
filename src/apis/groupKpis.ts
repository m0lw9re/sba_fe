import { KPIsByGroup, StaffByGroup } from "constant/types";
import { SBAAxiosClient } from "./base";

export const groupKpis = {
  createGroup: (data: KPIsByGroup) => {
    return SBAAxiosClient(`/assets/api/v1/KpiGroup`, {
      method: "POST",
      data,
    });
  },
  updateGroup: (data: KPIsByGroup) => {
    return SBAAxiosClient(`/assets/api/v1/KpiGroup`, {
      method: "PUT",
      data,
    });
  },
  deleteGroup: (kpiGroupId: string) => {
    return SBAAxiosClient(`/assets/api/v1/KpiGroup/${kpiGroupId}`, {
      method: "DELETE",
    });
  },

  createEmployee: (data: StaffByGroup) => {
    return SBAAxiosClient(`/assets/api/v1/EmpKpiGroup`, {
      method: "POST",
      data,
    });
  },
  updateEmployee: (data: StaffByGroup) => {
    return SBAAxiosClient(`/assets/api/v1/EmpKpiGroup`, {
      method: "PUT",
      data,
    });
  },
  deleteEmployee: (id: string) => {
    return SBAAxiosClient(`/assets/api/v1/EmpKpiGroup/${id}`, {
      method: "DELETE",
    });
  },
};
