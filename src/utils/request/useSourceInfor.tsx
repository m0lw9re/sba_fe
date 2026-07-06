import useSWR from "swr";

export const useSourceInfor = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/assets/api/v1/sourceInfo",
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
