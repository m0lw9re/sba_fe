import useSWR from "swr";
import {serialize} from "utils/validate";
import { handleConvertAssetLevelTwoId } from "./useCustomerDocumentType";

export const useCategoryLegalDoc = (params?: any, filter?: any) => {
  const assetLevelTwoId = handleConvertAssetLevelTwoId(params?.assetLevelTwoId)
  const {data, error, isLoading, mutate} = useSWR(
    `/bussiness/api/v1/legalDocumentTypes/search?${serialize({
      ...params,
      ...filter,
      assetLevelTwoId,
    })}`,
    {refreshInterval: 0}
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
