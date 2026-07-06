import {
  GoogleMap,
  Libraries,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api';
import { Button, Row, Space, Spin, message } from 'antd';
import { assetImageAPI } from 'apis/assetImage';
import { APPRAISAL_IMAGE_UPLOAD_TYPE } from 'constant/common';
import { useCaptureFrame } from 'hooks/useCaptureFrame';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppraisalFileDetail } from 'utils/request';
import { PlaceType } from '../..';
import SearchLocation from './SearchLocation';
import './style.scss';
import { useAppraisalFileImages } from 'utils/request/useAppraisalFileDetail';

export type LocateRefProps = {
  updatePosition: () => void;
};

type Props = {
  proposalCode: string | number;
  setPlace: (place: PlaceType) => void;
  currentCoordinate: {
    latitude: number;
    longitude: number;
  };
};
const placesLibrary: Libraries = ['places', 'geocoding'];
const containerStyle = {
  width: '100%',
  height: '800px',
};

const Locate = forwardRef<LocateRefProps, Props>(
  ({ proposalCode, setPlace, currentCoordinate }, ref) => {
    let { id }: { id?: string } = useParams();
    const { mutate } = useAppraisalFileImages(id!);

    const {
      data: assetImages = [],
    } = useAppraisalFileImages(id!);

    const { handleGetUploadedImage, isLoading, setIsLoading } =
      useCaptureFrame({
        appraisalFileId: id!,
        fileName: 'mapCaptureImg.png',
        imageType: APPRAISAL_IMAGE_UPLOAD_TYPE.LOCATION_IMAGE,
        reportCode: proposalCode || 'NULL',
      });

    const [map, setMap] = useState<google.maps.Map>();
    const [center, setCenter] = useState<any>();
    const [centerChanged, setCenterChanged] = useState<any>(false);

    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '',
      libraries: placesLibrary,
      language: 'vi',
      region: 'VN',
    });

    const handleChangePosition = (lat: number, lng: number) => {
      if (lat && lng) {
        setCenter({ lat, lng });
        setPlace({ lat, lng });
      }
    };

    const handleUploadCaptureImage = async () => {
      const map = document.querySelector('.gm-style') as HTMLElement;
      const uploadedData = await handleGetUploadedImage(map);
      return uploadedData;
    };
    const handleSaveCaptureImage = async () => {
      const images = [...assetImages] || [];
      const uploadedData = await handleUploadCaptureImage();
      const removeDuplicateImages = images.filter(
        item => item.type !== APPRAISAL_IMAGE_UPLOAD_TYPE.LOCATION_IMAGE,
      );

      if (uploadedData) {
        removeDuplicateImages.push({
          ...uploadedData,
        });

        const resUpdateImage = await assetImageAPI.putUpdateListImage(
          JSON.stringify(removeDuplicateImages),
          id!,
        );
        const resUpdateLocation = await assetImageAPI.updateLocate({
          lat: center?.lat,
          long: center?.lng,
          appraisalFileId: id!,
        });
        if (resUpdateImage.data.code === 200 && resUpdateLocation.data.code === 200) {
          message.success('Upload ảnh chụp bản đồ thành công');
          mutate();
        } else {
          message.error('Upload ảnh chụp bản đồ thất bại');
        }
      }
    };

    const handleMapLoad = (map: google.maps.Map) => {
      setMap(map);
    };
    const handleCenter = (lat: number, lng: number) => {
      if (map) {
        map.setZoom(15);
        setCenter({ lat, lng });
        setPlace({ lat, lng });
        map.panTo({
          lat,
          lng,
        });
      }
    };

    useImperativeHandle(ref, () => ({
      updatePosition: async () => {
        if (
          center?.lat &&
          center?.lng &&
          currentCoordinate.latitude !== center?.lat &&
          currentCoordinate.longitude !== center?.lng
        ) {
          const uploadedData = await handleUploadCaptureImage();
          if (!uploadedData) {
            message.error('Chụp ảnh bản đồ thất bại. Vui lòng thử lại');
            setIsLoading(false);
          }
          return {
            latitude: center?.lat || null,
            longitude: center?.lng || null,
            captureMapImg: uploadedData,
          };
        } else {
          return {
            latitude: center?.lat || null,
            longitude: center?.lng || null,
            captureMapImg: null,
          };
        }
      },
    }));

    if (!isLoaded)
      return (
        <Row justify={'center'}>
          <Spin />
        </Row>
      );
    return (
      <Space
        direction='vertical'
        style={{ width: '100%' }}
        size={'small'}
        className='locate-wrapper'
        id='locate-wrapper-id'
      >
        {isLoaded ? (
          <div style={{ margin: '0 auto', maxWidth: '1200px' }}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
              onLoad={handleMapLoad}
              onDblClick={e => {
                handleChangePosition(
                  e?.latLng?.lat() || 0,
                  e?.latLng?.lng() || 0,
                );
                setCenterChanged(true);
              }}
            >
              {map && (
                <>
                  <Row
                    className='places-container'
                    justify={'center'}
                    style={{ columnGap: '12px' }}
                  >
                    <SearchLocation
                      centerChanged={centerChanged}
                      center={center}
                      panTo={handleCenter}
                    />
                    <Button
                      loading={isLoading}
                      type='primary'
                      onClick={handleSaveCaptureImage}
                      style={{ marginTop: '43px' }}
                    >
                      Chụp ảnh bản đồ
                    </Button>
                  </Row>
                  <Marker position={center} />
                </>
              )}
            </GoogleMap>
          </div>
        ) : (
          <></>
        )}
        {/* {captureImg && <Image width={200} src={captureImg} />} */}
      </Space>
    );
  },
);

export default Locate;
