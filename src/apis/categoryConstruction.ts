import { CreateCategoryConstructionDataType } from "constant/types";
import { SBAAxiosClient } from "./base";

export const categoryConstructionApi = {
  create: (data?: CreateCategoryConstructionDataType) => {
    return SBAAxiosClient(`/assets/api/v1/constructionName`, {
      method: "POST",
      data,
    });
  },
};
