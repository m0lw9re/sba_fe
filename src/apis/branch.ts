import { CompanyBranchAndRegionsType } from "constant/types/common";
import { SBAAxiosClient } from "./base";

export const branchsApi = {
  getAllbranch: () => {
    return SBAAxiosClient("/bussiness/api/v1/branches", {
      method: "GET",
    });
  },
  getTransactionOffices: (params: { id: number }) => {
    return SBAAxiosClient("/bussiness/api/v1/transactionOffices/" + params.id, {
      method: "GET",
    });
  },
  updateProvinceInBranch: (data: CompanyBranchAndRegionsType) => {
    return SBAAxiosClient("/bussiness/api/v1/companyBranch/update", {
      method: "PUT",
      data,
    });
  },
  updateBranchAppraisalFile: (params: {
    appraisalFileId: string;
    companyBranchId: number;
  }) => {
    return SBAAxiosClient(
      "/bussiness/api/v1/appraisalFiles/update_company_branch",
      {
        method: "PUT",
        params,
      }
    );
  },
};
