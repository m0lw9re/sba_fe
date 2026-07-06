import useSWR from "swr";

export const useTransactionOfficeSacombank = (branchCode: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    branchCode ? `/bussiness/api/v1/transactionOffices/${branchCode}` : null,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
