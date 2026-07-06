import useSWR from "swr";

export const useRepairHistory = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/repairStatus`,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
