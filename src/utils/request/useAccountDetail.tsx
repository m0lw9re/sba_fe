import useSWR from "swr";

export const useAccountDetail = (username: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    username ? `/admin/api/v1/staff?username=${username}` : null,
    {
      refreshInterval: 0,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
