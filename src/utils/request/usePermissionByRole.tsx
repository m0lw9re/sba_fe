import useSWR from "swr";

export const usePermissionByRole = (role_code: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/api/v1/role/${role_code}`,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
