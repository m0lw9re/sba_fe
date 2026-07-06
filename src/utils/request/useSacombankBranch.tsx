import useSWR from "swr";

export const useSacombankBranch = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/branches`,
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
