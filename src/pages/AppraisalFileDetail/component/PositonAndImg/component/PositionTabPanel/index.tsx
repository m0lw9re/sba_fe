import { ReloadOutlined } from "@ant-design/icons";
import { CollapseCustom } from "components/CollapseCustom";
import { APPRAISAL_IMAGE_UPLOAD_TYPE } from "constant/common";
import { AssetImageType } from "constant/types";
import {
  setRotating,
} from "pages/AppraisalFileDetail/store/appraisalFileDetailSlice";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { useDispatch } from "react-redux";
import ImageAddendum from "../ImagePanelTab/components/ImageAddendum";
import ImageDiagram from "../ImagePanelTab/components/ImageDiagram";
import CheckPlanningPlan from "./component/CheckPlanningPlan/CheckPlanningPlan";
import Locate from "./component/Locate";
import "./style.scss";
type Props = {
  assetImages: Array<AssetImageType>;
  proposalCode: string | number;
  renderCheckPlanningMap?: boolean;
  renderMoveableLocationImage?: boolean;
  currentCoordinate: {
    latitude: number;
    longitude: number;
  };
};
export type RefProps = {
  updateImageAndLocation: () => void;
};
export type PlaceType = {
  lat: number;
  lng: number;
};

type IsRotatingState = {
  handleReloadClickPlanImage: boolean;
};

const PositionTabPanel = forwardRef<RefProps, Props>(
  ({ assetImages, proposalCode, currentCoordinate, renderCheckPlanningMap = true, renderMoveableLocationImage }, ref) => {
    const [place, setPlace] = useState<PlaceType>({
      lat: 0,
      lng: 0,
    });
    const [isRotating, setIsRotating] = useState<IsRotatingState>({
      handleReloadClickPlanImage: false,
    });
    const [listPlanImage, setListPlanImage] = useState<any[]>([]);
    const [listMovableLocationImage, setListMovableLocationImage] = useState<any[]>([]);
    const [firstMount, setFirstMount] = useState<boolean>(true);
    const dispatch = useDispatch();
    let iconStyles: any = document.querySelectorAll(".icon-style");
    const btnRefPlanImage = useRef<{ updateImageDiagram: () => void }>(null);
    const btnRefMovableLocationImage = useRef<{ updateImageAddenDum: () => void }>(null);
    const btnRefLocationImage = useRef<{ updatePosition: () => void }>(null);

    useEffect(() => {
      if (
        isRotating.handleReloadClickPlanImage ||
        assetImages.filter(
          (item: any) => item.type === APPRAISAL_IMAGE_UPLOAD_TYPE.PLAN_IMAGE
        ).length === 0 ||
        firstMount
      ) {
        setListPlanImage(
          assetImages.filter(
            (item: any) =>
              item.type === APPRAISAL_IMAGE_UPLOAD_TYPE.PLAN_IMAGE
          )
        );
        setListMovableLocationImage(
          assetImages.filter(
            (item: any) =>
              item.type === APPRAISAL_IMAGE_UPLOAD_TYPE.LOCATION_IMAGES
          )
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetImages, isRotating.handleReloadClickPlanImage]);

    useImperativeHandle(ref, () => ({
      updateImageAndLocation: handleUpdateAssetImageImage,
    }));

    const handleReloadClickPlanImage = (e: any) => {
      let iconStyle = iconStyles[0];
      e.stopPropagation();
      setIsRotating((prev) => ({
        ...prev,
        handleReloadClickPlanImage: true,
      }));
      dispatch(setRotating(true));
      setFirstMount(false);
      iconStyle.style.visibility = "visible";
      setTimeout(() => {
        setIsRotating((prev) => ({
          ...prev,
          handleReloadClickPlanImage: false,
        }));
        iconStyle.style.visibility = "hidden";
      }, 2000);
    };


    const handleUpdateAssetImageImage = async () => {
      const captureMapImg: any =
        await btnRefLocationImage.current?.updatePosition();

      const planImage: any =
        await btnRefPlanImage.current?.updateImageDiagram();
      const movableLocationImage: any =
        await btnRefMovableLocationImage.current?.updateImageAddenDum();

      let newPlanImage = planImage ? [...planImage.images] : [...listPlanImage];
      let newMovableLocationImage = movableLocationImage ? [...movableLocationImage.images] : [...listMovableLocationImage];
      return {
        captureMapImg,
        planImage: [
          ...newPlanImage, 
          ...newMovableLocationImage
        ],
        isUploadFailed: planImage ? planImage.isUploadFailed : false
      };
    };

    return (
      <CollapseCustom
        isInner
        defaultActiveKey={["1", "2", "3"]}
        itemList={[
          {
            label: "Định vị",
            key: "1",
            children: (
              <Locate
                ref={btnRefLocationImage}
                proposalCode={proposalCode}
                setPlace={setPlace}
                currentCoordinate={currentCoordinate}
              />
            ),
          },
          {
            ...renderMoveableLocationImage ? {
              label: (
                <span className="image-title">
                  Upload định vị
                  <ReloadOutlined
                    className={`icon-style ${isRotating.handleReloadClickPlanImage ? "rotate" : ""
                      }`}
                    onClick={handleReloadClickPlanImage}
                  />
                </span>
              ),
              key: "3",
              children: (
                <ImageAddendum
                  type={APPRAISAL_IMAGE_UPLOAD_TYPE.LOCATION_IMAGES}
                  ref={btnRefMovableLocationImage}
                  assetImages={listMovableLocationImage}
                  proposalCode={proposalCode}
                  isRotating={isRotating.handleReloadClickPlanImage}
                />
              ),
            } : {}
          },
          {
            ...renderCheckPlanningMap ? {
              label: (
                <span className="image-title">
                  Quy hoạch
                  <ReloadOutlined
                    className={`icon-style ${isRotating.handleReloadClickPlanImage ? "rotate" : ""
                      }`}
                    onClick={handleReloadClickPlanImage}
                  />
                </span>
              ),
              key: "2",
              children: (
                <>
                  <CheckPlanningPlan place={place} />
                  <ImageDiagram
                    type={APPRAISAL_IMAGE_UPLOAD_TYPE.PLAN_IMAGE}
                    ref={btnRefPlanImage}
                    assetImages={listPlanImage}
                    proposalCode={proposalCode}
                  />
                </>
              ),
            } : {}
          },
        ]}
      />
    );
  }
);

export default memo(PositionTabPanel);
