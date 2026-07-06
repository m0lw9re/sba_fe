import { FilterStaffByRoleType, StaffByRoleType } from "constant/types";
import { SBAAxiosClient } from "./base";
import { ReportApproval, StaffAssign } from "constants/types/staffAssign.type";

export const StaffApi = {
  getStaffSurveyAssgin: () => {
    return SBAAxiosClient("/bussiness/api/v1/assignment/survey_staff", {
      method: "GET",
    });
  },
  createAssign: (data: StaffAssign) => {
    return SBAAxiosClient("/bussiness/api/v1/assignment", {
      method: "POST",
      data,
    });
  },
  getStaffReportAssgin: () => {
    return SBAAxiosClient("/bussiness/api/v1/assignment/report_staff", {
      method: "GET",
    });
  },
  getInformApprover: () => {
    return SBAAxiosClient("/bussiness/api/v1/assignment/inform_staff", {
      method: "GET",
    });
  },
  getReportApprover: () => {
    return SBAAxiosClient("/bussiness/api/v1/assignment/approver", {
      method: "GET",
    });
  },
  ApprovalReport: (params: ReportApproval) => {
    return SBAAxiosClient("/bussiness/api/v1/assignment/aprrove/report", {
      method: "PUT",
      params,
    });
  },
  getStaffListByRole: (params: FilterStaffByRoleType) => {
    return SBAAxiosClient("/admin/api/v1/staffs/listByRole", {
      method: "GET",
      params,
    });
  },
  updateStaffListByRole: (data: Array<StaffByRoleType>, roleCode: string) => {
    return SBAAxiosClient(`/admin/api/v1/role/staff/${roleCode}`, {
      method: "PUT",
      data,
    });
  },
};
