import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UNIDENTIFIED_PROFILE } from "routes/route.constant";
import "./style.scss";
import Filter from "./components/Filter";
import Table from "./components/Table";
import {
  AccDataDto,
  GenericDataTable,
} from "../../constant/types/appraisalFilesDetail";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "../../constant/enums";
import { appraisalFilesApi } from "../../apis/appraisalFiles";
import { RootState } from "../../configs/configureStore";
import { message } from "antd";

export const initDataTable: GenericDataTable = {
  data: [],
  limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
    ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
    : PAGE_SIZE_OPTIONS.OPTION_10,
  page: 1,
  total: 0,
};
const AccountantFeeNotificationsUpdate = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<AccDataDto>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
    statusEms: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataTable, setDataTable] = useState(initDataTable);
  const isReloadTable = useSelector(
    (state: RootState) => state.appSlice.isReloadTable
  );

  useEffect(() => {
    fetchData();
  }, [isReloadTable, filters]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await appraisalFilesApi.getAccFromEMS(filters);
      if (res.status) {
        let data = res.data.data?.map((item: any, index: number) => {
          return {
            ...item,
            key: index + res.data.page * res.data.limit,
          };
        });
        setDataTable({ ...res.data, data: data });
      }
    } catch (error) {
      message.error("Lỗi hệ thống");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Hồ sơ chưa xác định",
        path: UNIDENTIFIED_PROFILE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [UNIDENTIFIED_PROFILE]);

  return (
    <div className="page-container">
      <div style={{ marginBottom: "8px" }}>
        <Filter filters={filters} setFilters={setFilters} />
      </div>
      <Table
        filters={filters}
        setFilters={setFilters}
        setIsLoading={setIsLoading}
        dataTable={dataTable}
        setDataTable={setDataTable}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AccountantFeeNotificationsUpdate;