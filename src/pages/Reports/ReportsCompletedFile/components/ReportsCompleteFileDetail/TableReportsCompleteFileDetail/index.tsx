import { Col, Modal, Space, Spin, Tooltip, Typography, message } from "antd";
import TableCustom from "components/TableCustom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import { defaultColumns } from "./config";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { FilterReportCompletedFileDetail } from "constant/types";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { Excell } from "assets";
import { useReportsDetailCompleteFile } from "utils/request";
import { Link } from "react-router-dom";
import { APPRAISAL_FILE_DETAIL } from "routes/route.constant";
import { exportExcelReportCompleteFile } from "apis/exportExcelCompleteFile";
import { saveAs } from "file-saver";
import { CommonGetAllParams } from "constants/types/common.type";
import { appraisalFilesApi } from "apis/appraisalFiles";
import { renderAppraisalStatus } from "utils/string";
import { BUTTON_CODES } from "constant/common";

type Props = {
  filters: FilterReportCompletedFileDetail;
  setFilters: (filters: FilterReportCompletedFileDetail) => void;
};

type RefusalToPriceContentsProps = { key: string; value: string }[];

const TableReportCompleteFileDetail: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const [refusalToPriceContents, setRefusalToPriceContents] =
    useState<RefusalToPriceContentsProps>([]);

  const handleGetRefusalToPriceContent = async (id: string) => {
    if (!id) return;
    // find refusal exist
    const findItem = refusalToPriceContents.find((item) => item.key === id);
    if (findItem) return;
    // get from api
    try {
      const res = await appraisalFilesApi.getRefusalToPriceReason(id);
      if (res.data) {
        const newRefusalToPriceContents = [
          ...refusalToPriceContents,
          { key: id, value: res.data.contentRefused || "Nội dung trống" },
        ];
        setRefusalToPriceContents(newRefusalToPriceContents);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  const columns = defaultColumns.map((item) => {
    if (item.key === 0) {
      return {
        ...item,
        render: (_: any, record: any, index: any) => {
          return (Number(params.page) - 1) * Number(params.limit) + index + 1;
        },
      };
    }
    if (item.key === 8) {
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
    if (item.key === 11) {
      return {
        ...item,
        render: (text: any) => (
          <Tooltip title={text}>
            <div className="tooltip-text">{text}</div>
          </Tooltip>
        ),
      };
    }
    if (item.key === 1) {
      return {
        ...item,
        render: (climsCode: any, record: any) => (
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
              <Tooltip title={climsCode}>
                <div className="inline-text">{climsCode}</div>
              </Tooltip>
            </Link>
          </>
        ),
      };
    }
    if (item.key === 13) {
      return {
        ...item,
        render: (status: any, record: any) => (
          <Space style={{ width: "100%", maxWidth: "150px" }}>
            {record.fileStatus === -1 ? (
              <div
                onMouseEnter={async () => {
                  await handleGetRefusalToPriceContent(record.appraisalFileId);
                }}
              >
                <Tooltip
                  title={
                    refusalToPriceContents.find(
                      (item) => item.key === record.appraisalFileId
                    )?.value || <Spin />
                  }
                >
                  <span className="files-status-label">
                    {renderAppraisalStatus(
                      status,
                      record?.isReceivedLos,
                      record?.sendToEmail,
                      record?.parentId,
                      record?.refusedStatus
                    )}
                  </span>
                </Tooltip>
              </div>
            ) : (
              <span className="files-status-label">
                {renderAppraisalStatus(
                  status,
                  record?.isReceivedLos,
                  record?.sendToEmail,
                  record?.parentId,
                  record?.refusedStatus
                )}
              </span>
            )}
          </Space>
        ),
      };
    }
    return { ...item };
  });

  const { data, isLoading, error, mutate } = useReportsDetailCompleteFile(
    params,
    filters
  );

  const [exporting, setExporting] = useState(false);

  const exportExcell = async () => {
    try {
      setExporting(true);
      const res = await exportExcelReportCompleteFile.exportExcell(
        {
          ...filters,
        },
        "tab3"
      );
      var blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Hs_chi_tiet_hoan_thanh.xlsx");
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
      content: `Bạn có chắc muốn xuất báo cáo hồ sơ chi tiết hoàn thành`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        exportExcell();
      },
    });
  };

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
          label: "Báo cáo chi tiết tiến độ hồ sơ",
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
                    code={BUTTON_CODES.bchsht_export}
                  />
                </Space>
              </Col>
              <TableCustom
                dataSource={data ? data.data : []}
                columns={columns}
                bordered={true}
                isLoading={isLoading}
                limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
                page={data?.page}
                total={data?.total}
                onLimitChange={(limit) => {
                  setParams({ ...params, limit });
                }}
                onPageChange={(page) => {
                  setParams({ ...params, page });
                }}
                scroll={{ x: 1980, y: 400 }}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default TableReportCompleteFileDetail;
