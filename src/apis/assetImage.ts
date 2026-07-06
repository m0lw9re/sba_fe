import { serialize } from "utils";
import { SBAAxiosClient } from "./base";

export const assetImageAPI = {
  getAllImageAsset: (id: string) => {
    return SBAAxiosClient(`/bussiness/api/v1/assetImages/${id}`, {
      method: "GET",
    });
  },
  uploadMultiFiles: (proposalCode: string | number, data: FormData) => {
    return SBAAxiosClient(
      `/bussiness/api/v1/uploadMultiFiles/assetImage/sv?code=${proposalCode}`,
      {
        method: "POST",
        data,
        timeout: 15000,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  putUpdateListImage: (data: string, appraisalFilesId: string) => {
    return SBAAxiosClient(`bussiness/api/v1/assetImage/${appraisalFilesId}`, {
      method: "PUT",
      data,
    });
  },
  loadImage: (ecmId: string) => {
    return SBAAxiosClient(`/bussiness/api/v1/loadECMImage/${ecmId}`, {
      method: "GET",
      responseType: "blob",
      timeout: 30000,
    });
  },
  updateLocate: (params: any) => {
    return SBAAxiosClient(
      `bussiness/api/v1//locate/appraisalFile?${serialize({
        ...params,
      })}`,
      { method: "PUT" }
    );
  },
};
