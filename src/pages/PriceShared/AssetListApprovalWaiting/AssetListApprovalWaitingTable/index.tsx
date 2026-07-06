/* eslint-disable react/jsx-pascal-case */
import { Button, Card, message, Space, Typography } from "antd";
import { compareAssetsAPI } from "apis/compareAssets";
import Icons from "assets/icons";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import { ASSET_PRICES_SHARED_TYPE, BUTTON_CODES } from "constant/common";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { FilterSpecificPricesType } from "constant/types";
import { CommonGetAllParams } from "constants/types/common.type";
import BlockUser from "pages/BlockUser";
import ConfirmApproveModal from "pages/PriceShared/ApproveDenyAsset/subcomponents/ConfirmApproveModal";
import "pages/PriceShared/AssetListApprovalWaiting/AssetListApprovalWaitingTable/style.scss";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { useStoredDenyAssets } from "utils/request/usePriceAssets";
import {
  defaulColumns,
  defaulColumnsApartment,
  defaultColumnsMoveableAsset,
} from "./config";
import TableCustomWithoutCustomSelection from "components/TableRoles";

type Props = {
  filters: FilterSpecificPricesType;
  setFilters: (filter: FilterSpecificPricesType) => void;
};

const AssetListApprovalWaitingTable: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Array<string>>();
  const [columns, setColumns] = useState<any>(null);
  const [modalParams, setModalParams] = useState<{
    isOpen: boolean;
    type: "approve" | "deny";
    selectedRow: any;
  }>({
    isOpen: false,
    type: "approve",
    selectedRow: {},
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // rows selected by checkbox
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  // row selected by click actions

  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  const isRoleCanApproved =
    roles?.includes("ROLE_ADMIN") ||
    roles?.includes("ROLE_PTGĐ") ||
    roles?.includes("ROLE_TGĐ") ||
    roles?.includes("ROLE_GĐCN") ||
    roles?.includes("ROLE_TPTĐG") ||
    roles?.includes("ROLE_TPTGĐ") ||
    roles?.includes("ROLE_PPTĐG") ||
    roles?.includes("ROLE_TPCNHN") ||
    roles?.includes("ROLE_TBP") ||
    roles?.includes("ROLE_PGĐCN") ||
    roles?.includes("ROLE_CVC");

  const prevParamsRef = useRef<any>(params);

  const { data, isLoading, mutate } = useStoredDenyAssets(
    { ...params, page: params?.page ? params.page - 1 : 0 },
    filters
  );

  const handleCloseModal = () => {
    setModalParams({ ...modalParams, isOpen: false });
  };

  const handleOpenModal = (type: "approve" | "deny", record: any) => {
    if (type === "approve") {
      setModalParams({ type: "approve", isOpen: true, selectedRow: record });
    } else setModalParams({ type: "deny", isOpen: true, selectedRow: record });
  };

  const handleApproveOrDeny = async () => {
    if (modalParams.selectedRow && modalParams.selectedRow?.assetId) {
      try {
        const response = await compareAssetsAPI.updateStoredAsset(
          {
            ...modalParams.selectedRow,
            approved: modalParams.type === "approve" ? true : false,
          },
          filters.assetType as number
        );
        if (response?.data?.code === 200) {
          modalParams.type === "approve"
            ? message.success(`Phê duyệt ${response.data.message}`)
            : message.success(`Từ chối ${response.data.message}`);
          mutate();
        } else {
          modalParams.type === "approve"
            ? message.success(`Phê duyệt ${response.data.message}`)
            : message.success(`Từ chối ${response.data.message}`);
        }
      } catch {
        modalParams.type === "approve"
          ? message.error(`Phê duyệt thất bại`)
          : message.error(`Từ chối thất bại`);
      }
      handleCloseModal();
    }
  };

  const dataTable = data?.data
    ? data.data.map((item: any) => {
        return {
          ...item,
          storedType: "Tài sản so sánh",
          key: item.assetId,
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
  const approvedAllFunction = async () => {
    if (selectedRows.length > 0) {
      const data = selectedRows?.map((row) => ({
        ...row,
        approved: true,
      }));
      try {
        const response = await compareAssetsAPI.updateStoredAssets(
          data,
          filters.assetType as number
        );
        if (response?.data?.code === 200) {
          message.success(`Phê duyệt ${response.data.message}`);
          mutate();
        } else {
          message.error(`Phê duyệt ${response.data.message}`);
        }
      } catch {
        message.error("Phê duyệt thất bại");
      }
    } else {
      message.warning(`Bạn chưa chọn tài sản để phê duyệt`);
    }
  };

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    newSelectedRow: any[]
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRow);
  };

  useEffect(() => {
    setRoles(
      getRoleAccount(localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)) || []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
              ...(!isRoleCanApproved ? { width: "100px" } : { width: "220px" }),
              render: (_: any, record: any) => (
                <Space size={"middle"}>
                  {isRoleCanApproved && (
                    <>
                      <Button
                        type="link"
                        disabled={record.approved !== null && record.approved}
                        className="text-actions"
                        style={{ color: "#2862AF" }}
                        onClick={() => {
                          handleOpenModal("approve", record);
                        }}
                      >
                        Duyệt
                      </Button>

                      <Button
                        type="link"
                        disabled={record.approved !== null && record.approved}
                        className="text-actions"
                        style={{ color: "#F25B60" }}
                        onClick={() => {
                          handleOpenModal("deny", record);
                        }}
                      >
                        Từ chối
                      </Button>
                    </>
                  )}
                  <>
                    <Icons.eyeOutlined
                      onClick={() => {
                        handleNavigateToApprovedPage(record);
                      }}
                    />
                  </>
                </Space>
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
                <Space size={"middle"}>
                  {isRoleCanApproved && (
                    <>
                      <Button
                        type="link"
                        disabled={record.approved !== null && record.approved}
                        className="text-actions"
                        style={{ color: "#2862AF" }}
                        onClick={() => {
                          handleOpenModal("approve", record);
                        }}
                      >
                        Duyệt
                      </Button>

                      <Button
                        type="link"
                        disabled={record.approved !== null && record.approved}
                        className="text-actions"
                        style={{ color: "#F25B60" }}
                        onClick={() => {
                          handleOpenModal("deny", record);
                        }}
                      >
                        Từ chối
                      </Button>
                    </>
                  )}
                  {(roles?.includes("ROLE_CBTH") ||
                    roles?.includes("ROLE_CVTD") ||
                    roles?.includes("ROLE_ADMIN")) && (
                    <>
                      <Icons.eyeOutlined
                        onClick={() => {
                          handleNavigateToApprovedPage(record);
                        }}
                      />
                    </>
                  )}
                </Space>
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
                <Space size={"middle"}>
                  {isRoleCanApproved && (
                    <>
                      <Button
                        type="link"
                        disabled={record.approved !== null && record.approved}
                        className="text-actions"
                        style={{ color: "#2862AF" }}
                        onClick={() => {
                          handleOpenModal("approve", record);
                        }}
                      >
                        Duyệt
                      </Button>
                      <Button
                        type="link"
                        disabled={record.approved !== null && record.approved}
                        className="text-actions"
                        onClick={() => {
                          handleOpenModal("deny", record);
                        }}
                        style={{ color: "#F25B60" }}
                      >
                        Từ chối
                      </Button>
                    </>
                  )}
                  {(roles?.includes("ROLE_CBTH") ||
                    roles?.includes("ROLE_CVTD") ||
                    roles?.includes("ROLE_ADMIN")) && (
                    <>
                      <Icons.eyeOutlined
                        onClick={() => {
                          handleNavigateToApprovedPage(record);
                        }}
                      />
                    </>
                  )}
                </Space>
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
            title="Danh sách chờ phê duyệt"
            approvedFunction={
              isRoleCanApproved ? approvedAllFunction : undefined
            }
            approvedButtonCode={BUTTON_CODES.dscd_duyet_all}
          />
          <ConfirmApproveModal
            closeModal={handleCloseModal}
            handleConfirm={handleApproveOrDeny}
            isOpen={modalParams.isOpen}
            type={modalParams.type}
          />
        </div>
        <TableCustomWithoutCustomSelection
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
          // get selected row
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
            columnWidth: "35px",
          }}
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

export default AssetListApprovalWaitingTable;
