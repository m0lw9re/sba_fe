import useSWR from "swr";

export const useCompanyBranch = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/common/companyBranchs`,
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
