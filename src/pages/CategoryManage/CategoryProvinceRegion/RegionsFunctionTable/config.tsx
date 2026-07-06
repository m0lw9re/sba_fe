import { ColumnsType } from 'antd/es/table';
import { ProvincesInBranchType } from 'constant/types/common';

const provincesInBranchColumns: ColumnsType<ProvincesInBranchType> = [
  {
    key: 1,
    dataIndex: 'index',
    title: 'STT',
    render: (text, record, rowIndex) => rowIndex + 1,
    width: '10%',
    align: 'center',
  },
  {
    key: 2,
    dataIndex: 'companyBranchCode',
    title: 'Mã chi nhánh',
    width: '35%',
    align: 'center',
  },
  {
    key: 3,
    dataIndex: 'fullName',
    title: 'Tỉnh/Thành phố',
    width: '55%',
  },
];

export { provincesInBranchColumns };
