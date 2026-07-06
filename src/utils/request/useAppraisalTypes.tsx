import useSWR from "swr";

export const useAppraisalTypes = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/appraisalTypes`,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
