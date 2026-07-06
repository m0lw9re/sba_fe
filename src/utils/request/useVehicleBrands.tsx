import { FilterVehicleBrandType } from "constant/types/brand";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useVehicleBrands = (params?: FilterVehicleBrandType) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/vehicleBrands/search?${serialize({
      ...params,
    })}`,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
