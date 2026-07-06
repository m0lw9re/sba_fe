import useSWR from "swr";

export const useRefuseToPrice = (appraisalFileId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/appraisalHistoryRefusal/${appraisalFileId}`,
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
