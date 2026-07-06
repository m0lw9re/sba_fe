import { Card, Col, Input, Row, Space, Typography } from "antd";
import "./style.scss";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const Commant: React.FC<Props> = ({ onChange, value }) => {
  return (
    <Card size="small" className="commant-wrapper">
      <Space
        size={"small"}
        direction="vertical"
        className="commant-wrapper-content"
      >
        <Typography.Title level={5} className="commant-header">
          Ý kiến
        </Typography.Title>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Input.TextArea
              showCount
              size={"small"}
              maxLength={10000}
              style={{ height: 120, marginBottom: 24 }}
              onChange={(e: any) => onChange(e.target.value)}
              value={value}
              placeholder="Nhập"
              allowClear
            />
          </Col>
        </Row>
        {/*<Typography.Link className="commant-footer" underline>*/}
        {/*  Lịch sử phê duyệt TSSS*/}
        {/*</Typography.Link>*/}
      </Space>
    </Card>
  );
};
export default Commant;
