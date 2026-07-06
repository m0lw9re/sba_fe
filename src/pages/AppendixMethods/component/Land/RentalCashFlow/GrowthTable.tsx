import { Form, Table } from 'antd';
import TableFooterCustom from 'components/TableFooterCustom';
import { useEffect, useState } from 'react';
import { useGetDataGrowTable } from 'utils/request/useAppraisalFileDetail';
import {
  GrowthTableType,
  growthTableColumns,
  growthTableFooterColumns,
} from './config';

type Props = {
  data: any;
};
const GrowthTable = ({ data }: Props) => {
  const [dataTable, setDataTable] = useState<GrowthTableType[]>([]);
  const [totalPrice, setTotalPrice] = useState<{
    growthTableTotal: string | number;
    growthTableUnitPrice: string | number;
  }>({
    growthTableTotal: "",
    growthTableUnitPrice: "",
  });
  const {data: dataGrowTable, isLoading} = useGetDataGrowTable(data)
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      if(dataGrowTable?.growthTable?.length > 0) {
        setDataTable(dataGrowTable.growthTable);
        setTotalPrice({
          growthTableTotal: dataGrowTable?.growthTableTotal || '',
          growthTableUnitPrice: dataGrowTable?.growthTableUnitPrice,
        });
      }
    }
  }, [dataGrowTable]);

  return (
    <Form
      labelWrap
      labelAlign="left"
      size="small"
      form={form}
      style={{ display: "flex", flexDirection: "column", rowGap: "12px" }}
    >
      <Table
        size="small"
        bordered
        columns={growthTableColumns}
        dataSource={dataTable || []}
        pagination={false}
        loading={isLoading}
      />
      {totalPrice.growthTableTotal && (
        <TableFooterCustom
          columns={growthTableFooterColumns}
          dataSource={[
            {
              label: 'Tổng cộng',
              value: totalPrice.growthTableTotal,
            },
            {
              label: 'Đơn giá cho TSĐG (Làm tròn)',
              value: totalPrice.growthTableUnitPrice,
            },
          ]}
          isLoading={false}
        />
      )}
    </Form>
  );
};
export default GrowthTable;
