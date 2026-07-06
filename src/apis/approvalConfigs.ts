import { SBAAxiosClient } from "./base";

export const approvalConfigsApi = {
  getListRoles: () => {
    return SBAAxiosClient("/bussiness/api/v1/approvalConfigs/getListRoles", {
      method: "GET",
    });
  },

  deleteApprovalConfig: (approvalConfigId: number) => {
    return SBAAxiosClient(
      `/bussiness/api/v1/approvalConfig/${approvalConfigId}`,
      {
        method: "DELETE",
      }
    );
  },

  createApprovalConfig: (data: any) => {
    return SBAAxiosClient(`/bussiness/api/v1/approvalConfig/`, {
      method: "POST",
      data,
    });
  },
};
