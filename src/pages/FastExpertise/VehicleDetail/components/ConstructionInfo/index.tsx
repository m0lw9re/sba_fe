import React, {useEffect, useState} from "react";
import TableAssetInfo from "./TableAssetInfo";
import {useAppSelector} from "configs/hooks";
const ConstructionInfo = () => {
  const listTSSS = useAppSelector(state => state.fastExpertiseSlice.listTSSS);
  const [adjustTable, setAdjustTable] = useState<any[]>([]);
  const [storedAssets, setStoredAssets] = useState<any[]>([]);
  useEffect(() => {
  }, [listTSSS]);
  const handleUpdateAdjustTable = (data: any[]) => {
    setAdjustTable(data);
  };
  const handleUpdateStoredAssets = (data: any[]) => {
    setStoredAssets(data);
  };
  return (
    <div>
      <TableAssetInfo
        storedAssets={listTSSS}
        // assetLevelTwoId={location.state.assetLevelTwoId}
        adjustTable={adjustTable}
        handleUpdateAdjustTable={handleUpdateAdjustTable}
        handleUpdateStoredAssets={handleUpdateStoredAssets}
      />
    </div>
  );
};
export default ConstructionInfo;
