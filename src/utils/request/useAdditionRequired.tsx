import useSWR from "swr";

export const useAdditionRequired = (appraisalFileId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    appraisalFileId ? `/bussiness/api/v1/historyRequestRecords?appraisalFileId=${appraisalFileId}` : null,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
