import useSWR from "swr";

export const useAssignments = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/bussiness/api/v1/assignments/${id}` : null,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
