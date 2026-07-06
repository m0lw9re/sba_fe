import useSWR from 'swr';

export const useRoadInPrices = (provinceCode: string | number | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    provinceCode
      ? `/bussiness/api/v1/roadInPrice/get_by_provinceCode/${provinceCode}`
      : null,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    },
  );

  if (data?.code === 400) {
    return {
      data: [],
      error,
      isLoading,
      mutate,
    };  
  }
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
