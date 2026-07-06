import { Col, Modal, Space, Spin, Tooltip, Typography, message } from "antd";
import TableCustom from "components/TableCustom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./style.scss";
import { defaultColumns } from "./config";
import { GetAllCommonType } from "constant/types";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { FilterReportDetailTotalLate } from "constant/types";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { useReportsDetailLate } from "utils/request";
import { APPRAISAL_FILE_DETAIL } from "routes/route.constant";
import { Link } from "react-router-dom";
import ButtonCustom from "components/ButtonCustom";
import { Excell } from "assets";
import { saveAs } from "file-saver";
import { exportExcelDetailWeek } from "apis/exportExcelDetailWeek";
import dayjs from "dayjs";
import { BUTTON_CODES } from "constant/common";

type Props = {
  filters: FilterReportDetailTotalLate;
  setFilters: (filters: FilterReportDetailTotalLate) => void;
};

const TableReportDetailLate: React.FC<Props> = ({ filters, setFilters }) => {
  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const columns = defaultColumns.map((item) => {
    if (item.key === 0) {
      return {
        ...item,
        render: (_: any, record: any, index: any) => {
          return (Number(params.page) - 1) * Number(params.limit) + index + 1;
        },
      };
    }
    if (item.key === 1) {
      return {
        ...item,
        render: (reportCode: any, record: any) => (
          <>
            <Link
              to={APPRAISAL_FILE_DETAIL.replace(":id", record.appraisalFileId)}
              onClick={() => {
                localStorage.setItem(
                  LOCAL_STORAGE_KEY.PAGE_PARAMS,
                  JSON.stringify({ limit: params.limit, page: params.page })
                );
              }}
              className="link-underline"
            >
              <Tooltip title={reportCode}>
                <div className="inline-text">{reportCode}</div>
              </Tooltip>
            </Link>
          </>
        ),
      };
    }
    if (item.key === 9) {
      return {
        ...item,
        render: (text: any) => (
          <Tooltip title={text}>
            <div className="tooltip-text">{text}</div>
          </Tooltip>
        ),
      };
    }
    if (item.key === 10) {
      return {
        ...item,
        render: (text: any) => (
          <Tooltip title={text}>
            <div className="tooltip-text">{text}</div>
          </Tooltip>
        ),
      };
    }
    return { ...item };
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

  const { data, isLoading, error, mutate } = useReportsDetailLate(params, {
    ...filters,
    startDate: filters.startDate
      ? dayjs(filters?.startDate).format("DD-MM-YYYY 00:00:00")
      : null,
    endDate: filters.endDate
      ? dayjs(filters?.endDate).format("DD-MM-YYYY 23:59:59")
      : null,
  });

  //   if (error) return <ComponentsError />;

  const [exporting, setExporting] = useState(false);

  const exportExcell = async () => {
    try {
      setExporting(true);
      const res = await exportExcelDetailWeek.exportExcell(
        {
          ...filters,
          startDate: filters.startDate
            ? dayjs(filters?.startDate).format("DD-MM-YYYY 00:00:00")
            : null,
          endDate: filters.endDate
            ? dayjs(filters?.endDate).format("DD-MM-YYYY 23:59:59")
            : null,
        },
        "tab4"
      );
      var blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Hs_bao_cao_chi_tiet_tre_tien_do.xlsx");
    } catch (error) {
      // message.error("Xuất báo cáo thất bại!");
      message.error(`Không tìm thấy báo cáo HS chi tiết trễ tiến độ!`);
    } finally {
      setExporting(false);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: `Bạn có chắc muốn xuất báo cáo hồ sơ chi tiết trễ tiến độ`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        exportExcell();
      },
    });
  };

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
          label: "Chi tiết",
          forceRender: true,
          children: (
            <div>
              <Col>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginBottom: "8px",
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
                    code={BUTTON_CODES.bcttd_export}
                  />
                </Space>
              </Col>
              <TableCustom
                dataSource={data ? data.data : []}
                columns={columns}
                bordered={true}
                isLoading={isLoading}
                limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
                total={data && data.total}
                onLimitChange={(limit) => {
                  setParams({ ...params, limit });
                }}
                onPageChange={(page) => {
                  setParams({ ...params, page });
                }}
                page={params.page || 1}
                scroll={{ x: "3000px", y: "400px" }}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default TableReportDetailLate;
