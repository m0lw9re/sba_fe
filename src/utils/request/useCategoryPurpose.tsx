import useSWR from "swr";
import { serialize } from "utils/validate";
import { CommonGetAllParams } from "constants/types/common.type";
import { FilterCategoryPurposeType } from "constant/types";

export const useCategoryPurpose = (
  params?: CommonGetAllParams,
  filter?: any
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/usingPurpose/get_all?${serialize({
      ...params,
      ...filter,
    })}`,
    { 
      refreshInterval: 0,
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
