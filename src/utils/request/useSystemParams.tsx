import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { serialize } from "utils/validate";
import {FilterSystemParamsType } from "constant/types/system";

export const useSystemParams = (
  params?: CommonGetAllParams,
  filter?: FilterSystemParamsType
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `${"/admin/api/v1/systemParameters/search?"}${serialize({
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
