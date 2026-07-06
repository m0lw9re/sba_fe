import useSWR from "swr";

export const useCustomerType = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/customerTypes`,
    { 
      refreshInterval: 0,
      revalidateOnFocus: false,
      limit: 100,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
