import useSWR from "swr";

export const useWheelFormulas = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/assets/api/v1/wheelFormulas",
    { refreshInterval: 0 }
  );
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
