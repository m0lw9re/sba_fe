import React, { useEffect, useState } from "react";
import { defaultColumns } from "./config";
import TableCustom from "components/TableCustom";
import InputCustom from "components/InputCustom";
import Icons from "assets/icons";
import {
  DATE_TIME_FORMAT,
  LOCAL_STORAGE_KEY,
  PAGE_SIZE_OPTIONS,
  TYPE_FIELD,
} from "constant/enums";
import "./style.scss";
import {
  AppraisalFilesCompareFilter,
  GenericDataTable,
} from "../../../../../../constant/types/appraisalFilesDetail";
import InputFields from "../../../../../../components/InputFields";
import { InputFiledParams } from "../../../../../../constants/types/Form_Field_type";
import dayjs from "dayjs";
import { DatePickerProps, message } from "antd";
import SelectCustom from "../../../../../../components/SelectCustom";
import { appraisalFilesApi } from "../../../../../../apis/appraisalFiles";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../configs/configureStore";

type Props = {
  filter: AppraisalFilesCompareFilter;
  setFilter: (filter: AppraisalFilesCompareFilter) => void;
  dataTable: GenericDataTable;
  fetchData: () => void;
  rowSelection: any;
  isLoading: boolean;
  selectedAcc: any;
  expandable?: {
    columnWidth: number;
    expandRowByClick: boolean;
    indentSize: number;
    expandedRowKeys: string[];
    expandedRowRender: (record: any) => JSX.Element;
    onExpand: (expanded: boolean, record: any) => void;
  };
};

const Table: React.FC<Props> = ({
  filter,
  setFilter,
  fetchData,
  rowSelection,
  dataTable,
  isLoading,
  selectedAcc,
  ...rest
}) => {
  const globalState = useSelector((state: RootState) => state.globalSlice);
  const [selectValue, setSelectValue] = useState<any>("");

  const columns = defaultColumns.map((item) => {
    if (item.key === 1) {
      return {
        ...item,
        render: (_: any, record: any, index: number) => {
          return (
            (Number(dataTable.page) - 1) * Number(dataTable.limit) + index + 1
          );
        },
      };
    } else
      return {
        ...item,
      };
  });
  React.useEffect(() => {
    const getData = setTimeout(() => {
      fetchData();
    }, 100);

    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  React.useEffect(() => {
    setFilter({
      ...filter,
      keywords: selectedAcc.reportCode,
      limit: filter.limit,
      isFiltering: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAcc.reportCode]);

  return (
    <div className="unidentified-profile-table-container">
      <div
        className="btn-group"
        style={{
          display: "flex",
          marginBottom: "4px",
          gap: "0",
        }}
      >
        <InputCustom
          allowClear={true}
          value={filter.keywords || ""}
          onChange={(e: any) => {
            setFilter({
              ...filter,
              keywords: e.target.value,
              limit: filter.limit,
              isFiltering: true,
            });
          }}
          prefix={<Icons.search />}
          placeholder="Tìm kiếm theo số tờ trình"
          style={{ width: "30%", marginBottom: "12px", marginRight: "12px" }}
        />

        <SelectCustom
          value={selectValue}
          placeholder="Chi nhánh"
          size="small"
          style={{ marginBottom: "12px" }}
          onChange={(value) => {
            setSelectValue(value);
            setFilter({
              ...filter,
              regionCode: value,
            });
          }}
          options={[
            { value: "", label: "Chi nhánh", disabled: true },
            ...globalState.regionData.map((item) => ({
              value: item.regionCode,
              label: item.regionName,
            })),
          ]}
          allowClear={true}
        />
      </div>
      <TableCustom
        {...rest}
        scroll={{ y: 380 }}
        dataSource={dataTable.data}
        columns={columns}
        bordered={true}
        isLoading={isLoading}
        limit={dataTable.limit || PAGE_SIZE_OPTIONS.OPTION_10}
        total={dataTable.total || 0}
        onLimitChange={(limit) => {
          setFilter({ ...filter, limit });
          fetchData();
        }}
        onPageChange={(page) => {
          setFilter({ ...filter, page });
          fetchData();
        }}
        page={dataTable.page || 1}
        isRowSelection={true}
        isCustomRowSelect={true}
        rowSelection={{
          type: "radio",
          ...rowSelection,
        }}
      />
    </div>
  );
};

export default Table;
