import useSWR from "swr";

export const useAssetLevelThree = (
  assetLevelTwo: number | null,
  isActivate?: "true" | "false" //măck định k cần (true và không truyền cho KQ giống nhau. False: lấy tất cả bản ghi)
) => {
  const { data, error, isLoading, mutate } = useSWR(
    assetLevelTwo
      ? `/assets/api/v1/assetLevelThree/get_by_asset_level_two/${assetLevelTwo}${
          isActivate ? `?isActive=${isActivate}` : ""
        }`
      : null,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
