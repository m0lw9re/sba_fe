import useSWR from 'swr';

export const useApproval = (id: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/bussiness/api/v1/approvalSubmission/${id}` : null,
    { refreshInterval: 0 },
  );

  return {
    data : data?.data || null,
    error,
    isLoading,
    mutate,
  };
};
