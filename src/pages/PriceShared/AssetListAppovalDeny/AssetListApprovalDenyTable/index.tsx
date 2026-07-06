/* eslint-disable react/jsx-pascal-case */
import { Card, message, Typography } from "antd";
import { compareAssetsAPI } from "apis/compareAssets";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import { RootState } from "configs/configureStore";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { FilterSpecificPricesType } from "constant/types";
import { CommonGetAllParams } from "constants/types/common.type";
import BlockUser from "pages/BlockUser";
import "pages/PriceShared/AssetListApprovalWaiting/AssetListApprovalWaitingTable/style.scss";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  PRICE_SHARED_APPROVE_APPARTMENT,
  PRICE_SHARED_APPROVE_DEVICE,
  PRICE_SHARED_APPROVE_ESTIMATE,
  PRICE_SHARED_APPROVE_LAND_USING,
  PRICE_SHARED_APPROVE_PROJECT,
  PRICE_SHARED_APPROVE_ROADVEHICLE,
  PRICE_SHARED_APPROVE_WATERVEHICLE,
} from "routes/route.constant";
import { randomId } from "utils";
import { getRoleAccount } from "utils/common";
import { useStoredAsset } from "utils/request";
import {
  defaulColumns,
  defaulColumnsApartment,
  defaultColumnsMoveableAsset,
} from "./config";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";

type Props = {
  filters: FilterSpecificPricesType;
  setFilters: (filter: FilterSpecificPricesType) => void;
};

const AssetListApprovalDenyTable: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Array<string>>();
  const [columns, setColumns] = useState<any>(null);

  useEffect(() => {
    setRoles(
      getRoleAccount(localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)) || []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const prevParamsRef = useRef<any>(params);

  useEffect(() => {
    setParams({ ...params, page: 1 });
    setFilters({
      ...filters,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

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
  }, [params]);

  const { data, isLoading, mutate } = useStoredAsset(
    { ...params, page: params?.page ? params.page - 1 : 0 },
    {
      ...filters,
      approved: false,
    }
  );

  const dataTable = data?.data
    ? data.data.map((item: any) => {
        return {
          ...item,
          storedType: "Tài sản so sánh",
          key: randomId(),
        };
      })
    : [];

  const handleNavigateToApprovedPage = (record: any) => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY.PAGE_PARAMS,
      JSON.stringify({ limit: params.limit, page: params.page })
    );
    try {
      if (!record && !record?.assetId) {
        throw new Error();
      }

      if (filters.assetType === ASSET_PRICES_SHARED_TYPE.PLAN_USING) {
        navigate(
          PRICE_SHARED_APPROVE_LAND_USING.replace(":id", record.assetId)
        );
      } else if (filters.assetType === ASSET_PRICES_SHARED_TYPE.PROJECT) {
        navigate(PRICE_SHARED_APPROVE_PROJECT.replace(":id", record.assetId));
      } else if (filters.assetType === ASSET_PRICES_SHARED_TYPE.ESTIMATE) {
        navigate(PRICE_SHARED_APPROVE_ESTIMATE.replace(":id", record.assetId));
      } else if (filters.assetType === ASSET_PRICES_SHARED_TYPE.APARTMENT) {
        navigate(
          PRICE_SHARED_APPROVE_APPARTMENT.replace(":id", record.assetId)
        );
      } else if (filters.assetType === ASSET_PRICES_SHARED_TYPE.ROAD_VEHICLE) {
        navigate(
          PRICE_SHARED_APPROVE_ROADVEHICLE.replace(":id", record.assetId)
        );
      } else if (
        filters.assetType === ASSET_PRICES_SHARED_TYPE.WATERWAY_VEHICLE
      ) {
        navigate(
          PRICE_SHARED_APPROVE_WATERVEHICLE.replace(":id", record.assetId)
        );
      } else if (filters.assetType === ASSET_PRICES_SHARED_TYPE.DEVICE) {
        navigate(PRICE_SHARED_APPROVE_DEVICE.replace(":id", record.assetId));
      } else {
        throw new Error();
      }
    } catch (error) {
      message.error("Không tìm loại hình tài sản này.");
      navigate("/");
    }
  };

  const reviseFunction = async (record : any) => {
    if(filters.assetType){
      const response = await compareAssetsAPI.updateStoredAsset(
        {
          ...record,
          approved: null
        },
        filters.assetType,
      );
      if (response.data.code === 200) {
        message.success(`Gửi duyệt lại ${response.data.message}`);
        return response.data.data;
      } else {
        message.error(`Gửi duyệt lại ${response.data.message}`);
        throw new Error(`Gửi duyệt lại ${response.data.message}`);
      }
    }
  }

  useEffect(() => {
    if (roles) {
      // table columns for BĐS
      if (
        filters.assetType === 0 ||
        filters.assetType === 5 ||
        filters.assetType === 6
      ) {
        let columns = defaulColumns.map((item) => {
          if (item.key === 1) {
            return {
              ...item,
              render: (_: any, record: any, index: any) => {
                return (
                  (Number(params.page) - 1) * Number(params.limit) + index + 1
                );
              },
            };
          } else if (item.key === "actions") {
            return {
              ...item,
              render: (_: any, record: any) => (
                <>
                  <ListButtonActionUpdate
                    editFunction={() => {
                      handleNavigateToApprovedPage(record);
                    }}
                    reviseFunction={() => {}}
                  />
                </>
              ),
            };
          } else if (item.key === 2) {
            return {
              ...item,
              render: (_: any, record: any) => (
                <>
                  <Typography.Link
                    onClick={() => {
                      handleNavigateToApprovedPage(record);
                    }}
                    underline
                  >
                    {record?.assetCode}
                  </Typography.Link>
                </>
              ),
            };
          } else if (item.key === 3) {
            return {
              ...item,
              render: (_: any, record: any) => (
                <>
                  <Typography.Link
                    underline
                    onClick={() => {
                      handleNavigateToApprovedPage(record);
                    }}
                  >
                    {record?.climsCode}
                  </Typography.Link>
                </>
              ),
            };
          } else return item;
        });
        setColumns(columns);
      }
      // table columns for CHCC
      else if (filters.assetType === 1) {
        let columns = defaulColumnsApartment.map((item) => {
          if (item.key === 1) {
            return {
              ...item,
              render: (_: any, record: any, index: number) => {
                return (
                  (Number(params.page) - 1) * Number(params.limit) + index + 1
                );
              },
            };
          } else if (item.key === "actions") {
            return {
              ...item,
              render: (_: any, record: any) => (
                <ListButtonActionUpdate
                  editFunction={() => {
                    handleNavigateToApprovedPage(record);
                  }}
                  reviseFunction={() => {}}
                />
              ),
            };
          } else if (item.key === 2) {
            return {
              ...item,
              render: (_: any, record: any) => (
                <>
                  <Typography.Link
                    onClick={() => {
                      handleNavigateToApprovedPage(record);
                    }}
                    underline
                  >
                    {record?.assetCode}
                  </Typography.Link>
                </>
              ),
            };
          } else if (item.key === 3) {
            return {
              ...item,
              render: (_: any, record: any) => (
                <>
                  <Typography.Link
                    underline
                    onClick={() => {
                      handleNavigateToApprovedPage(record);
                    }}
                  >
                    {record?.climsCode}
                  </Typography.Link>
                </>
              ),
            };
          } else return item;
        });
        setColumns(columns);
      } else if (
        filters.assetType === ASSET_PRICES_SHARED_TYPE.ROAD_VEHICLE ||
        filters.assetType === ASSET_PRICES_SHARED_TYPE.WATERWAY_VEHICLE ||
        filters.assetType === ASSET_PRICES_SHARED_TYPE.DEVICE
      ) {
        let columns = defaultColumnsMoveableAsset.map((item: any) => {
          if (item.key === 1) {
            return {
              ...item,
              render: (_: any, record: any, index: number) => {
                return (
                  (Number(params.page) - 1) * Number(params.limit) + index + 1
                );
              },
            };
          } else if (item.key === "actions") {
            return {
              ...item,
              render: (_: any, record: any) => (
                <>
                  <ListButtonActionUpdate
                    editFunction={() => handleNavigateToApprovedPage(record)}
                    reviseFunction={() => {
                      reviseFunction(record);
                    }}
                  />
                </>
              ),
            };
          } else if (item.dataIndex === "assetCode") {
            return {
              ...item,
              render: (_: any, record: any) => (
                <>
                  <Typography.Link
                    onClick={() => {
                      handleNavigateToApprovedPage(record);
                    }}
                    underline
                  >
                    {record?.assetCode}
                  </Typography.Link>
                </>
              ),
            };
          } else return item;
        });
        setColumns(columns);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.assetType, roles, params]);

  if (data?.code === 403) {
    return <BlockUser />;
  }
  return (
    <div className="asset-list-approval-waiting-table-container">
      <Card className="card-container" size="small">
        <div style={{ marginBottom: "4px" }}>
          <CardTitleCustomUpdate
            title="Danh sách từ chối"
          />
        </div>
        <TableCustom
          dataSource={dataTable}
          columns={columns}
          bordered
          isLoading={!data && columns && isLoading}
          limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
          total={data ? data.totalCount : 0}
          onLimitChange={(limit) => {
            setParams({ ...params, limit });
          }}
          onPageChange={(page) => {
            setParams({ ...params, page });
          }}
          onSorterChange={(sorter) => {
            setParams((prev: any) => ({
              ...prev,
              sortField: sorter?.sortBy,
              direction: sorter?.sortType === "ASC" ? 0 : 1,
            }));
          }}
          page={params?.page ? params.page : 1}
          scroll={{ x: 2400 }}
          isRowSelection={true}
          onRow={(record, rowIndex) => {
            return {
              onDoubleClick: (e) => handleNavigateToApprovedPage(record),
            };
          }}
        />
      </Card>
    </div>
  );
};

export default AssetListApprovalDenyTable;
