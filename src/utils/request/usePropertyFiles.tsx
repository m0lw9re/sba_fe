import useSWR from "swr";

export const usePropertyFiles = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/bussiness/api/v1/fileBehaviors",
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
