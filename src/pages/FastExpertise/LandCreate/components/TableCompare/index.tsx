import React, {useState} from "react";
import TableAssetInfo from "./TableAssetInfo";
import {useAppSelector} from "configs/hooks";
const TableCompare = () => {
  const assetInfo = useAppSelector(state => state.fastExpertiseSlice.assetInfo);
  const [adjustTable, setAdjustTable] = useState<any[]>([]);
  const [storedAssets, setStoredAssets] = useState<any[]>([]);

  const handleUpdateAdjustTable = (data: any[]) => {
    setAdjustTable(data);
  };
  const handleUpdateStoredAssets = (data: any[]) => {
    setStoredAssets(data);
  };
  return (
    <>
      {assetInfo?.valuations?.length > 0 && (
        <div>
          <TableAssetInfo
            storedAssets={assetInfo?.valuations}
            // assetLevelTwoId={location.state.assetLevelTwoId}
            adjustTable={adjustTable}
            handleUpdateAdjustTable={handleUpdateAdjustTable}
            handleUpdateStoredAssets={handleUpdateStoredAssets}
          />
        </div>
      )}
    </>
  );
};
export default TableCompare;
