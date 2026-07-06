import { CreateUpdateCategoryExpirationDateType } from "constant/types/categoryExpirationDate";
import { SBAAxiosClient } from "./base";

export const categoryExpirationDateApi = {
  createExpirationDate: (data?: CreateUpdateCategoryExpirationDateType) => {
    return SBAAxiosClient(`/assets/api/v1/expirationDate`, {
      method: "POST",
      data,
    });
  },
  updateExpirationDate: (data?: CreateUpdateCategoryExpirationDateType) => {
    return SBAAxiosClient(`/assets/api/v1/expirationDate`, {
      method: "PUT",
      data,
    });
  },
  deleteExpirationDate: (expirationDateId: number) => {
    return SBAAxiosClient("/assets/api/v1/expirationDate/" + expirationDateId, {
      method: "DELETE",
    });
  },
};
