import {GetAllCommonType} from "constant/types";
import useSWR from "swr";
import {serialize} from "utils/validate";

export const useEmplKPIs = (params?: GetAllCommonType, filter?: any) => {
  const {data, error, isLoading, mutate} = useSWR(
    `/assets/api/v1/EmpKpiGroup?${serialize({
      ...params,
      ...filter,
    })}`,
    {
      refreshInterval: 0,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
