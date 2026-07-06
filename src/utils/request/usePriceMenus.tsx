import useSWR from "swr";

export const usePriceMenus = (levelOneId: string) => {
  const {
    data: levelTwoData,
    isLoading: loadingLevelTwo,
    error: errorLevelTwo,
    mutate: mutateLevelTwo,
  } = useSWR(
    levelOneId ? 
      `/assets/api/v1/assetLevelTwo/get_by_asset_level_one/${levelOneId}`
      : null,
    { refreshInterval: 0 }
  );

  const {
    data: levelThreeData,
    isLoading: loadingLevelThree,
    error: errorLevelThree,
    mutate: mutateLevelThree,
  } = useSWR(`/assets/api/v1/assetLevelThree/get_all`, { refreshInterval: 0 });

  const mergeMenu = () => {
    if (levelTwoData && levelThreeData) {
      const levelTwoArray = [...levelTwoData];
      levelTwoArray.forEach((elementLevelTwo: any) => {
        const levelThreeArray = levelThreeData.filter(
          (elementLevelThree: any) =>
            elementLevelThree.assetLevelTwoId ===
            elementLevelTwo.assetLevelTwoId
        );

        elementLevelTwo.children = [...levelThreeArray];
      });

      return levelTwoArray;
    }
    return [];
  };

  const data = mergeMenu();

  return {
    data: data,
    error: { errorLevelTwo, errorLevelThree },
    isLoading: { loadingLevelTwo, loadingLevelThree },
    mutate: { mutateLevelTwo, mutateLevelThree },
  };
};
