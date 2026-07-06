import { FilterSlaType } from "constant/types/sla";
import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useCategorySla = (
  params?: CommonGetAllParams,
  filter?: FilterSlaType
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `assets/api/v2/statistic/sla_report?${serialize({
      ...params,
      ...filter,
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
