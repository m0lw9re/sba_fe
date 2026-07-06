import { Space, Table, TableColumnsType } from "antd";
import { TableRowSelection } from "antd/es/table/interface"; // Import TableRowSelection
import { DATE_TIME_FORMAT, LOCAL_STORAGE_KEY } from "constant/enums";
import { FeeContentType } from "constant/types/appraisalFilesDetail";
import { feeNotificationStatus } from "constant/types/fee";
import dayjs from "dayjs";
import { useState, useEffect, useLayoutEffect } from "react";
import { numberUtils } from "utils";
import { randomId } from "utils";

type Props = {
  keyParent: string;
  feeContents: FeeContentType[];
  rowSelectionFeeContent: boolean;
  onSelectedRows: (selectedObject: any) => void;
  onSelectAllRows: (
    selected: boolean,
    selectedRows: any[],
    selectedObjectFeeContent: any
  ) => void;
};

const FeeContentTable = ({
  keyParent,
  feeContents,
  rowSelectionFeeContent,
  onSelectedRows,
  onSelectAllRows,
}: Props) => {
  const [dataTable, setDataTable] = useState([]);
  const columns: TableColumnsType<FeeContentType> = [
    { title: "Mã TB/HĐ", dataIndex: "code", key: "code" },
    { title: "Loại phí", dataIndex: "content", key: "content" },
    {
      title: "Tổng tiền",
      dataIndex: "soTienCanKhopConLai",
      key: "soTienCanKhopConLai",
      align: "right",
      render: (value: number) => {
        // return value ? (
        //   numberUtils.formatNumber(value)
        // ) : (
        //   <span style={{ color: "red" }}>Không có số tiền!</span>
        // );
        return numberUtils.formatNumber(value);
      },
    },
  ];

  useEffect(() => {
    const tempVarData: any = feeContents.map((fee) => ({
      ...fee,
      key: randomId(),
    }));
    setDataTable(tempVarData);
  }, [feeContents]);

  const [selectedRowKey, setSelectedRowKey] = useState<any>(null);
  const [prevFeeNotificationId, setPrevFeeNotificationId] = useState<any>(null);

  useEffect(() => {
    if (rowSelectionFeeContent) {
      const keys = dataTable.map((item: any) => item.key);
      setSelectedRowKey(keys);
      onSelectedRows({
        feeNotificationId: feeContents[0]?.feeNotificationId,
        feeContents: feeContents,
      });
    } else {
      setSelectedRowKey([]);
      onSelectedRows({
        feeNotificationId: feeContents[0]?.feeNotificationId,
        feeContents: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelectionFeeContent, dataTable]);

  const onSelectChange = (newSelectedRowKeys: any, selectedRow: any) => {
    // console.log(selectedRow)
    setSelectedRowKey(newSelectedRowKeys);
    selectedRow.length > 0 &&
      setPrevFeeNotificationId(selectedRow[0]?.feeNotificationId);
    onSelectedRows({
      feeNotificationId:
        selectedRow[0]?.feeNotificationId ?? prevFeeNotificationId,
      feeContents: selectedRow,
    });
  };

  // useEffect(() => {
  //   onSelectAllRows(true, feeContents, selectedObjectFeeContent);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedObjectFeeContent, onSelectAllRows]);

  const rowSelection: TableRowSelection<FeeContentType> = {
    type: "checkbox",
    selectedRowKeys: selectedRowKey,
    onChange: onSelectChange,
    onSelectAll: (selected: boolean, selectedRows: FeeContentType[]) => {
      // console.log("selected", selected)
      // console.log("selectedRows", selectedRows)
      onSelectAllRows(selected, selectedRows, {
        keyParent: keyParent,
        feeNotificationId:
          selectedRows[0]?.feeNotificationId ?? prevFeeNotificationId,
        feeContents: selectedRows,
      });
    },
  };

  return (
    <Space
      direction="vertical"
      style={{
        marginTop: "8px",
        marginBottom: "16px",
        width: "100%",
        backgroundColor: "#fbfbfb",
      }}
    >
      <Table
        columns={columns}
        bordered={true}
        size="small"
        dataSource={dataTable}
        pagination={false}
        rowSelection={rowSelection}
      />
    </Space>
  );
};

export default FeeContentTable;
