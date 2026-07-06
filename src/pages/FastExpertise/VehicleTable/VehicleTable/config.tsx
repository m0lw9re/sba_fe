import { Tooltip } from 'antd';
import { ColumnProps } from 'constants/types/common.type';
import { addMonthsToDate } from 'utils';

const defaultColumns: ColumnProps[] = [
  {
    key: 1,
    title: 'STT',
    dataIndex: 'stt',
    width: 45,
    fixed: "left",
    align: "center",
  },
  {
    key: 2,
    title: 'Tên khách hàng',
    dataIndex: 'customerName',
    width: 160,
  },
  {
    key: 3,
    title: 'CCCD/CC/HC/CMTQĐ/MST/ĐKKD',
    dataIndex: 'customerIdentity',
    width: 130,
  },
  {
    key: 4,
    title: 'Nhãn hiệu',
    dataIndex: 'landPlotNumber',
    width: 130,
  },
  {
    key: 5,
    title: 'Số loại/Model',
    dataIndex: 'mapSheetNumber',
    width: 130
  },
  {
    key: 6,
    title: 'Màu sơn',
    dataIndex: 'address',
    width: 130,
  },
  {
    key: 7,
    title: 'Diện tích',
    dataIndex: 'totalFloorArea',
    align: 'right',
    width: 130,
  },
  {
    key: 11,
    title: 'Thời gian thực hiện',
    dataIndex: 'dateCreate',
    render: (dateCreate: string) => (
      <>{dateCreate ? addMonthsToDate(dateCreate, 0) : null}</>
    ),
    width: 180,
  },
  {
    key: 11,
    title: 'Người thực hiện',
    dataIndex: 'whoCreate',
    render: (text) => (
      <Tooltip title={text}>
        <div className="inline-text">{text}</div>
      </Tooltip>
    ),
    width: 150,
  },
  {
    key: 10,
    title: 'Hành động',
    dataIndex: '4',
    width: 80,
    fixed: 'right',
    align: 'center',
  },
];
export { defaultColumns };
