import useSWR from "swr";

export const useCategorySlaDetail = (appraisalFileId?: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    appraisalFileId
      ? `/assets/api/v2/statistic/sla_report_detail?appraisalFileId=${appraisalFileId}`
      : null,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
