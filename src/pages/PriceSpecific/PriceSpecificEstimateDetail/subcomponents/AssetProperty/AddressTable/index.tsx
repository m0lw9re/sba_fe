import TableCustom from "components/TableCustom";
import {
  defaultColumns,
} from "pages/PriceSpecific/PriceSpecificEstimateDetail/subcomponents/AssetProperty/AddressTable/config";
import React from "react";

type Props = {
  data: any;
};

const AddressTable: React.FC<Props> = ({ data }) => {
  const datasource: Array<any> = [
    {
      key: 1,
      provinceCode: data?.addressProvince,
      districtCode: data?.addressDistrict,
      wardCode: data?.addressWard,
      streetCode: data?.addressStreet,
      subStreetCode: data?.addressDetail,
      detail: data?.address,
    },
  ];

  return (
    <div className="address-table-container" style={{ width: "100%" }}>
      <TableCustom
        columns={defaultColumns}
        dataSource={datasource}
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
