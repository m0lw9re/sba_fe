import useSWR from "swr";

export const useCategoryConfigApprove = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/approvalConfigs`,
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
