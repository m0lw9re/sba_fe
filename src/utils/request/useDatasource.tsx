import useSWR from "swr";

export const useDataSource = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/assets/api/v1/sourceData",
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
