import { Card, Space } from 'antd';
import CardTitleCustomUpdate from 'components/CardTitleCustomUpdate';
import TableCustom from 'components/TableCustom';
import { defaultColumns } from 'pages/PriceSpecific/PriceSpecificEstimateDetail/subcomponents/AssetValuationTSSS/config';
import React, { useEffect, useState } from 'react';

type Props = {
  assetInfor: any;
};

const AssetValuationTSSS: React.FC<Props> = ({ assetInfor }) => {
  const [dataSource, setDataSource] = useState<any[]>();

  useEffect(() => {
    if (assetInfor !== null) {
      const newRecord = {
        usingPurposeName: assetInfor.usingPurposeName,
        areaWidth: assetInfor.areaWidth,
        areaInplan: assetInfor.areaInplan,
        areaUnplan: assetInfor.areaUnplan,
        constructionPrice: assetInfor.constructionPrice,
        estimatePrice: assetInfor.estimatePrice,
        transactionPrice: assetInfor.transactionPrice,
      };
      setDataSource([newRecord]);
    }
  }, [assetInfor]);

  return (
    <div className='asset-valuation-container'>
      <Card size='small' className='card-container'>
        <Space size={4} style={{ width: '100%' }} direction='vertical'>
          <CardTitleCustomUpdate title='Giá trị tài sản' />
          <TableCustom
            columns={defaultColumns}
            bordered
            dataSource={dataSource && dataSource?.length > 0 ? dataSource : []}
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

export default AssetValuationTSSS;
