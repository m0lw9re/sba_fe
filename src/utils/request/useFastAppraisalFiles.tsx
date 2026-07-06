import { FilterAppraisalFileType } from "constant/types/appraisalFile";
import { GetAllCommonType } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useFastAppraisalFiles = (
  params?: GetAllCommonType,
  filter?: FilterAppraisalFileType
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/assetApartmentDGN/get_paging?${serialize({
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
