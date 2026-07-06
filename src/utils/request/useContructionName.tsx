import useSWR from "swr";

export const useContructionNames = (constructionType: number | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    constructionType
      ? `/assets/api/v1/constructionNames/${constructionType}`
      : null,
    {
      refreshInterval: 0,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
