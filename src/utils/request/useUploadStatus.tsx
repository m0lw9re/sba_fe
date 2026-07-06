import useSWR from "swr";

export const useUploadStatus = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `report/api/v1/report/upload_status?appraisalFileId=${id}` : null,
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
