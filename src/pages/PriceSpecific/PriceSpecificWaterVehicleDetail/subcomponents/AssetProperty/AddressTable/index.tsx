import TableCustom from "components/TableCustom";
import {
  defaultColumns,
} from "./config";
import React, { useEffect, useState } from "react";

type Props = {
  data: any;
};

const AddressTable: React.FC<Props> = ({ data }) => {

  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setDataSource([
        {
          key: 1,
          name: data?.name ? data?.name : '-',
          provinceCode: data?.addressProvince ? data?.addressProvince : '-',
          districtCode: data?.addressDistrict ? data?.addressDistrict : '-',
          wardCode: data?.addressWard ? data?.addressWard : '-',
          addressStreet: data?.addressStreet ? data?.addressStreet : '-',
          addressDetail: data?.addressDetail ? data?.addressDetail : '-',
        },
      ]);
    } else {
      setDataSource([]);
    }
  }, [data]);

  return (
    <div className="address-table-container" style={{ width: "100%" }}>
      <TableCustom
        columns={defaultColumns}
        dataSource={dataSource}
        onLimitChange={() => {}}
        onPageChange={() => {}}
        bordered
        isLoading={false}
        limit={10}
        page={1}
        total={0}
        scroll={{ x: 1366 }}
      />
    </div>
  );
};

export default AddressTable;
