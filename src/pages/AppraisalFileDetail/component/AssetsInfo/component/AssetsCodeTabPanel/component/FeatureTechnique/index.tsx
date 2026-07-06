import "./style.scss";
import { forwardRef, memo, useImperativeHandle, useRef } from "react";
import FeatureTechniqueTab from "./component/FeatureTechniqueTab";
import { AssetObjectRoadVehicleType } from "constant/types/appraisalFile";

type RefProps = {
  updateFeatureVehicleRoad: () => void;
};

type Props = {
  assetVehicleInfos: AssetObjectRoadVehicleType;
  assetLevelThreeId: number;
};
const FeatureTechnique = forwardRef<RefProps, Props>(
  ({ assetVehicleInfos, assetLevelThreeId }, ref) => {
    const btnRefFeatureTechniqueTab = useRef<{
      updateFeatureTechniqueTab: () => void;
    }>(null);

    useImperativeHandle(ref, () => ({
      updateFeatureVehicleRoad: async () => {
        const res =
          await btnRefFeatureTechniqueTab.current?.updateFeatureTechniqueTab();
        return res;
      },
    }));

    return (
      <div className="feature-tech-tab-wrapper">
        <FeatureTechniqueTab
          ref={btnRefFeatureTechniqueTab}
          data={assetVehicleInfos || {}}
          assetLevelThreeId={assetLevelThreeId}
        />
      </div>
    );
  }
);

export default memo(FeatureTechnique);
