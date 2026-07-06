import useSWR from "swr";

export const useFeeScheduleNew = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/find/shedule-id-new`,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
