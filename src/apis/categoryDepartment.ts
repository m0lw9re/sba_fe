import { SBAAxiosClient } from "./base";
import {
  CreateCategoryDepartmentType,
  UpdateCategoryDepartmentType,
} from "../constant/types";

export const categoryDepartmentApi = {
  create: (data?: CreateCategoryDepartmentType) => {
    return SBAAxiosClient("/admin/api/v1/department", {
      method: "POST",
      data,
    });
  },
  update: (data: UpdateCategoryDepartmentType) => {
    return SBAAxiosClient(`/admin/api/v1/department/update`, {
      method: "PUT",
      data,
    });
  },
  delete: (departmentId: string | number) => {
    return SBAAxiosClient(`/admin/api/v1/department/delete/${departmentId}`, {
      method: "DELETE",
    });
  },
};
