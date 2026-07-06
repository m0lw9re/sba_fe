import { CommonGetAllParams } from "constants/types/common.type";
import { FilterCategoryCommit } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useCategoryCommit = (
  params?: CommonGetAllParams,
  filter?: FilterCategoryCommit
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/commitmentDate?${serialize({
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
