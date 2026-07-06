import { Card, Space } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import { ASSET_LV2 } from "constant/enums";
import {
  defaultColumns,
  defaultProjectColumns,
} from "pages/PriceSpecific/subcomponents/ValuationHistory/config";

type Props = {
  data: any;
  assetLv2Id?: number;
};

const ValuationHistory = ({ data, assetLv2Id }: Props) => {
  console.log("data: ", data);
  return (
    <div className="valuation-history-container">
      <Card size="small" className="card-container">
        <Space size={4} style={{ width: "100%" }} direction="vertical">
          <CardTitleCustomUpdate title="Lịch sử định giá" />
          <TableCustom
            columns={
              assetLv2Id === ASSET_LV2.PROJECT
                ? defaultProjectColumns
                : defaultColumns
            }
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

export default ValuationHistory;
