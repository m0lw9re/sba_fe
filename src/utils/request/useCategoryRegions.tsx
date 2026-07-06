import useSWR from 'swr';

export const useCategoryRegions = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/companyBranch/getAll`,
    { refreshInterval: 0 },
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
