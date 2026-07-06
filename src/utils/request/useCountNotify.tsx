import useSWR from "swr";

export const useCountNotify = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/bussiness/api/v1/filestatushistory/countnotseen",
    {
      refreshInterval: 30000,
    }
  );
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
