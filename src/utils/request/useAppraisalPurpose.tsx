import useSWR from "swr";

export const useAppraisalPurpose = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/appraisalPurposes`,
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
