import { VehicleBrandType, FilterVehicleBrandType } from "constant/types/brand";
import { SBAAxiosClient } from "./base";
import { serialize } from "utils";

export const brandApi = {
  getAllBrand: (filter: FilterVehicleBrandType) => {
    return SBAAxiosClient(
      `/assets/api/v1/vehicleBrands?${serialize({ ...filter })}`,
      {
        method: "GET",
      }
    );
  },
  getAllBrandSearch: (filter: FilterVehicleBrandType) => {
    return SBAAxiosClient(
      `/assets/api/v1/vehicleBrands/search?${serialize({ ...filter })}`,
      {
        method: "GET",
      }
    );
  },
  getDetailBrand: (id: number | string) => {
    return SBAAxiosClient(`/assets/api/v1/vehicleBrands/${id}`, {
      method: "GET",
    });
  },
  createVehicleBrand: (data: VehicleBrandType) => {
    return SBAAxiosClient("/assets/api/v1/vehicleBrands/create", {
      method: "POST",
      data: data,
    });
  },
  updateVehicleBrand: (data: VehicleBrandType) => {
    return SBAAxiosClient("/assets/api/v1/vehicleBrands/update", {
      method: "PUT",
      data: data,
    });
  },
  deleteVehicleBrand: (id: string | number) => {
    return SBAAxiosClient(`/assets/api/v1/vehicleBrands/delete/${id}`, {
      method: "DELETE",
    });
  },
};
