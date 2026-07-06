import { message } from 'antd';
import { assetImageAPI } from 'apis/assetImage';
import { CollapseCustom } from 'components/CollapseCustom';
import { APPRAISAL_IMAGE_UPLOAD_TYPE } from 'constant/common';
import { setRotating } from 'pages/AppraisalFileDetail/store/appraisalFileDetailSlice';
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { useDispatch } from 'react-redux';
import { useAppraisalFileImages } from 'utils/request/useAppraisalFileDetail';
import AppraisalImageTabInfo from './component/AppraisalImageTabInfo/AppraisalImageTabInfo';
import PositonAndImgTab from './component/PositonAndImgTab';
import './style.scss';

type PositionAndImgProps = {
  appraisalFileId: string;
  proposalCode: string | number;
  reportCode: string;
  isMovableEstate: boolean;
  isRoadWater: boolean;
  currentCoordinate: {
    latitude: number;
    longitude: number;
  };
};

type RefProps = {
  updatePositionImage: () => void;
  updateImages: () => void;
};

const PositionAndImg = forwardRef<RefProps, PositionAndImgProps>(
  (
    {
      appraisalFileId,
      proposalCode,
      reportCode,
      currentCoordinate,
      isMovableEstate,
      isRoadWater,
    },
    ref,
  ) => {
    const dispatch = useDispatch();

    const {
      data: listImage = [],
      mutate,
      isLoading,
    } = useAppraisalFileImages(appraisalFileId);
    const btnRefPositonAndImgTab = useRef<{
      updatePositonAndImgTab: () => void;
    }>(null);

    const handleUpdateLocation = async (imageAndPositionData: any) => {
      // update tọa dộ
      if (
        imageAndPositionData?.latitude &&
        imageAndPositionData?.longitude &&
        currentCoordinate.latitude !== imageAndPositionData?.latitude &&
        currentCoordinate.longitude !== imageAndPositionData?.longitude
      ) {
        const result = await assetImageAPI.updateLocate({
          lat: imageAndPositionData?.latitude,
          long: imageAndPositionData?.longitude,
          appraisalFileId,
        });
        if (result.data.code === 200) {
          message.success('Cập nhật tọa độ thành công!');
        } else {
          message.error(result.data.message);
        }
      }
    };
    const handleGetUpdateImages = async () => {
      const imageDiagram: any =
        await btnRefPositonAndImgTab.current?.updatePositonAndImgTab();
      if (imageDiagram.isUploadFailed) {
        return {images: null, captureMapImg: null};
      }

      const images: any = [
        ...(imageDiagram?.imagetab || []),
        ...(imageDiagram?.planImage || []),
      ];
      // MAP_TSTD_AND_TSSS
      const mapTsssImageBackup = listImage.filter(
        (item: any) =>
          item.type === APPRAISAL_IMAGE_UPLOAD_TYPE.MAP_TSTD_AND_TSSS,
      );
      if (mapTsssImageBackup) {
        images.push(...mapTsssImageBackup);
      }

      // backup UPLOAD_IMAGES_MAP_TSTD_AND_TSSS
      const uploadMapImagesBackup = listImage.filter(
        (item: any) =>
          item.type === APPRAISAL_IMAGE_UPLOAD_TYPE.UPLOAD_IMAGES_MAP_TSTD_AND_TSSS,
      );
      if (uploadMapImagesBackup) {
        images.push(...uploadMapImagesBackup);
      }

      if (!imageDiagram?.planImage && listImage.length > 0) {
        // backup ảnh quy hoạch
        const planImage =
          listImage.filter(
            (item: any) => item.type === APPRAISAL_IMAGE_UPLOAD_TYPE.PLAN_IMAGE,
          ) || [];
        if (planImage) {
          images.push(...planImage);
        }
      }

      // upload ảnh định vị
      if (imageDiagram?.captureMapImg?.captureMapImg?.ecmId) {
        images.push(imageDiagram.captureMapImg.captureMapImg);
      } else {
        const captureMapImage =
          listImage.filter(
            (item: any) =>
              item.type === APPRAISAL_IMAGE_UPLOAD_TYPE.LOCATION_IMAGE,
          ) || [];
        if (captureMapImage) {
          images.push(...captureMapImage);
        }
      }
      return {
        images,
        captureMapImg: imageDiagram?.captureMapImg,
      };
    };
    const handleUploadImages = async () => {
      const {images, captureMapImg} = await handleGetUpdateImages();

      // update hình ảnh
      if (images) {
        const resUpdateImage = await assetImageAPI.putUpdateListImage(
          JSON.stringify(images || []),
          appraisalFileId,
        );
        if (resUpdateImage.data.code === 200) {
          message.success('Cập nhật hình ảnh thành công!');
          mutate();
        }
      }

      handleUpdateLocation(captureMapImg);
      return images;
    };

    useEffect(() => {
      dispatch(setRotating(isLoading));
    }, [isLoading]);
    useImperativeHandle(ref, () => ({
      updatePositionImage: handleUploadImages,
      updateImages: handleGetUpdateImages
    }));
    return (
      <>
        {isMovableEstate ? (
          <>
            <AppraisalImageTabInfo />
            <CollapseCustom
              isInner
              itemList={[
                {
                  label: (
                    <span className='image-title'>Hình ảnh và định vị</span>
                  ),
                  children: (
                    <PositonAndImgTab
                      ref={btnRefPositonAndImgTab}
                      listImage={listImage}
                      proposalCode={proposalCode ? proposalCode : reportCode}
                      currentCoordinate={currentCoordinate}
                      // đông sản => không có quy hoạch
                      renderCheckPlanningMap={!isMovableEstate}
                      // Động sản => Là PTĐB hoặc PTĐT
                      renderCheckDiagram={!isRoadWater}
                      renderUploadMoveableLocationImage={isMovableEstate}
                    />
                  ),
                },
              ]}
            />
          </>
        ) : (
          <PositonAndImgTab
            ref={btnRefPositonAndImgTab}
            listImage={listImage}
            proposalCode={proposalCode ? proposalCode : reportCode}
            currentCoordinate={currentCoordinate}
          />
        )}
      </>
    );
  },
);

export default memo(PositionAndImg);
