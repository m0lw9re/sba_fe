import { CommonGetAllParams } from "constants/types/common.type";
import { FilterCategoryConstructionType } from "constant/types/categoryConstruction";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useCategoryConstruction = (
  params?: CommonGetAllParams,
  filter?: FilterCategoryConstructionType
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/constructionNames?${serialize({
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
