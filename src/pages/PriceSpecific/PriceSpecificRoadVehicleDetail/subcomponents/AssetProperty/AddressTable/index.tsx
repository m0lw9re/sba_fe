import TableCustom from "components/TableCustom";
import {
  defaultColumns,
} from "pages/PriceSpecific/PriceSpecificRoadVehicleDetail/subcomponents/AssetProperty/AddressTable/config";
import React from "react";

type Props = {
  data: any;
};

const AddressTable: React.FC<Props> = ({ data }) => {
  const datasource: Array<any> = [
    {
      key: 1,
      name: data?.assetLevelThreeName + " " + data?.vehicleBrand + " " + data?.vehicleModel + " " + data?.plateNumber ? data?.assetLevelThreeName + " " + data?.vehicleBrand + " " + data?.vehicleModel + " " + data?.plateNumber : '-',
      provinceCode: data?.addressProvinceName ? data?.addressProvinceName : '-',
      districtCode: data?.addressDistrictName ? data?.addressDistrictName : '-',
      wardCode: data?.addressWardName ? data?.addressWardName : '-',
      addressDetail: data?.description ? data?.description : '-',
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
