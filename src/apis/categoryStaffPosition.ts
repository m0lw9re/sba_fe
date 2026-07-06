import { SBAAxiosClient } from "./base";
import {
  CreateCategoryStaffPositionType,
  UpdateCategoryStaffPositionType,
} from "../constant/types";

export const categoryStaffPositionApi = {
  create: (data?: CreateCategoryStaffPositionType) => {
    return SBAAxiosClient("/admin/api/v1/staffPositions", {
      method: "POST",
      data,
    });
  },
  update: (data: UpdateCategoryStaffPositionType) => {
    return SBAAxiosClient(`/admin/api/v1/staffPositions`, {
      method: "PUT",
      data,
    });
  },
};
