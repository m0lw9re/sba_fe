import { dayOffVacation as dayOffVacationType } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useDayOffCalender = (params?: dayOffVacationType) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/api/v1/vacationDay/search?${serialize({
      ...params,
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
