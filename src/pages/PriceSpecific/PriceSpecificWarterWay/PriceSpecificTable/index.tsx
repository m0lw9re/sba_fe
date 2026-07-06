import { Card, Col, message, Modal, Typography, Space, Spin } from "antd";
import { exportStoredAsset } from "apis/exportStoredAsset";
import { Excell } from "assets";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import TableCustom from "components/TableCustom";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { FilterSpecificPricesType } from "constant/types";
import { CommonGetAllParams } from "constants/types/common.type";
import { defaultColumnsApprovedStoredAsset } from "pages/PriceSpecific/config";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PRICE_SPECIFIC_WATER_WAY_DETAIL } from "routes/route.constant";
import { randomId } from "utils";
import { usePriceAssets } from "utils/request";
import { saveAs } from "file-saver";
import "./style.scss"
import { BUTTON_CODES } from "constant/common";

type Props = {
  filters: FilterSpecificPricesType;
  setFilters: (filters: FilterSpecificPricesType) => void;
};

const PriceSpecificTable: React.FC<Props> = ({ filters, setFilters }) => {
  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 0,
  });

  const { ...filteredProps } = filters,
    { data, isLoading } = usePriceAssets(
      { ...params, page: params?.page ? params.page - 1 : 0 },
      filteredProps
    );

  const [exporting, setExporting] = useState(false);

  const navigate = useNavigate();

  const dataTable = data?.data
    ? data.data.map((item: any) => {
        return {
          ...item,
          key: randomId(),
        };
      })
    : [];

  const columns = defaultColumnsApprovedStoredAsset.map((col) => {
    if (col.key === 1) {
      return {
        ...col,
        render: (_: any, record: any, index: number) => {
          return (Number(params.page) - 1) * Number(params.limit) + index + 1;
        },
      };
    } else if (col.key === "actions") {
      return {
        ...col,
        render: (_: any, record: any) => (
          <>
            <ListButtonActionUpdate
              // downloadFunction={() => {}}
              viewFunction={() => {
                record?.assetId &&
                  navigate(
                    PRICE_SPECIFIC_WATER_WAY_DETAIL.replace(
                      ":id",
                      record.assetId
                    ),
                    {
                      state: filters,
                    }
                  );
                localStorage.setItem(
                  LOCAL_STORAGE_KEY.PAGE_PARAMS,
                  JSON.stringify({ limit: params.limit, page: params.page })
                );
                localStorage.setItem(
                  LOCAL_STORAGE_KEY.PAGE_PARAMS,
                  JSON.stringify({ limit: params.limit, page: params.page })
                );
              }}
            />
          </>
        ),
      };
    } else if (col.key === 2) {
      return {
        ...col,
        render: (warehouseCode: string, record: any) => (
          <>
            <Typography.Link
              underline
              onClick={() => {
                record?.assetId &&
                  navigate(
                    PRICE_SPECIFIC_WATER_WAY_DETAIL.replace(
                      ":id",
                      record.assetId
                    ),
                    {
                      state: filters,
                    }
                  );
                localStorage.setItem(
                  LOCAL_STORAGE_KEY.PAGE_PARAMS,
                  JSON.stringify({ limit: params.limit, page: params.page })
                );
                localStorage.setItem(
                  LOCAL_STORAGE_KEY.PAGE_PARAMS,
                  JSON.stringify({ limit: params.limit, page: params.page })
                );
              }}
            >
              {warehouseCode}
            </Typography.Link>
          </>
        ),
      };
    } else if (col.key === 21) {
      return {
        ...col,
        render: (climsCode: string) => (
          <>
            <Typography.Link underline onClick={() => {}}>
              {climsCode}
            </Typography.Link>
          </>
        ),
      };
    } else if (col.key === 3) {
      return {
        ...col,
        render: (numberReport: string) => (
          <>
            <Typography.Link underline onClick={() => {}}>
              {numberReport}
            </Typography.Link>
          </>
        ),
      };
    } else
      return {
        ...col,
      };
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

  const exportExcell = async () => {
    try {
      if (data.totalCount >= 300000) {
        message.error(`Số lượng vượt giới hạn cho phép`);
        return;
      }
      setExporting(true);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(), 300000)
      );

      const res = (await Promise.race([
        exportStoredAsset.exportData({
          ...filters,
          ...params,
          page: params?.page ? params.page - 1 : 0,
        }),
        timeoutPromise,
      ])) as { data: BlobPart };
      var blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Phuong_tien_duong_thuy.xlsx");
    } catch (error) {
      message.error(`Không tìm thấy dữ liệu!`);
    } finally {
      setExporting(false);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: `Bạn có chắc muốn xuất dữ liệu kho giá?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        exportExcell();
      },
    });
  };

  return (
    <div className="appraisal-file-price-specific-table-container">
      <Card className="card-container" size="small">
        <div style={{ marginBottom: "4px" }}>
          <CardTitleCustomUpdate title="Danh sách kho giá" />
          <Col>
            <Space
              style={{
                display: "flex",
                marginBottom: "8px",
                justifyContent: "end",
                width: "100%",
              }}
            >
              <ButtonCustom
                label="Xuất dữ liệu kho giá"
                icon={
                  exporting ? (
                    <div className="spin-overlay">
                      <Spin className="spin" />
                    </div>
                  ) : (
                    <Excell />
                  )
                }
                className={`button-Report ${exporting ? "exporting" : ""}`}
                size="small"
                onClick={showConfirm}
                disabled={exporting}
                code={BUTTON_CODES.kgptdt_xuat_du_lieu}
              />
            </Space>
          </Col>
        </div>
        <TableCustom
          dataSource={dataTable}
          columns={columns}
          bordered={true}
          isLoading={!data && isLoading}
          limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
          total={data ? data.totalCount : 0}
          onLimitChange={(limit) => {
            setParams({ ...params, limit });
          }}
          onPageChange={(page) => {
            setParams({ ...params, page });
          }}
          page={params?.page ? params.page : 1}
          scroll={{ x: 2240 }}
        />
      </Card>
    </div>
  );
};

export default PriceSpecificTable;
