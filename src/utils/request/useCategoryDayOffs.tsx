import { FiltersCategoryDayOffsType } from 'constant/types/categories';
import { CommonGetAllParams } from 'constants/types/common.type';
import useSWR from 'swr';
import { serialize } from 'utils/validate';

export const useCategoryDayOffs = (
  params?: CommonGetAllParams,
  filter?: FiltersCategoryDayOffsType,
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/api/v1/holidayInYear/search?${serialize({
      ...params,
      ...filter,
    })}`,
    { refreshInterval: 0 },
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
