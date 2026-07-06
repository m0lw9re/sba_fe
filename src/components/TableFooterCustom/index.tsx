import { Table } from 'antd';
import './style.scss';

type Props = {
  dataSource: Array<any>;
  columns: any[];
  isLoading?: boolean;
  bordered?: boolean;
};
// table with text bold and no header
const TableFooterCustom = (props: Props) => {
  const { dataSource, columns, bordered = true, isLoading, ...rest } = props;
  return (
    <div style={{ marginBottom: '4px' }}>
      <Table
        {...rest}
        showHeader={false}
        size='small'
        className='table-footer-custom'
        dataSource={dataSource}
        columns={columns}
        bordered={bordered}
        loading={isLoading}
      />
    </div>
  );
};

export default TableFooterCustom;
