import useSWR from "swr";

export const useCategoryFeeType = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/bussiness/api/v1/feeTypes",
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
