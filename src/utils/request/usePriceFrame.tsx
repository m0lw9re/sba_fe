import { FilterPriceFrameType } from "constant/types/priceFrame";
import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const usePriceFrame = (
  params?: CommonGetAllParams,
  filter?: FilterPriceFrameType
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/roadInPrice/search?${serialize({
      ...params,
      ...filter,
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
