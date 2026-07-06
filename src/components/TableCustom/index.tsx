import "./style.scss";
import { Row, Table, TableProps } from "antd";
import { ColumnType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import "components/TableCustom/style.scss";
import SelectCustom from "components/SelectCustom";
import PaginationCustom from "components/PaginationCustom";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { setSelectedRowKeysRedux } from "pages/AccountantDebtDetail/store/accountantDebtDetailSlice";
import { useDispatch } from "react-redux";

type Props = {
  dataSource: Array<any>;
  columns: Array<ColumnType<any>>;
  isLoading: boolean;
  page: number;
  total: number;
  limit: number;
  bordered: boolean;
  paginationConditional?: boolean;
  onLimitChange: (limit: number) => void;
  onPageChange: (page: number) => void;
  isRowSelection?: boolean;
  isCustomRowSelect?: boolean;
  onSorterChange?: (sorter: any) => void;
};

const TableCustom: React.FC<Props & TableProps<any>> = ({
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
  paginationConditional = true,
  isRowSelection = false,
  isCustomRowSelect = false,
  ...rest
}) => {
  const dispatch = useDispatch();
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    rowSelected: any[]
  ) => {
    const ids = rowSelected.map((row) => row.assetId);
    setSelectedRows(ids);
    localStorage.setItem(
      LOCAL_STORAGE_KEY.PRICESHARED_COLLECTED,
      ids.toString()
    );
    // dispatch(setSelectedRowKeysRedux(selectedRows));
  };

  const rowSelection = {
    selectedRows,
    onChange: onSelectChange,
  };

  return (
    <>
      <div style={{ marginBottom: "4px", width: "100%" }}>
        <Table
          {...rest}
          size="small"
          className="table-custom"
          dataSource={dataSource}
          columns={columns}
          bordered={bordered}
          loading={isLoading}
          pagination={
            paginationConditional
              ? { pageSize: limit || PAGE_SIZE_OPTIONS.OPTION_10 }
              : false
          }
          rowSelection={
            isRowSelection
              ? isCustomRowSelect
                ? rest.rowSelection
                : rowSelection
              : undefined
          }
          onChange={(_config, _record, sorter: any) => {
            let orderType = "ASC";
            if (sorter) {
              if (sorter.order === "ascend") {
                orderType = "ASC";
              } else if (sorter.order === "descend") {
                orderType = "DESC";
              } else if (sorter.order === "undefined") {
                orderType = "";
              }

              if (sorter.column !== undefined) {
                if (onSorterChange) {
                  onSorterChange({
                    sortBy: sorter.column.dataIndex,
                    sortType: orderType,
                  });
                }
              } else {
                if (onSorterChange) {
                  onSorterChange({
                    sortBy: '',
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
          {paginationConditional && (
            <>
              <SelectCustom
                value={limit}
                placeholder="Chọn số dòng"
                size="small"
                onChange={(value) => {
                  onLimitChange(value);
                  localStorage.setItem(LOCAL_STORAGE_KEY.PAGE_SIZE, value);
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
                pageSize={limit || PAGE_SIZE_OPTIONS.OPTION_10}
                total={total || 0}
                onChange={(value) => {
                  onPageChange(value);
                }}
              />
            </>
          )}
        </Row>
      )}
    </>
  );
};

export default TableCustom;
