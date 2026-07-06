import { Card, Form, Row, Space, Typography } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import {
  defaultColumns,
} from "pages/PriceSpecific/PriceSpecificDeviceDetail/subcomponents/AssetValuation/config";
import TableCustom from "components/TableCustom";
import React, { useEffect, useState } from "react";
import { numberUtils } from "utils";

type Props = {
  data: any;
};

const AssetValuation: React.FC<Props> = ({ data }) => {
  const labelCol = { xs: 10, md: 8, lg: 8, xl: 3 };
  const wrapperCol = { xs: 14, md: 16, lg: 16, xl: 21 };
  const [total, setTotal] = useState({
    totalValueRoundedApprovaled: 0,
  });
  const [dataSource, setDataSource] = useState<any[]>();
  
  useEffect(() => {
    const newRecords: any[] = [];

    if (data !== null && data !== undefined) {
      data.body.tableKQDat.forEach((record: any, index: number) => {
          const assetName = data.body.tablePP[0].assetName;
          const valuationMethodDetail = data.body.tablePP[0].valuationMethodDetails.find((method: any) => method.isCurrent);
          const valuationMethodName = valuationMethodDetail ? valuationMethodDetail.valuationMethod.valuationMethodName : '';
        
          const newRecord = {
              assetName,
              valuationMethodName,
              totalAreaApprovaled: record.totalAreaApprovaled,
              type: record.type,
              unitPriceApprovaled: record.unitPriceApprovaled,
              totalValueApprovaled: record.totalValueApprovaled,
          };
  
          newRecords.push(newRecord);
      });
      setTotal({
        totalValueRoundedApprovaled: data.body?.tableTong?.totalValueRoundedApprovaled,
      })
      setDataSource(newRecords)
    }
  }, [data]);

  return (
    <div className="asset-valuation-container">
      <Card size="small" className="card-container">
        <Space size={4} style={{ width: "100%" }} direction="vertical">
          <CardTitleCustomUpdate title="Giá trị tài sản" />
          <TableCustom
            columns={defaultColumns}
            bordered
            dataSource={(dataSource && dataSource?.length > 0)  ? dataSource : []}
            onLimitChange={() => {}}
            onPageChange={() => {}}
            limit={10}
            page={1}
            total={0}
            isLoading={false}
            scroll={{ x: 1366 }}
          />
          <Row>
            <Form
              labelAlign="left"
              labelWrap
              size="small"
              style={{ width: "100%" }}
            >
              <Form.Item
                labelCol={labelCol}
                wrapperCol={wrapperCol}
                label={"Tổng giá trị định giá (đồng)"}
              >
                <Typography.Text strong>{numberUtils.formatNumber(total.totalValueRoundedApprovaled)}</Typography.Text>
              </Form.Item>
            </Form>
          </Row>
        </Space>
      </Card>
    </div>
  );
};

export default AssetValuation;
