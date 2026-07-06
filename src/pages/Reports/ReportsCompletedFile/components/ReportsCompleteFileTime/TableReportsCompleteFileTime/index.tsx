import { Col, Modal, Space, Spin, Typography, message } from "antd";
import TableCustom from "components/TableCustom";
import { useCallback, useState } from "react";
import ButtonCustom from "components/ButtonCustom";
import { ColumnsType } from "antd/es/table";
import "./style.scss";
import { defaultColumns } from "./config";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { Excell } from "assets";
import { COMPLETE_BY_TIME_REPORT_FILE } from "constants/enums";
import { numberUtils, randomId } from "utils";
import { exportExcelReportCompleteFile } from "apis/exportExcelCompleteFile";
import { saveAs } from "file-saver";
import { FilterReportCompletedFileTime } from "constant/types";
import { BUTTON_CODES } from "constant/common";

type Props = {
  data: Array<any>;
  filters: FilterReportCompletedFileTime;
  setFilters: (filters: FilterReportCompletedFileTime) => void;
};

const TableReportCompleteFileDetail: React.FC<Props> = ({
  data,
  filters,
  setFilters,
}) => {
  const calculateTotal = (data: any[]) => {
    const totalData: { [key: string]: number } = {};

    data.forEach((element) => {
      for (const key of Object.keys(element)) {
        if (key !== "total") {
          if (!totalData[key]) {
            totalData[key] = 0;
          }
          totalData[key] += element[key];
        }
      }
    });
    
    for (const key of Object.keys(totalData)) {
      totalData[key] =
        numberUtils.roundDecimalNumber(totalData[key]) || 0;
    }

    return totalData;
  };

  const handleSetColumns = useCallback(
    (data: Array<any>) => {
      if (!data) return defaultColumns;
      // Sắp xếp theo năm + tháng
      const sortedData = data
        .map((item: any) => {
          return {
            key: randomId(),
            index: item?.month,
            name: `Tháng ${item?.month}`,
            month: item?.month,
            year: item?.year,
          };
        })
        .sort((a, b) => {
          if (a?.year !== b?.year) {
            return a.year - b.year;
          } else return a?.month - b?.month;
        });
      // Tạo các cột cho các tháng
      const monthColumns: ColumnsType<any> = sortedData.map((item) => {
        return {
          key: randomId(),
          title: item.name,
          dataIndex: item.index,
          align: "center",
          render: (value) => numberUtils.formatNumber(value),
        };
      });
      // ghép các cột, dịch chuyển cột tổng xuống cuối cùng
      const newColumns: ColumnsType<any> = [
        ...defaultColumns.slice(0, 3),
        ...monthColumns,
        ...defaultColumns.slice(3),
      ];
      return newColumns;
    },
    [data]
  );

  const handleConvertDataTable = useCallback(
    (data: Array<any>) => {
      if (!data) return [];

      const enumToObject = (
        COMPLETE_BY_TIME_REPORT_FILE: any
      ): Record<string, any> => {
        return Object.keys(COMPLETE_BY_TIME_REPORT_FILE).reduce(
          (acc, key, index) => {
            acc[key] = {
              index: index + 1,
              title: COMPLETE_BY_TIME_REPORT_FILE[key],
            };
            return acc;
          },
          {} as Record<string, any>
        );
      };
      const totalData = calculateTotal(data);

      const dataInit: Record<string, any> = enumToObject(
        COMPLETE_BY_TIME_REPORT_FILE
      );

      data.forEach((element, index) => {
        for (const key of Object.keys(COMPLETE_BY_TIME_REPORT_FILE)) {
          const month = element?.month || 13;
          const value = element[key];
          dataInit[key] = {
            ...dataInit[key],
            [month]: value,
            total: totalData[key],
            key: randomId(),
          };
        }
      });

      dataInit["done"] = {
        ...dataInit["done"],
        children: [
          {
            ...dataInit["done"],
            key: randomId(),
            index: "4.1",
            title: "Xét theo tiến độ",
            children: [
              {
                ...dataInit["income"],
                key: randomId(),
                index: "4.1.1",
              },
              {
                ...dataInit["outcome"],
                key: randomId(),
                index: "4.1.2",
              },
            ],
          },
          {
            ...dataInit["done"],
            index: "4.2",
            title: "Xét theo loại hồ sơ",
            key: randomId(),
            children: [
              {
                ...dataInit["createNew"],
                key: randomId(),
                index: "4.2.1",
              },
              {
                ...dataInit["reNew"],
                key: randomId(),
                index: "4.2.2",
              },
            ],
          },
        ],
      };
      dataInit["delayAtEnd"] = {
        ...dataInit["delayAtEnd"],
        index: 5,
      };

      const sortedData = Object.keys(COMPLETE_BY_TIME_REPORT_FILE)
        .reduce((acc: Array<any>, key) => {
          if (
            key !== "createNew" &&
            key !== "reNew" &&
            key !== "income" &&
            key !== "outcome"
          ) {
            acc.push(dataInit[key]);
          }
          return acc;
        }, [])
        .sort((a, b) => a.index - b.index);

      return sortedData;
    },
    [data]
  );

  const [exporting, setExporting] = useState(false);

  const exportExcell = async () => {
    try {
      setExporting(true);
      const res = await exportExcelReportCompleteFile.exportExcell(
        {
          ...filters
        },
        "tab2"
      );
      var blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Hs_hoan_thanh_theo_thoi_gian.xlsx");
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
                    code={BUTTON_CODES.bchsht_export}
                  />
                </Space>
              </Col>
              <TableCustom
                dataSource={handleConvertDataTable(data)}
                columns={handleSetColumns(data)}
                bordered={true}
                isLoading={false}
                limit={0}
                total={0}
                onLimitChange={() => {}}
                onPageChange={() => {}}
                page={1}
                expandable={{
                  defaultExpandedRowKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                }}
                // scroll={{ x: 1980 }}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default TableReportCompleteFileDetail;
