import useSWR from "swr";

export const useArea = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/commitmentDate/area`,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
