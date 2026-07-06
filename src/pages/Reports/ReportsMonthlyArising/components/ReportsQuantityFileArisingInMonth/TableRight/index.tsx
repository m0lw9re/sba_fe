import { Space, Typography } from "antd";
import TableCustom from "components/TableCustom";
import { useEffect, useState } from "react";
import "./style.scss";
import {
  FilterQuantityFileArisingInMonth,
  GetAllCommonType,
} from "constant/types";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useRecordArise } from "utils/request";

const defaultColumns: ColumnsType<any> = [
  {
    title: "",
    width: "2%",
    key: "icon",
    align: "center",
  },
  {
    title: "STT",
    dataIndex: "key",
    key: "key",
    width: "39px",
  },
  {
    key: 1,
    title: "Khoản mục",
    dataIndex: "khoanMuc",
    align: "left",
  },
  {
    key: 2,
    title: "Số lượng",
    dataIndex: "soLuong",
    align: "left",
  },
];

type Props = {
  filters: FilterQuantityFileArisingInMonth;
  setFilters: (filters: FilterQuantityFileArisingInMonth) => void;
};

const TableRight: React.FC<Props> = ({ filters, setFilters }) => {
  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const [dataTableSource, setDataTableSource] = useState<any>();

  let {
    data: dataTable,
    error,
    isLoading,
    mutate,
  }: {
    data: any;
    isLoading: boolean;
    error: any;
    mutate: () => void;
  } = useRecordArise(params, filters, "search");

  useEffect(() => {
    if (dataTable && dataTable.report) {
      const order = [
        "recordBacklog",
        "recordArise",
        "recordComplete",
        "recordCancel",
        "recordFinal"
      ];

      setDataTableSource(
        Object.entries(dataTable.report)
          .filter(([key, value]) => order.includes(key))
          .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
          .map(([key, value], index) => {
            let khoanMuc = "";
            let children: any[] = [];
            if (key === "recordBacklog") {
              khoanMuc = "Số lượng HS tồn đầu kỳ";
            }
            if (key === "recordArise") {
              khoanMuc = "Số lượng HS phát sinh trong tháng";
            }
            if (key === "recordComplete") {
              khoanMuc = "Số lượng HS hoàn thành trong tháng";
              children = [
                {
                  key: `${index + 1}.1`,
                  khoanMuc: "Hồ sơ hoàn thành trong tháng",
                  soLuong: dataTable.report.recordCompleteInMonth,
                },
                {
                  key: `${index + 1}.2`,
                  khoanMuc:
                    "Hồ sơ của tháng trước nhưng có ngày hoàn thành trong tháng",
                  soLuong: dataTable.report.recordCompleteLastMonth,
                },
              ];
            }
            if (key === "recordCancel") {
              khoanMuc = "Số lượng HS huỷ";
              children = [
                {
                  key: `${index + 1}.1`,
                  khoanMuc: "Hồ sơ huỷ trong tháng",
                  soLuong: dataTable.report.recordCancelInMonth,
                },
                {
                  key: `${index + 1}.2`,
                  khoanMuc:
                    "Hồ sơ của tháng trước nhưng có ngày huỷ trong tháng",
                  soLuong: dataTable.report.recordCancelLastMonth,
                },
              ];
            }
            if (key === "recordFinal") {
              khoanMuc = "Số lượng HS tồn cuối kỳ";
            }

            return {
              key: index + 1,
              soLuong: value,
              khoanMuc,
              ...(children && children.length > 0 ? { children } : {}),
            };
          })
      );
    } else {
      setDataTableSource([]);
    }
  }, [dataTable]);

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
          label: "Báo cáo",
          forceRender: true,
          children: (
            <div style={{ display: "flex" }}>
              <TableCustom
                dataSource={dataTableSource}
                columns={defaultColumns}
                bordered={true}
                isLoading={isLoading}
                limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
                total={1}
                onLimitChange={(limit) => {
                  setParams({ ...params, limit });
                }}
                onPageChange={(page) => {
                  setParams({ ...params, page });
                }}
                page={params.page || 1}
                paginationConditional={false}
                expandable={{
                  defaultExpandedRowKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                }}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default TableRight;
