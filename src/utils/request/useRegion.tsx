import useSWR from "swr";

export const useRegion = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/Region/getAll`,
    { 
      refreshInterval: 0,
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
