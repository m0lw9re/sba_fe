import useSWR from "swr";

export const useFileStates = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/filesStates`,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
