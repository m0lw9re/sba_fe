import { Space } from "antd";
import { AssetObjectRoadVehicleType } from "constant/types/appraisalFile";
import FeatureTableCar from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/FeatureTechnique/component/FeatureTableCar";
import FeatureTableRermoc from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/FeatureTechnique/component/FeatureTableRermoc";
import FeatureTableTruck from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/FeatureTechnique/component/FeatureTableTruck";
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import FeatureTableMoto from "../FeatureTableMoto";
import "./style.scss";

type RefProps = {
  updateFeatureTechniqueTab: () => void;
};

type Props = {
  data: AssetObjectRoadVehicleType;
  assetLevelThreeId: number;
};

const FeatureTechniqueTab = forwardRef<RefProps, Props>(
  ({ data, assetLevelThreeId }, ref) => {
    // 1- xe con / xe khách
    // 2- xe tải
    // 3- rơ mooc
    // 4- moto
    const isCar = assetLevelThreeId === 21 || assetLevelThreeId === 22;
    const isTruck = assetLevelThreeId === 23 || assetLevelThreeId === 26;
    const isRermoc = assetLevelThreeId === 24 || assetLevelThreeId === 25;
    const isMotorbike = assetLevelThreeId === 27;
    const btnValidate = useRef<{
      onValidate: () => any;
    }>(null);

    const renderItem = useCallback(() => {
      if (isCar) {
        return <FeatureTableCar ref={btnValidate} data={data} />;
      } else if (isTruck) {
        return <FeatureTableTruck ref={btnValidate} data={data} />;
      } else if (isRermoc) {
        return <FeatureTableRermoc ref={btnValidate} data={data} />;
      } else if (assetLevelThreeId === 27) {
        return <FeatureTableMoto ref={btnValidate} data={data} />;
      } else {
        return <FeatureTableCar ref={btnValidate} data={data} />;
      }
    }, [assetLevelThreeId, data]);

    useImperativeHandle(ref, () => ({
      updateFeatureTechniqueTab: async () => {
        if (isCar) {
          return await btnValidate.current?.onValidate();
        } else if (isTruck) {
          return await btnValidate.current?.onValidate();
        } else if (isRermoc) {
          return await btnValidate.current?.onValidate();
        } else if (isMotorbike) {
          return await btnValidate.current?.onValidate();
        } else {
          return await btnValidate.current?.onValidate();
        }
      },
    }));
    return (
      <Space
        style={{ width: "100%" }}
        direction="vertical"
        size={"small"}
        className="feature-technique-contain"
      >
        {/* <Form
          labelWrap
          labelAlign="left"
          size="small"
          onFinish={handleFinish}
          onFinishFailed={handleFinishFalse}
          className="feature-technique-form"
        > */}
        {renderItem()}
        {/* </Form> */}
      </Space>
    );
  }
);

export default memo(FeatureTechniqueTab);
