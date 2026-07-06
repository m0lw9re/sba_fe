import useSWR from "swr";

export const useBussinessAdvance = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/assets/api/v1/bussinessAdvantages",
    { refreshInterval: 0 }
  );
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
