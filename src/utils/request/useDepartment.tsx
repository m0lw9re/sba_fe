import useSWR from "swr";
import { serialize } from "utils/validate";

export const useDepartment = (params?: {
  page?: number;
  limit?: number;
  keyword?: string;
}) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/api/v1/departments?${serialize({
      ...params,
      limit: params?.limit || 9999,
    })}`,
    { refreshInterval: 0 },
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
