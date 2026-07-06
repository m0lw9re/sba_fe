import { FilterQuantityCancelFileArisingInMonth } from "constant/types";
import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { configFilterAppraisalFile } from "utils/string";
import { serialize } from "utils/validate";

export const useRecordArise = (
  params?: CommonGetAllParams,
  filter?: any,
  type?: "search" | "cancel"
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `${
      type === "search"
        ? "/bussiness/api/v1/recordArise/search?"
        : "/bussiness/api/v1/recordArise/searchCancel?"
    }${serialize({
      ...params,
      ...configFilterAppraisalFile(filter),
    })}`,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
