import { ColumnsType } from "antd/es/table";
import TableCustom from "components/TableCustom";
import { RefuseToPriceType } from "constant/types";
import { memo } from "react";
import { formatDateWithHour } from "utils";
import { useRefuseToPrice } from "utils/request";
import "./style.scss";
import { renderRefusedStatus } from "utils/string";

type Props = {
  appraisalFileId: string;
};

const RefuseToPriceTable = (props: Props) => {
  const { data, isLoading } = useRefuseToPrice(props.appraisalFileId);

  const listData = data ? [data] : [];

  const columns: ColumnsType<RefuseToPriceType> = [
    {
      key: 1,
      title: "Nội dung từ chối",
      dataIndex: "contentRefused",
      align: "left",
    },
    {
      key: 2,
      title: "Loại từ chối",
      dataIndex: "refusedStatus",
      align: "center",
      render: (value?: number | null) => renderRefusedStatus(value),
    },
    {
      key: 3,
      title: "Ngày từ chối",
      dataIndex: "createdDate",
      align: "center",
      render: (createdDate: string) => (
        <>{createdDate ? formatDateWithHour(createdDate) : null}</>
      ),
    },
    {
      key: 4,
      title: "Người từ chối",
      dataIndex: "username",
      align: "center",
    },
  ];

  return (
    <>
      <TableCustom
        bordered={true}
        columns={columns}
        dataSource={listData}
        isLoading={!data && isLoading}
        limit={data?.limit}
        page={data?.page}
        total={data?.total}
        onLimitChange={(limit) => {}}
        onPageChange={(page) => {}}
      />
    </>
  );
};

export default memo(RefuseToPriceTable);
