import { Space } from 'antd';
import TitleCustom from 'components/TitleCustom';
import { APPRAISAL_IMAGE_UPLOAD_TYPE } from 'constant/common';
import { AssetImageType } from 'constant/types';
import ImageAddendum from 'pages/AppraisalFileDetail/component/PositonAndImg/component/ImagePanelTab/components/ImageAddendum';
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import './style.scss';

type Props = {
  assetImages: Array<AssetImageType>;
  proposalCode: string | number;
};

type RefProps = {
  updateAssetImage: () => void;
};
const ImagePanelTab = forwardRef<RefProps, Props>(
  ({ assetImages, proposalCode }, ref) => {
    const btnRefImageAddendum = useRef<{ updateImageAddenDum: () => void }>(
      null,
    );
    const [listImageAddendum, setListImageAddendum] = useState<any[]>([]);

    useEffect(() => {
      const images = assetImages.filter(
        (item: any) =>
          item.type ===
          APPRAISAL_IMAGE_UPLOAD_TYPE.UPLOAD_IMAGES_MAP_TSTD_AND_TSSS,
      );
      if (images) {
        setListImageAddendum(images);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetImages]);

    useImperativeHandle(ref, () => ({
      updateAssetImage: handleUpdateAssetImageImage,
    }));

    const handleUpdateAssetImageImage = async () => {
      const addendum: any =
        await btnRefImageAddendum.current?.updateImageAddenDum();

      let addendumImage = addendum
        ? [...addendum.images]
        : [...listImageAddendum];

      return {
        imagetab: [...addendumImage],
        isUploadFailed: addendum ? addendum.isUploadFailed : false,
      };
    };

    return (
      <Space direction='vertical' size={'small'} style={{ width: '100%' }}>
        <TitleCustom title='Upload ảnh chụp bản đồ' size='middle' />
        <ImageAddendum
          type={APPRAISAL_IMAGE_UPLOAD_TYPE.UPLOAD_IMAGES_MAP_TSTD_AND_TSSS}
          ref={btnRefImageAddendum}
          assetImages={listImageAddendum}
          proposalCode={proposalCode}
        />
      </Space>
    );
  },
);

export default memo(ImagePanelTab);
