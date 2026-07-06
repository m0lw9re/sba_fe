import { ColumnsType } from 'antd/es/table';
import TableCustom from 'components/TableCustom';
import { AdditionRequiredType } from 'constant/types/additionRequired';
import { memo } from 'react';
import { formatDateWithHour } from 'utils';
import { useAdditionRequired } from 'utils/request';
import './style.scss';

type Props = {
  appraisalFileId: string | null;
};

const AdditionRequiredTable = (props: Props) => {
  const { data, isLoading } = useAdditionRequired(
    props.appraisalFileId,
  );

  const columns: ColumnsType<AdditionRequiredType> = [
    {
      key: 1,
      title: 'STT',
      align: 'center',
      render: (_, record, index) => {
        return index + 1;
      },
    },
    // {
    //   key: 2,
    //   title: 'Loại hồ sơ',
    //   dataIndex: 'name',
    // },
    {
      key: 3,
      title: 'Nội dung yêu cầu',
      dataIndex: 'requestContent',
      //   render: (staffs, record) => {
      //     return staffs?.map((el: string, index: number) => (
      //       <div key={index}>{el}</div>
      //     ));
      //   },
      align: 'center',
    },
    {
      key: 4,
      title: 'Người yêu cầu',
      dataIndex: 'petitioner',
      //   render: (staffs, record) => {
      //     return staffs?.map((el: string, index: number) => (
      //       <div key={index}>{el}</div>
      //     ));
      //   },
      align: 'center',
    },
    {
      key: 5,
      title: 'Ngày yêu cầu bổ sung hồ sơ',
      dataIndex: 'createdDate',
      //   render: (staffs, record) => {
      //     return staffs?.map((el: string, index: number) => (
      //       <div key={index}>{el}</div>
      //     ));
      //   },
      align: 'left',
      render: (createdDate: string) => (
        <>{createdDate ? formatDateWithHour(createdDate) : null}</>
      ),
    },
  ];

  return (
    <TableCustom
      bordered={true}
      columns={columns}
      dataSource={data? data : []}
      isLoading={!data && isLoading}
      limit={data?.limit}
      page={data?.page}
      total={data?.total}
      onLimitChange={limit => {}}
      onPageChange={page => {}}
    />
  );
};

export default memo(AdditionRequiredTable);
