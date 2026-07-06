import { FilterChartQuantityFileArising } from 'constant/types';
import useSWR from 'swr';
import { serialize } from 'utils/validate';

export const useReportMonthlyArising = (filters?: FilterChartQuantityFileArising) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/recordArise/chart?${serialize({
      ...filters,
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
