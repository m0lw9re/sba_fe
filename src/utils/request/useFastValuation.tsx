import useSWR from "swr";
import {serialize} from "utils/validate";

export const useFastValuation = (params: any, filters: any) => {
  const {data, error, isLoading, mutate} = useSWR(
    params && filters
      ? `/assets/api/v1/fastValuation?${serialize({
          ...params,
          ...filters,
        })}`
      : null,
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
