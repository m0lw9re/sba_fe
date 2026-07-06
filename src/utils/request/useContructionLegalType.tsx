import useSWR from "swr";

export const useContructionLegalType = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/constructionLegalTypes`,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
