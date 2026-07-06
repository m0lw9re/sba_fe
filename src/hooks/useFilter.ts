import { useState, useEffect } from "react";

interface FilterData {
  params: {
    limit: number;
    page: number;
  };
  filters: Record<string, any>;
}

const useFilter = (
  initialParams: { limit: number; page: number } | null,
  initialFilters: Record<string, any>,
  filterName: string
) => {
  const [filterDataCustom, setFilterDataCustom] = useState<FilterData>(() => {
    const storedFilterDataCustom = sessionStorage.getItem(filterName);
    if (storedFilterDataCustom) {
      return JSON.parse(storedFilterDataCustom);
    } else {
      return {
        params: initialParams || { limit: 5, page: 1 },
        filters: initialFilters,
      };
    }
  });

  useEffect(() => {
    const storedFilterDataCustom = sessionStorage.getItem(filterName);
    if (storedFilterDataCustom) {
      const parsedData = JSON.parse(storedFilterDataCustom);
      if (
        (JSON.stringify(parsedData.params) !== JSON.stringify(initialParams) ||
          JSON.stringify(parsedData.filters) !==
            JSON.stringify(initialFilters)) &&
        ((!!initialFilters &&
          Object.values(initialFilters).some(
            (value) => value !== null && value !== undefined
          )) ||
          (initialParams?.page !== undefined &&
            initialParams?.limit !== undefined &&
            initialParams?.limit >= 5))
      ) {
        setFilterDataCustom({
          params: initialParams || { limit: 5, page: 1 },
          filters: initialFilters,
        });
      }
    }
  }, [initialParams, initialFilters, filterName]);

  useEffect(() => {
    sessionStorage.setItem(filterName, JSON.stringify(filterDataCustom));
  }, [filterDataCustom, filterName]);

  return { filterDataCustom };
};

export default useFilter;
