import "./style.scss";
import { Row, Table, TableProps } from "antd";
import { ColumnType } from "antd/es/table";
import React from "react";
import "components/TableCustom/style.scss";
import SelectCustom from "components/SelectCustom";
import PaginationCustom from "components/PaginationCustom";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";

type Props = {
  dataSource: Array<any>;
  columns: Array<ColumnType<any>>;
  isLoading: boolean;
  page: number;
  total: number;
  limit: number;
  bordered: boolean;
  onLimitChange: (limit: number) => void;
  onPageChange: (page: number) => void;
  onSorterChange?: (sorter: any) => void;
};

const TableCustomWithoutCustomSelection: React.FC<Props & TableProps<any>> = ({
  dataSource,
  columns,
  page,
  limit,
  bordered,
  total,
  isLoading,
  onLimitChange,
  onPageChange,
  onSorterChange,
  ...rest
}) => {
  return (
    <>
      <div style={{ marginBottom: "4px" }}>
        <Table
          {...rest}
          size="small"
          className="table-custom"
          dataSource={dataSource}
          columns={columns}
          bordered={bordered}
          loading={isLoading}
          pagination={{ pageSize: limit || PAGE_SIZE_OPTIONS.OPTION_10 }}
          onChange={(_config, _record, sorter: any) => {
            let orderType = "ASC";
            if (sorter) {
              if (sorter.order === "ascend") {
                orderType = "ASC";
              } else if (sorter.order === "descend") {
                orderType = "DESC";
              }
              if (sorter.column !== undefined) {
                if (onSorterChange) {
                  onSorterChange({
                    sortBy: sorter.column.dataIndex,
                    sortType: orderType,
                  });
                }
              }
            }
          }}
        />
      </div>
      {!total ? null : (
        <Row justify={"space-between"}>
          <SelectCustom
            value={limit}
            placeholder="Chọn số dòng"
            size="small"
            onChange={(value) => {
              if (value !== limit) {
                onLimitChange(value);
                localStorage.setItem(LOCAL_STORAGE_KEY.PAGE_SIZE, value);
              }
            }}
            options={[
              {
                value: PAGE_SIZE_OPTIONS.OPTION_5,
                label: PAGE_SIZE_OPTIONS.OPTION_5_LABEL.toString(),
              },
              {
                value: PAGE_SIZE_OPTIONS.OPTION_10,
                label: PAGE_SIZE_OPTIONS.OPTION_10_LABEL.toString(),
              },
              {
                value: PAGE_SIZE_OPTIONS.OPTION_15,
                label: PAGE_SIZE_OPTIONS.OPTION_15_LABEL.toString(),
              },
              {
                value: PAGE_SIZE_OPTIONS.OPTION_25,
                label: PAGE_SIZE_OPTIONS.OPTION_25_LABEL.toString(),
              },
              {
                value: PAGE_SIZE_OPTIONS.OPTION_50,
                label: PAGE_SIZE_OPTIONS.OPTION_50_LABEL.toString(),
              },
            ]}
            allowClear={false}
          />
          <PaginationCustom
            page={page || 1}
            pageSize={limit || 10}
            total={total || 0}
            onChange={(value) => {
              if (value !== page) {
                onPageChange(value);
              }
            }}
          />
        </Row>
      )}
    </>
  );
};

export default TableCustomWithoutCustomSelection;
