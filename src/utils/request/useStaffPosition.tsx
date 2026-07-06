import useSWR from "swr";

export const useStaffPosition = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/api/v1/staffPositions`,
    { refreshInterval: 0 }
  );
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
