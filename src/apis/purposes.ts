import {
  CreateCategoryPurposeType,
  EditCategoryPurposeType,
} from "constant/types";
import { SBAAxiosClient } from "./base";
import { serialize } from "utils";

export const purposesApi = {
  getPurposes: () => {
    return SBAAxiosClient("/bussiness/api/v1/appraisalPurposes", {
      method: "GET",
    });
  },
  createPuposes: (data?: CreateCategoryPurposeType) => {
    return SBAAxiosClient(`/assets/api/v1/usingPurpose`, {
      method: "POST",
      data,
    });
  },
  updatePuposes: (data?: EditCategoryPurposeType) => {
    return SBAAxiosClient(`/assets/api/v1/usingPurpose`, {
      method: "PUT",
      data,
    });
  },
  delete: (usingPurposeId: string) => {
    return SBAAxiosClient("/assets/api/v1/usingPurpose/" + usingPurposeId, {
      method: "DELETE",
    });
  },
  search: (data: any) => {
    return SBAAxiosClient(
      `/assets/api/v1/usingPurpose/search?${serialize(data)}`,
      {
        method: "GET",
      }
    );
  },
};
