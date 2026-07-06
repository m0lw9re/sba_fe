import useSWR from "swr";

export const useSacombankUnit = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/common/unit`,
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
