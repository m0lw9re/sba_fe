import {useState} from "react";
import TableAssetInfo from "./TableAssetInfo";
import {useAppSelector} from "configs/hooks";
const ConstructionInfo = () => {
  const listTSSS = useAppSelector(state => state.fastExpertiseSlice.listTSSS);
  const [adjustTable, setAdjustTable] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [storedAssets, setStoredAssets] = useState<any[]>([]);

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
