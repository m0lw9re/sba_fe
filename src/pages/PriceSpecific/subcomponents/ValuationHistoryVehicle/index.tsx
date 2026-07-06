import { Card, Space } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import {
  defaultColumns,
} from "./config";

type Props = {
  data: any;
};

const ValuationHistoryVehicle = ({ data }: Props) => {

  return (
    <div className="valuation-history-container">
      <Card size="small" className="card-container">
        <Space size={4} style={{ width: "100%" }} direction="vertical">
          <CardTitleCustomUpdate title="Lịch sử định giá" />
          <TableCustom
            columns={defaultColumns}
            bordered
            dataSource={data?.valuationHistories ? data.valuationHistories : []}
            onLimitChange={() => {}}
            onPageChange={() => {}}
            limit={10}
            page={1}
            total={0}
            isLoading={false}
            scroll={{ x: 1366 }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default ValuationHistoryVehicle;
