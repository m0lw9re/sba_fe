import useSWR from "swr";

export const useAddressProvince = () => {
  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR(`/bussiness/api/v1/provinces`, { 
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
