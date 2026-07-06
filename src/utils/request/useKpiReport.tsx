import { GetAllCommonType } from "constant/types";
import { FilterReportDetailKPIInMonth, FilterReportDetailKPIInWeek } from "constant/types/reports";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useKpiReportMonth = (params: GetAllCommonType, filter: FilterReportDetailKPIInMonth) => {
  const {data, error, isLoading, mutate} = useSWR(
    `/assets/api/v1/Statistic/KPIReportMonth?${serialize({
      ...params,
      ...filter,
    })}`,
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

export const useKpiReportWeek = (params: GetAllCommonType, filter: FilterReportDetailKPIInWeek) => {
  const {data, error, isLoading, mutate} = useSWR(
    `/assets/api/v1/Statistic/KPIReportWeek?${serialize({
      ...params,
      ...filter,
    })}`,
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