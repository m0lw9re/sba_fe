import TableCustom from "components/TableCustom";
import { defaultColumns } from "pages/PriceSpecific/PriceSpecificProjectAssetDetail/subcomponents/AssetProperty/AddressTable/config";
import React from "react";

type Props = {
  data: any;
};

const AddressTable: React.FC<Props> = ({ data }) => {
  const dataSource: Array<any> = [
    {
      key: 1,
      provinceName: data?.provinceName,
      districtName: data?.districtName,
      wardName: data?.wardName,
      appraisalLocation: data?.appraisalLocation,
      currentAsset: data?.currentAsset,
      areaWidth: data?.areaWidth,
      description: data?.description,
    },
  ];

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
