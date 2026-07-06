import { SBAAxiosClient } from "./base";
import { PriceFrameType } from "constant/types/priceFrame";

export const priceFrameApi = {
  updatePriceFrame: (data: PriceFrameType) => {
    return SBAAxiosClient("/bussiness/api/v1/roadInPrice", {
      method: "PUT",
      data,
    });
  },
  createPriceFrame: (data: PriceFrameType) => {
    return SBAAxiosClient("/bussiness/api/v1/roadInPrice", {
      method: "POST",
      data,
    });
  },

  deletePriceFrame: (id: any) => {
    return SBAAxiosClient(`/bussiness/api/v1/roadInPrice/${id}`, {
      method: "DELETE",
    });
  },

  addFromExcel: (data: FormData) => {
    return SBAAxiosClient("/bussiness/api/v1/roadInPrice/importFromExcel", {
      method: "POST",
      data,
      timeout: 30000,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
