import { ReloadOutlined } from "@ant-design/icons";
import { CollapseCustom } from "components/CollapseCustom";
import { APPRAISAL_IMAGE_UPLOAD_TYPE } from "constant/common";
import { AssetImageType } from "constant/types";
import ImageAddendum from "pages/AppraisalFileDetail/component/PositonAndImg/component/ImagePanelTab/components/ImageAddendum";
import ImageDiagram from "pages/AppraisalFileDetail/component/PositonAndImg/component/ImagePanelTab/components/ImageDiagram";
import { setRotating } from "pages/AppraisalFileDetail/store/appraisalFileDetailSlice";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import "./style.scss";

type Props = {
  assetImages: Array<AssetImageType>;
  proposalCode: string | number;
  renderDiagramImage?: boolean;
};

type RefProps = {
  updateAssetImage: () => void;
};

type IsRotatingState = {
  handleReloadClickAppraisal: boolean;
  handleReloadClickDiagram: boolean;
  handleReloadClickAddendum: boolean;
};
const ImagePanelTab = forwardRef<RefProps, Props>(
  ({ assetImages, proposalCode, renderDiagramImage = true }, ref) => {
    const dispatch = useDispatch();
    let iconStyles: any = document.querySelectorAll(".icon-style");
    const btnRefImageAppraisal = useRef<{ updateImageDiagram: () => void }>(
      null
    );
    const btnRefImageDiagram = useRef<{ updateImageDiagram: () => void }>(null);
    const btnRefImageAddendum = useRef<{ updateImageAddenDum: () => void }>(
      null
    );
    const [isRotating, setIsRotating] = useState<IsRotatingState>({
      handleReloadClickAppraisal: false,
      handleReloadClickDiagram: false,
      handleReloadClickAddendum: false,
    });
    const [firstMount, setFirstMount] = useState<boolean>(true);

    const [listImageDiagram, setListImageDiagram] = useState<any[]>([]);
    const [listImageAddendum, setListImageAddendum] = useState<any[]>([]);
    const [listImageAppraisal, setListImageAppraisal] = useState<any[]>([]);

    useEffect(() => {
      if (
        isRotating.handleReloadClickAppraisal ||
        assetImages.filter(
          (item: any) => item.type === APPRAISAL_IMAGE_UPLOAD_TYPE.NORMAL_IMAGE
        ).length === 0 ||
        firstMount
      ) {
        setListImageAppraisal(
          assetImages.filter(
            (item: any) =>
              item.type === APPRAISAL_IMAGE_UPLOAD_TYPE.NORMAL_IMAGE
          )
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetImages, isRotating.handleReloadClickAppraisal]);

    useEffect(() => {
      if (
        isRotating.handleReloadClickDiagram ||
        assetImages.filter(
          (item: any) => item.type === APPRAISAL_IMAGE_UPLOAD_TYPE.DIAGRAM_IMAGE
        ).length === 0 ||
        firstMount
      ) {
        setListImageDiagram(
          assetImages.filter(
            (item: any) =>
              item.type === APPRAISAL_IMAGE_UPLOAD_TYPE.DIAGRAM_IMAGE
          )
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetImages, isRotating.handleReloadClickDiagram]);

    useEffect(() => {
      if (
        isRotating.handleReloadClickAddendum ||
        assetImages.filter(
          (item: any) =>
            item.type === APPRAISAL_IMAGE_UPLOAD_TYPE.APPENDIX_IMAGE
        ).length === 0 ||
        firstMount
      ) {
        setListImageAddendum(
          assetImages.filter(
            (item: any) =>
              item.type === APPRAISAL_IMAGE_UPLOAD_TYPE.APPENDIX_IMAGE
          )
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetImages, isRotating.handleReloadClickAddendum]);

    useImperativeHandle(ref, () => ({
      updateAssetImage: handleUpdateAssetImageImage,
    }));

    const handleUpdateAssetImageImage = async () => {
      const appraisal: any =
        await btnRefImageAppraisal.current?.updateImageDiagram();
      const diagram: any =
        await btnRefImageDiagram.current?.updateImageDiagram();
      const addendum: any =
        await btnRefImageAddendum.current?.updateImageAddenDum();

      let imageAppraisal = appraisal
        ? [...appraisal.images]
        : [...listImageAppraisal];
      let imageDiagram = diagram ? [...diagram.images] : [...listImageDiagram];
      let addendumImage = addendum
        ? [...addendum.images]
        : [...listImageAddendum];

      return {
        imagetab: [...imageAppraisal, ...imageDiagram, ...addendumImage],
        isUploadFailed:
          (diagram ? diagram.isUploadFailed : false) ||
          (addendum ? addendum.isUploadFailed : false) ||
          (appraisal ? appraisal.isUploadFailed : false),
      };
    };

    const handleReloadClickAppraisal = (e: any) => {
      let iconStyle = iconStyles[0];
      e.stopPropagation();
      setIsRotating((prev) => ({
        ...prev,
        handleReloadClickAppraisal: true,
      }));
      dispatch(setRotating(true));
      setFirstMount(false);
      iconStyle.style.visibility = "visible";
      setTimeout(() => {
        setIsRotating((prev) => ({
          ...prev,
          handleReloadClickAppraisal: false,
        }));
        iconStyle.style.visibility = "hidden";
      }, 2000);
    };

    const handleReloadClickDiagram = (e: any) => {
      let iconStyle = iconStyles[1];
      e.stopPropagation();
      setIsRotating((prev) => ({
        ...prev,
        handleReloadClickDiagram: true,
      }));
      dispatch(setRotating(true));
      setFirstMount(false);
      iconStyle.style.visibility = "visible";
      setTimeout(() => {
        setIsRotating((prev) => ({
          ...prev,
          handleReloadClickDiagram: false,
        }));
        iconStyle.style.visibility = "hidden";
      }, 2000);
    };

    const handleReloadClickAddendum = (e: any) => {
      let iconStyle =
        iconStyles.length > 0 ? iconStyles[iconStyles.length - 1] : null;
      e.stopPropagation();
      setIsRotating((prev) => ({
        ...prev,
        handleReloadClickAddendum: true,
      }));
      dispatch(setRotating(true));
      setFirstMount(false);
      iconStyle.style.visibility = "visible";
      setTimeout(() => {
        setIsRotating((prev) => ({
          ...prev,
          handleReloadClickAddendum: false,
        }));
        if (iconStyle) iconStyle.style.visibility = "hidden";
      }, 2000);
    };

    return (
      <CollapseCustom
        isInner
        defaultActiveKey={["1", "2", "3"]}
        itemList={[
          {
            label: (
              <span className="image-title">
                Upload hình ảnh
                <ReloadOutlined
                  className={`icon-style ${
                    isRotating.handleReloadClickAppraisal ? "rotate" : ""
                  }`}
                  onClick={handleReloadClickAppraisal}
                />
              </span>
            ),
            key: "1",
            children: (
              <ImageDiagram
                type={APPRAISAL_IMAGE_UPLOAD_TYPE.NORMAL_IMAGE}
                ref={btnRefImageAppraisal}
                assetImages={listImageAppraisal}
                proposalCode={proposalCode}
                isRotating={isRotating.handleReloadClickAppraisal}
              />
            ),
          },
          {
            ...(renderDiagramImage
              ? {
                  label: (
                    <span className="image-title">
                      Ảnh sơ đồ
                      <ReloadOutlined
                        className={`icon-style ${
                          isRotating.handleReloadClickDiagram ? "rotate" : ""
                        }`}
                        onClick={handleReloadClickDiagram}
                      />
                    </span>
                  ),
                  key: "2",
                  children: (
                    <ImageDiagram
                      type={APPRAISAL_IMAGE_UPLOAD_TYPE.DIAGRAM_IMAGE}
                      ref={btnRefImageDiagram}
                      assetImages={listImageDiagram}
                      proposalCode={proposalCode}
                      isRotating={isRotating.handleReloadClickDiagram}
                    />
                  ),
                }
              : {}),
          },
          {
            label: (
              <span className="image-title">
                Hình ảnh phụ lục tài sản
                <ReloadOutlined
                  className={`icon-style ${
                    isRotating.handleReloadClickAddendum ? "rotate" : ""
                  }`}
                  onClick={handleReloadClickAddendum}
                />
              </span>
            ),
            key: "3",
            children: (
              <ImageAddendum
                type={APPRAISAL_IMAGE_UPLOAD_TYPE.APPENDIX_IMAGE}
                ref={btnRefImageAddendum}
                assetImages={listImageAddendum}
                proposalCode={proposalCode}
                isRotating={isRotating.handleReloadClickAddendum}
              />
            ),
          },
        ]}
      />
    );
  }
);

export default memo(ImagePanelTab);
