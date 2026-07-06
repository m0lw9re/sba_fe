import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef
} from "react";
// import ImageTabPanel from "../ImageTabPanel";
// import PositionTabPanel from "../PositionTabPanel";
import { Tabs } from "antd";
import { setImagesAndLocationLoaded } from "configs/globalSlice";
import { AssetImageType } from "constant/types";
import ImagePanelTab from "pages/AppraisalFileDetail/component/PositonAndImg/component/ImagePanelTab";
import PositionTabPanel from "pages/AppraisalFileDetail/component/PositonAndImg/component/PositionTabPanel";
import { useDispatch } from "react-redux";
import "./style.scss";
type PositonAndImgTabProps = {
  listImage: AssetImageType[];
  proposalCode: string | number;
  renderCheckPlanningMap?: boolean;
  renderCheckDiagram?: boolean;
  renderUploadMoveableLocationImage?: boolean;
  currentCoordinate: {
    latitude: number;
    longitude: number;
  };
};
type RefProps = {
  updatePositonAndImgTab: () => void;
};
const PositonAndImgTab = forwardRef<RefProps, PositonAndImgTabProps>(
  ({ listImage, proposalCode, currentCoordinate, renderCheckPlanningMap, renderCheckDiagram, renderUploadMoveableLocationImage }, ref) => {
    const dispatch = useDispatch();
    const btnRefImageTab = useRef<{ updateAssetImage: () => void }>(null);
    const btnRefPositionTab = useRef<{ updateImageAndLocation: () => void }>(
      null
    );
    useImperativeHandle(ref, () => ({
      updatePositonAndImgTab: handleUploadImageAndPosition,
    }));

    const handleUploadImageAndPosition = async () => {
      const imageTab: any = await btnRefImageTab.current?.updateAssetImage();
      const positionTab: any =
        await btnRefPositionTab.current?.updateImageAndLocation();
      return { 
        ...imageTab, 
        ...positionTab,
        isUploadFailed:
        imageTab.isUploadFailed || (positionTab ? positionTab.isUploadFailed : false),
      };
    };
    useEffect(() => {
      dispatch(setImagesAndLocationLoaded(true))
    }, [])
    return (
      <Tabs
        className="assets-code-tab-custom"
        items={[
          {
            key: "image",
            label: "Hình ảnh",
            forceRender: true,
            children: (
              <ImagePanelTab
                ref={btnRefImageTab}
                assetImages={listImage}
                proposalCode={proposalCode}
                renderDiagramImage={renderCheckPlanningMap}
              />
            ),
          },
          {
            key: "position",
            label: "Định vị",
            forceRender: true,
            children: (
              <PositionTabPanel
                ref={btnRefPositionTab}
                assetImages={listImage}
                proposalCode={proposalCode}
                currentCoordinate={currentCoordinate}
                renderCheckPlanningMap={renderCheckPlanningMap}
                // render cho tất cả các loại ts
                // renderMoveableLocationImage={renderUploadMoveableLocationImage}
                renderMoveableLocationImage={true}
              />
            ),
          },
        ]}
      />
    );
  }
);

export default memo(PositonAndImgTab);
