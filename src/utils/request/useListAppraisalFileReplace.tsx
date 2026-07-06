import useSWR from "swr";
import { serialize } from "utils/validate";

export const useListAppraisalFileReplace = (params: {
  customerId?: string;
  branchId?: string;
}) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/feeNotification/get_all_paid?${serialize(params)}`,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
