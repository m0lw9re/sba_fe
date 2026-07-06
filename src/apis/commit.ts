import { CreateCategoryCommit, EditCategoryCommit } from "constant/types";
import { SBAAxiosClient } from "./base";

export const commitApi = {
  createCategoryCommit: (data?: CreateCategoryCommit) => {
    return SBAAxiosClient(`/bussiness/api/v1/commitmentDate/insert`, {
      method: "POST",
      data,
    });
  },
  delete: (id: number) => {
    return SBAAxiosClient("/bussiness/api/v1/commitmentDate/" + id, {
      method: "DELETE",
    });
  },
  edit: (data?: EditCategoryCommit) => {
    return SBAAxiosClient(`/bussiness/api/v1/commitmentDate`, {
      method: "PUT",
      data,
    });
  },

  // updateArea: (data: AreaType) => {
  //   return SBAAxiosClient("/bussiness/api/v1/commitmentDate/area", {
  //     method: "PUT",
  //     data,
  //   });
  // }
};
