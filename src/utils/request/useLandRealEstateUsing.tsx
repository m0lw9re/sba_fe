import useSWR from "swr";

export const useLandRealEstateUsing = (params: {
  directionId: number;
  page: number;
}) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/usingPurpose/get_all?direction=${params.directionId}&page=${params.page}`,
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
