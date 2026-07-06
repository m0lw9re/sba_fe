import useSWR from "swr";
import {serialize} from "utils/validate";
export const useCategoryInvest = (params?: any, filter?: any) => {
  const {data, error, isLoading, mutate} = useSWR(
    `/assets/api/v1/constructionNames?${serialize({
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
