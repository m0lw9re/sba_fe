import { DataApartmentType } from "constants/types/assetApartment.type";
import { SBAAxiosClient } from "./base";

export const assetApartment = {
  putChangeInfo: (data: DataApartmentType) => {
    return SBAAxiosClient("/assets/api/v1/assetApartment", {
      method: "PUT",
      data
    });
  },
};
