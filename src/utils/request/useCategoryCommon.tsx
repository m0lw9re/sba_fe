import useSWR from "swr";
import { serialize } from "utils/validate";

export const useCategoryCommon = (filter?: any) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/commonCategory?${serialize({
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
