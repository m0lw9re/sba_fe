import React from "react";
import "pages/ExpertisePriceAsset/style.scss";
import { Col, Row, Space, Typography, Radio, Input, Card, Divider } from "antd";
import MethodTable from "./subcomponents/MethodTable";
import ResultTable from "./subcomponents/ResultTable";

const ExpertisePriceAsset = () => {
  return (
    <div className="expertise-price-asset-wrapper">
      <Space direction="vertical" style={{ width: "100%" }} size={"middle"}>
        <Card>
          <Space direction="vertical" style={{ width: "100%" }} size={"middle"}>
            <Typography className="expertise-price-asset-title">Quyền sử dụng đất/Lợi thế thương mại</Typography>
            <Divider type="horizontal" style={{margin: '0px'}} />
            <Typography className="expertise-price-asset-title">Phương pháp</Typography>
            <MethodTable />
            <Typography className="expertise-price-asset-title">Kết quả</Typography>
            <ResultTable />
            <Space style={{width: '100%'}} direction="vertical" size={'large'}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Typography className="expertise-price-asset-key-title">Lợi thế thương mại</Typography>
              </Col>
              <Col span={16}>
                <Radio.Group value={1}>
                  <Radio value={1}>Có</Radio>
                  <Radio value={2}>Không</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Typography className="expertise-price-asset-key-title">Tổng giá trị quyền sử dụng đất</Typography>
              </Col>
              <Col span={16}>
                <Input value={"1232.2323.23"} />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Typography className="expertise-price-asset-key-title">Tổng giá trị quyền sử dụng đất</Typography>
              </Col>
              <Col span={16}>
                <Input value={"1232.2323.23"} />
              </Col>
            </Row>
            </Space>
          </Space>
        </Card>
        <Card>
          <Space direction="vertical" style={{ width: "100%" }} size={"large"}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Typography className="expertise-price-asset-key-title">Tổng giá trị tài sản(làm tròn)</Typography>
              </Col>
              <Col span={16}>
                <Input value={"8,0000,0000,0000"} />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Typography className="expertise-price-asset-key-title">Bảng chữ</Typography>
              </Col>
              <Col span={16}>
                <Typography>
                  Tám tỉ một triệu bảy trăm bảy mươi tám nghìn đồng
                </Typography>
              </Col>
            </Row>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default ExpertisePriceAsset;
