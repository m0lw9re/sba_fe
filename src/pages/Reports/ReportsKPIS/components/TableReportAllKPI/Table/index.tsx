import { Col, message, Modal, Space, Spin, Typography } from "antd";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./style.scss";
import { defaultColumns } from "./config";
import { FilterChartReportKPI, GetAllCommonType } from "constant/types";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import TableCustom from "components/TableCustom";
import { useReportAllKPIS } from "utils/request";
import ButtonCustom from "components/ButtonCustom";
import { Excell } from "assets";
import { saveAs } from "file-saver";
import { exportReportKPIs } from "apis/exportReportKPIs";

type Props = {
  filters: FilterChartReportKPI;
  setFilters: (filters: FilterChartReportKPI) => void;
};

const TableAllReportKPIS: React.FC<Props> = ({ filters, setFilters }) => {
  const [params, setParams] = useState<GetAllCommonType>({
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

  const { data, isLoading, mutate } = useReportAllKPIS(params, filters);

  const [exporting, setExporting] = useState(false);

  const exportExcell = async () => {
    try {
      setExporting(true);
      const res = await exportReportKPIs.exportExcel(
        {
          ...filters
        },
        "tab1"
      );
      var blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Bao_cao_tong_hop_KPI.xlsx");
    } catch (error) {
      // message.error("Xuất báo cáo thất bại!");
      message.error(`Không tìm thấy báo cáo!`);
    } finally {
      setExporting(false);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: `Bạn có chắc muốn xuất báo cáo KPIs theo tuần`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        exportExcell();
      },
    });
  };

  const columns = defaultColumns.map((item) => {
    if (item.key === 1) {
      return {
        ...item,
        width: "5%",
        render: (_: any, record: any, index: any) => {
          return (Number(params.page) - 1) * Number(params.limit) + index + 1;
        },
      };
    }
    return { ...item };
  });

  return (
    <CollapseCustom
      expandIcon={({ isActive }) => (
        <Space>
          <Typography style={{ color: "#2862af" }}>
            {isActive ? "Ẩn" : "Hiện"}
          </Typography>
          <DownOutlined
            rotate={isActive ? 180 : 0}
            style={{ color: "#2862af" }}
          />
        </Space>
      )}
      itemList={[
        {
          label: "Báo cáo KPIS",
          forceRender: true,
          children: (
            <div>
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
                    label="Xuất báo cáo"
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
                  />
                </Space>
              </Col>
              <TableCustom
                bordered={true}
                columns={columns}
                dataSource={data ? data.data : []}
                isLoading={!data && isLoading}
                limit={data?.limit}
                page={data?.page}
                total={data?.total}
                onLimitChange={(limit) => {
                  setParams({ ...params, limit });
                }}
                onPageChange={(page) => {
                  setParams({ ...params, page });
                }}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default TableAllReportKPIS;