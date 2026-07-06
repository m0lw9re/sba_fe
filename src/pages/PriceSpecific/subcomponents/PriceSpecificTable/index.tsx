import React from "react";
import { defaulColumns, mockData } from "./config";
import { useNavigate } from "react-router-dom";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { Card, Typography } from "antd";
import { PRICE_SPECIFIC_USING_LAND_DETAIL } from "routes/route.constant";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";

const PriceSpecificTable = () => {
  const navigate = useNavigate();

  const columns = defaulColumns.map((col) => {
    if (col.key === "actions") {
      return {
        ...col,
        render: (_: any, record: any) => (
          <>
            <ListButtonActionUpdate
              downloadFunction={() => {}}
              viewFunction={() => {}}
            />
          </>
        ),
      };
    } else if (col.key === 2) {
      return {
        ...col,
        render: (warehouseCode: string) => (
          <>
            <Typography.Link
              underline
              onClick={() =>
                navigate(PRICE_SPECIFIC_USING_LAND_DETAIL.replace(":id", "12"))
              }
            >
              {warehouseCode}
            </Typography.Link>
          </>
        ),
      };
    } else if (col.key === 21) {
      return {
        ...col,
        render: (climsCode: string) => (
          <>
            <Typography.Link
              underline
              onClick={() =>
                // navigate(APPRAISAL_FILE_DETAIL.replace(":id", record.code))
                {}
              }
            >
              {climsCode}
            </Typography.Link>
          </>
        ),
      };
    } else if (col.key === 3) {
      return {
        ...col,
        render: (numberReport: string) => (
          <>
            <Typography.Link
              underline
              onClick={() =>
                // navigate(APPRAISAL_FILE_DETAIL.replace(":id", record.code))
                {}
              }
            >
              {numberReport}
            </Typography.Link>
          </>
        ),
      };
    } else
      return {
        ...col,
      };
  });
  return (
    <div className="appraisal-file-price-specific-table-container">
      <Card className="card-container" size="small">
        <div style={{ marginBottom: "4px" }}>
          <CardTitleCustomUpdate title="Danh sách kho giá" />
        </div>
        <TableCustom
          dataSource={mockData}
          columns={columns}
          bordered={true}
          isLoading={false}
          limit={10}
          total={mockData.length}
          onLimitChange={() => {}}
          onPageChange={() => {}}
          page={1}
          scroll={{ x: 1366 }}
        />
      </Card>
    </div>
  );
};

export default PriceSpecificTable;
