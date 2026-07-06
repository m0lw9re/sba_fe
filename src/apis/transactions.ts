import { SBAAxiosClient, request } from "./base";
import {
  CreateCategoryTransactionType,
  CreatePGDType,
  EditCategoryTransactionType,
  EditPGDType,
} from "constant/types";

export const transactionsApi = {
  create: (data?: CreateCategoryTransactionType) => {
    return SBAAxiosClient(`/bussiness/api/v1/branches`, {
      method: "POST",
      data,
    });
  },
  edit: (data: EditCategoryTransactionType) => {
    return SBAAxiosClient(`/bussiness/api/v1/branches`, {
      method: "PUT",
      data,
    });
  },
  delete: (branchCode: string) => {
    return SBAAxiosClient("/bussiness/api/v1/branches/" + branchCode, {
      method: "DELETE",
    });
  },
  createPGD: (data?: CreatePGDType) => {
    return SBAAxiosClient(`/bussiness/api/v1/transactionOffices`, {
      method: "POST",
      data,
    });
  },
  editPGD: (data: EditPGDType) => {
    return SBAAxiosClient(`/bussiness/api/v1/transactionOffices`, {
      method: "PUT",
      data,
    });
  },
  deletePGD: (transOfficeCode: string) => {
    return SBAAxiosClient(
      "/bussiness/api/v1/transactionOffices/" + transOfficeCode,
      {
        method: "DELETE",
      }
    );
  },
};
