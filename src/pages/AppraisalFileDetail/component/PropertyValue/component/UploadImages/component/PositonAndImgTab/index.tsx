import { forwardRef, memo, useImperativeHandle, useRef } from 'react';
// import ImageTabPanel from "../ImageTabPanel";
// import PositionTabPanel from "../PositionTabPanel";
import { AssetImageType } from 'constant/types';
import ImagePanelTab from '../ImagePanelTab';
import './style.scss';
type PositonAndImgTabProps = {
  listImage: AssetImageType[];
  proposalCode: string | number;
};
type RefProps = {
  updatePositonAndImgTab: () => void;
};
const PositonAndImgTab = forwardRef<RefProps, PositonAndImgTabProps>(
  ({ listImage, proposalCode }, ref) => {
    const btnRefImageTab = useRef<{ updateAssetImage: () => void }>(null);
    useImperativeHandle(ref, () => ({
      updatePositonAndImgTab: handleUploadImageAndPosition,
    }));

    const handleUploadImageAndPosition = async () => {
      const imageTab: any = await btnRefImageTab.current?.updateAssetImage();
      return {
        ...imageTab,
        isUploadFailed: imageTab.isUploadFailed,
      };
    };

    return (
      <ImagePanelTab
        ref={btnRefImageTab}
        assetImages={listImage}
        proposalCode={proposalCode}
      />
    );
  },
);

export default memo(PositonAndImgTab);
