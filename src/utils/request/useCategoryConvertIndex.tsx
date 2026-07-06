import {CommonGetAllParams} from "constants/types/common.type";
import useSWR from "swr";
import {serialize} from "utils/validate";

export const useCategoryConvertIndex = (
  params?: CommonGetAllParams,
  filter?: any
) => {
  const {data, error, isLoading, mutate} = useSWR(
    `/assets/api/v1/KpiGroup/searchProfileCoefficient?${serialize({
      ...params,
      ...filter,
    })}`,
    {refreshInterval: 0}
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
