import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useAppraisalFiles = (
  params?: CommonGetAllParams,
  filter?: any,
  type?: "receive" | "send" // receive - đến; send - đi; undefined - all
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `${!type
      ? "/bussiness/api/v1/appraisalFiless/staff/search?"
      : `/bussiness/api/v1/appraisalFiless/staff/${type}?`
    }${serialize({
      ...params,
      ...filter,
      platform: 'web'
    })}`,
    { refreshInterval: 30000 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
