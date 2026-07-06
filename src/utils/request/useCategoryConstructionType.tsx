import useSWR from "swr";
import { serialize } from "utils/validate";
export const useCategoryConstructionType = (params?: any, filter?: any) => {
  const strParam = !filter.isActive ? `&isActive=` : "";
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/constructionTypes/search?${serialize({
      ...params,
      ...filter,
    })}${strParam}`,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
