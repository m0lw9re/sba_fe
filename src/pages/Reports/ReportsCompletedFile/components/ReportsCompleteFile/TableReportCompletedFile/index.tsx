import { DownOutlined } from "@ant-design/icons";
import { Col, Modal, Space, Spin, Table, Typography, message } from "antd";
import { Excell } from "assets";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import "./style.scss";
import { useReportCompleteFile } from "utils/request";
import { defaultColumns } from "./config";
import { FilterReportFileComplete, GetAllCommonType } from "constant/types";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import TableCustom from "components/TableCustom";
import { randomId } from "utils";
import { saveAs } from "file-saver";
import { exportExcelReportCompleteFile } from "apis/exportExcelCompleteFile";
import { BUTTON_CODES } from "constant/common";

type Props = {
  filters: FilterReportFileComplete;
  setFilters: (filters: FilterReportFileComplete) => void;
};

const TableReportCompletedFile: React.FC<Props> = ({ filters, setFilters }) => {
  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
    status: 1,
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

  const { data, error, isLoading, mutate } = useReportCompleteFile(filters);

  const dataTable = data
    ? data?.data.map((item: any) => {
        return {
          ...item,
          key: randomId(),
        };
      })
    : [];

  const [exporting, setExporting] = useState(false);

  const exportExcell = async () => {
    try {
      setExporting(true);
      const res = await exportExcelReportCompleteFile.exportExcell(
        {
          ...filters
        },
        "tab1"
      );
      var blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Hs_hoan_thanh.xlsx");
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
      content: `Bạn có chắc muốn xuất báo cáo hồ sơ hoàn thành`,
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
            {isActive ? "Ẩn thông tin" : "Hiển thị thông tin"}
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
                    code={BUTTON_CODES.bchsht_export}
                  />
                </Space>
              </Col>
              <TableCustom
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>
                        <p style={{ fontWeight: "700" }}>Khu vực</p>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="center">
                        {dataTable &&
                          dataTable
                            .reduce(
                              (acc: any, item: any) => acc + item.totalCount,
                              0
                            )
                            .toLocaleString()}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} align="center">
                        {dataTable &&
                          dataTable
                            .reduce(
                              (acc: any, item: any) => acc + item.income,
                              0
                            )
                            .toLocaleString()}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3} align="center">
                        {dataTable &&
                          dataTable
                            .reduce(
                              (acc: any, item: any) => acc + item.outcome,
                              0
                            )
                            .toLocaleString()}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
                bordered={true}
                columns={defaultColumns}
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

export default TableReportCompletedFile;
