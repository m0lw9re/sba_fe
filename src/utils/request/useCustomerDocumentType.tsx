import { FilterLegalDocumentType } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const handleConvertAssetLevelTwoId = (
  assetLevelTwoId: number | null
) => {
  // bds, chcc, dự án, dự toán chung
  if (
    assetLevelTwoId === 1 ||
    assetLevelTwoId === 2 ||
    assetLevelTwoId === 9 ||
    assetLevelTwoId === 8
  ) {
    return 1;
  }
  // mmtb, hàng hóa chung
  if (assetLevelTwoId === 7) {
    return 6;
  }
  // ptdb
  if (assetLevelTwoId === 3 || assetLevelTwoId === 4 || assetLevelTwoId === 5) {
    return assetLevelTwoId;
  }
  return assetLevelTwoId;
};

export const useCustomerDocumentType = (params: FilterLegalDocumentType) => {
  const assetLevelTwoId = handleConvertAssetLevelTwoId(params?.assetLevelTwoId);

  const { data, error, isLoading, mutate } = useSWR(
    assetLevelTwoId
      ? `/bussiness/api/v1/legalDocumentTypes?${serialize({
          ...params,
          assetLevelTwoId,
        })}`
      : null,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
