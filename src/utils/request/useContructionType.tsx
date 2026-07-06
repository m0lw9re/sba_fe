import useSWR from "swr";

export const useContructionType = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/constructionTypes`,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
