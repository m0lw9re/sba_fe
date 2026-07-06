import { Col, Row, Space } from "antd";
import { ImageSignatureUpdate } from "../ImageSignatureUpdate";

const SignaturePanel = () => {
  return (
    <Space direction="vertical" style={{ width: "100%" }} size={"small"}>
      <Row gutter={[8, 4]}>
        <Col span={12}>
          <ImageSignatureUpdate label="Người hướng dẫn/Đại diện chủ sở hữu" />
        </Col>
        <Col span={12}>
          <ImageSignatureUpdate label="Nhân viên/Chuyên viên thẩm định giá" />
        </Col>
      </Row>
    </Space>
  );
};

export default SignaturePanel;
