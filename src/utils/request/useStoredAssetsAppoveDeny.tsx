import useSWR from "swr";
import { FilterSpecificPricesType } from "constant/types";
import { serialize } from "utils/validate";
import { CommonGetAllParams } from "constants/types/common.type";

export const useStoredAsset = (
  params?: CommonGetAllParams,
  filter?: FilterSpecificPricesType
) => {
const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v2/storedAsset/byme?${serialize({
      ...params,
      ...filter,
      approved: filter?.approved === false ? "false" : filter?.approved
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
