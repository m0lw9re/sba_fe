import { appraisalFilesApi } from "apis/appraisalFiles";
import useSWR from "swr";

export const useAppraisalFileDetail = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/bussiness/api/v1/appraisalFiles/${id}` : null,
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
export const useGetDataGrowTable = (assetLandRentFlowDto: any) => {
  const fetcher = async () => {
    const res = await appraisalFilesApi.getDataGrowthTable(assetLandRentFlowDto);
    return res.data;
  }
  const { data, error, isLoading, mutate } = useSWR(
    assetLandRentFlowDto ? `/assets/api/v1/assetLand/growthTable` : null,
    fetcher 
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
export const useAppraisalFileImages = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/bussiness/api/v1/assetImages/${id}` : null,
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
