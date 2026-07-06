import { SBAAxiosClient } from "./base";

export const contructionApi = {
  getContructionType: () => {
    return SBAAxiosClient("/assets/api/v1/constructionTypes", {
      method: "GET",
    });
  },
  getContructionName: (contructionTypeId: number) => {
    return SBAAxiosClient(
      `/assets/api/v1/constructionNames/${contructionTypeId}`,
      {
        method: "GET",
      }
    );
  },
  getConstructionLegalTypes: () => {
    return SBAAxiosClient(
      `assets/api/v1/constructionLegalTypes`,
      {
        method: "GET",
      }
    );
  },
};
