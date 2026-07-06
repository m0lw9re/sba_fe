import React, { useEffect, useState } from "react";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import { Card } from "antd";
import TableAddCol from "components/TableAddCol";
import { columnsTb, dataSource, renderRequire } from "./config";

const TableApprovalAsset = () => {
  const [colTable, setColTable] = useState<ColumnsEdit>([]);
  const [colSpanDefault, setColSpanDefault] = useState(0);
  const handleAddCol = () => {
    const listCol = [...colTable];
    const lenghtColuns = colTable.length;
    const col = {
      title: `TS ${lenghtColuns - colSpanDefault}`,
      dataIndex: `ts${lenghtColuns - colSpanDefault}`,
      key: `ts${lenghtColuns - colSpanDefault}`,
    };
    listCol.splice(lenghtColuns - 1, 0, col);
    setColTable(listCol);
  };

  const handleSubCol = (data: any) => {
    let key = data?.key;
    let cols = [...colTable];
    let newCol = cols.filter((item: any) => {
      return item?.key !== key;
    });
    setColTable(newCol);
  };

  useEffect(() => {
    const colSpan = columnsTb[0]?.colSpan ? columnsTb[0]?.colSpan : 0;
    setColTable(columnsTb);
    setColSpanDefault(colSpan);
  }, [columnsTb]);

  const dataTable = dataSource.map((item: any) => {
    if (item.required) {
      return {
        ...item,
        lable: renderRequire(item?.lable ? item?.lable : ""),
      };
    } else {
      return item;
    }
  });

  return (
    <Card size="small">
      <TableAddCol
        columns={colTable}
        dataSource={dataTable}
        handleAddCol={handleAddCol}
        // handleCoppyCol={handleCoppyCol}
        handleSubCol={handleSubCol}
      />
    </Card>
  );
};

export default TableApprovalAsset;
