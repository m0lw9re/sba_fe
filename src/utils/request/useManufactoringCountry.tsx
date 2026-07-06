import useSWR from "swr";

export const useManufactoringCountry = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/countrys/search`,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
