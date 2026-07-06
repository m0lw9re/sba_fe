import { DATE_TIME_FORMAT } from 'constant/enums';
import dayjs from 'dayjs';
import 'pages/PriceSpecific/subcomponents/PriceSpecificFilter/style.scss';
import { addMonthsToDate, formatDate, numberUtils } from 'utils';

// columns bảng kho giá cụ thể cho động sản
const defaultColumnsApprovedStoredAsset: any[] = [
  {
    key: 1,
    title: 'STT',
    dataIndex: 'key',
    align: 'center',
    width: '75px',
    fixed: 'left',
  },
  {
    key: 2,
    title: 'Mã kho',
    dataIndex: 'assetCode',
    align: 'left',
    width: '200px',
    fixed: 'left',
  },
  {
    key: 21,
    title: 'Mã CLIMS',
    dataIndex: 'climsCode',
    align: 'left',
    width: '130px',
    fixed: 'left',
  },
  {
    key: 4,
    title: 'Phân loại kho',
    dataIndex: 'storedType',
    align: 'left',
    width: '150px',
  },
  {
    key: 4.5,
    title: 'Phân loại tài sản',
    dataIndex: 'assetLevelThreeName',
    align: 'left',
    width: '150px',
  },
  {
    key: 5,
    title: 'Địa chỉ thực tế',
    dataIndex: 'address',
    align: 'left',
    width: '420px',
  },
  {
    key: 10,
    title: 'Giá rao bán (đồng)',
    dataIndex: 'transactionPrice',
    align: 'right',
    render: (transactionPrice: number | null) => (
      <>{transactionPrice ? numberUtils.formatNumber(transactionPrice) : ''}</>
    ),
    width: '130px',
  },
  {
    key: 11,
    title: 'Thời điểm hiệu lực',
    dataIndex: 'appraisalTime',
    width: '150px',
    render: (appraisalTime: string) => {
      return appraisalTime ? formatDate(appraisalTime) : "-";
    },
  },
  {
    key: 12,
    title: 'Thời điểm hết hiệu lực',
    dataIndex: 'expirationTime',
    width: '150px',
    render: (expirationTime: string) => {
      return expirationTime ? formatDate(expirationTime) : "-";
    },
  },
  {
    key: 13,
    title: 'Người tạo',
    dataIndex: 'whoCreate',
    align: 'left',
    width: '180px',
  },
  {
    key: 14,
    title: 'Nguồn thông tin',
    dataIndex: 'infoSourceName',
    width: '150px',
  },
  {
    key: 'actions',
    align: 'center',
    title: 'Hành động',
    fixed: 'right',
    width: '100px',
  },
];

export { defaultColumnsApprovedStoredAsset };
