import { CommonGetAllParams } from 'constants/types/common.type';
import { FilterStaffType } from 'constant/types';
import useSWR from 'swr';
import { serialize } from 'utils/validate';
import { isNumber } from 'lodash';

export const useStaffs = (
  params?: CommonGetAllParams,
  filter?: FilterStaffType,
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/api/v1/staffs/search?${serialize({
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

export const useStaffCanSign = (params: {
  companyBranchId: number;
  totalPrice: number;
}) => {
  const { data, error, isLoading, mutate } = useSWR(
    params.companyBranchId && isNumber(params.totalPrice)
      ? `/bussiness/api/v1/appraisalFiles/staffCanSign?${serialize({
          ...params,
        })}`
      : null,
    { refreshInterval: 0 },
  );
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
