import { ColumnsType } from 'antd/es/table';
import { formatDate } from 'utils';

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: 'STT',
    render: (text, record, rowIndex) => rowIndex + 1,
    align: 'center',
  },
  {
    key: 2,
    title: 'Từ ngày',
    dataIndex: 'startDate',
    render: (value: string) => {
      return formatDate(value);
    },
  },
  {
    key: 3,
    title: 'Đến ngày',
    dataIndex: 'endDate',
    render: (value: string) => {
      return formatDate(value);
    },
  },
  {
    key: 4,
    title: 'Tên ngày lễ',
    dataIndex: 'holidayInYearName',
  },
  {
    key: 5,
    title: 'Hành động',
    dataIndex: '0',
    align: 'center',
  },
];

export { defaultColumns };
