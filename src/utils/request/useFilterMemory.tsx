import { useEffect, useRef, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";

const useAppraisalTableParams = (
  filters: any,
  setFilters: any,
  paramsProps: any
) => {
  const [filterData, setFilterData] = useState<any>({});
  const [filtersStorage, setFiltersStorage] = useState<any>({});

  // --------------Filter---------------

  useEffect(() => {
    if (filtersStorage) {
      setFilterData((prevFilterData: any) => ({
        ...prevFilterData,
        ...filtersStorage,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersStorage]);

  const mutate = () => {
    const fetchData = async () => {
      const storedParams = localStorage.getItem(
        LOCAL_STORAGE_KEY.APPRAISAL_GIVE
      );

      let currentKey = window.history.state?.key;
      let prevKey;

      // Set prevKey in the first run
      if (!localStorage.getItem(LOCAL_STORAGE_KEY.APPRAISAL_KEY)) {
        localStorage.setItem(
          LOCAL_STORAGE_KEY.APPRAISAL_KEY,
          JSON.stringify({ prevKey: null })
        );
      }

      // Get prevKey from localStorage and parse it as JSON
      prevKey = localStorage.getItem(LOCAL_STORAGE_KEY.APPRAISAL_KEY);
      prevKey = prevKey !== null ? JSON.parse(prevKey) : null;

      // Log previous key and current key
      // console.log("Prev key: ", prevKey?.prevKey);
      // console.log("Current key: ", currentKey);

      // Update prevKey with currentKey
      localStorage.setItem(
        LOCAL_STORAGE_KEY.APPRAISAL_KEY,
        JSON.stringify({ prevKey: currentKey })
      );

      if (currentKey && currentKey === prevKey?.prevKey) {
        if (storedParams && storedParams !== "{}") {
          try {
            const parsedParams = JSON.parse(storedParams);
            setFiltersStorage((prevFilterData: any) => ({
              ...prevFilterData,
              ...parsedParams,
              isFiltering: false,
            }));
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY.APPRAISAL_GIVE);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.APPRAISAL_GIVE);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const handleDebouncedChange = (value: any) => {
      setFilters({
        ...filters,
        ...value,
      });
      localStorage.setItem(
        LOCAL_STORAGE_KEY.APPRAISAL_GIVE,
        JSON.stringify({
          ...filters,
          ...value,
        })
      );
    };
    const timer = setTimeout(() => {
      handleDebouncedChange(filterData);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  // --------------Table---------------

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY.PAGE_PARAMS,
      JSON.stringify({ limit: paramsProps.limit, page: paramsProps.page })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsProps]);

  const [params, setParams] = useState<any>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  const prevParamsRef = useRef<any>(params);
  useEffect(() => {
    if (filters.isFiltering) {
      setParams({ ...params, page: 1 });
      setFilters({
        ...filters,
        isFiltering: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);
  useLayoutEffect(() => {
    if (
      params?.page !== undefined &&
      params?.page > 1 &&
      params?.limit !== undefined &&
      params?.limit >= 5 &&
      params.limit !== prevParamsRef.current.limit
    ) {
      setParams({
        ...params,
        limit: params.limit,
        page: 1,
      });
    }
  }, [params]);

  useEffect(() => {
    prevParamsRef.current = params;
    const storedParams = localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_PARAMS);
    if (storedParams && storedParams !== "{}") {
      try {
        const parsedParams = JSON.parse(storedParams);
        setParams({
          ...params,
          limit: parsedParams.limit,
          page: parsedParams.page,
        });
        localStorage.removeItem(LOCAL_STORAGE_KEY.PAGE_PARAMS);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, [params]);

  return { filters, setFilters, params, mutate };
};

export default useAppraisalTableParams;
