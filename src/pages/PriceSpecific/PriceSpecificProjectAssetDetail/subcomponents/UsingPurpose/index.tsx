import { Card, Space } from "antd";
import "./index.scss";
import TableCustom from "components/TableCustom";
import { defaultColumns } from "./config";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";

type Props = {
  data: any;
};

const UsingPurpose: React.FC<Props> = ({ data }) => {
  return (
    <div className="using-purpose-container">
      <Card size="small">
        <Space size={4} style={{ width: "100%" }} direction="vertical">
          <CardTitleCustomUpdate title="Mục đích sử dụng đất" />
          <TableCustom
            columns={defaultColumns}
            bordered
            dataSource={data && data?.length > 0 ? data : []}
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

export default UsingPurpose;
