import {
  GoogleMap,
  Libraries,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api';
import { Button, Image, Row, Space, message } from 'antd';
import { appraisalFilesApi } from 'apis/appraisalFiles';
import { assetImageAPI } from 'apis/assetImage';
import locationSvg from 'assets/images/svg/location-sign-svgrepo-com-2.svg';
import markerSvg from 'assets/images/svg/map-marker.png';
import Loading from 'components/common/Loading';
import { APPRAISAL_IMAGE_UPLOAD_TYPE } from 'constant/common';
import { TablePPType } from 'constant/types/appraisalFile';
import { useCaptureFrame } from 'hooks/useCaptureFrame';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppraisalFileDetail } from 'utils/request';
import { useAppraisalFileImages } from 'utils/request/useAppraisalFileDetail';
import './style.scss';

type Props = {
  tablePP: Array<TablePPType>;
};
const placesLibrary: Libraries = ['places', 'geocoding'];
const containerStyle = {
  width: '100%',
  height: '650px',
};

const LocateTstdAndTsss = ({ tablePP }: Props) => {
  let { id }: { id?: string } = useParams();
  const [storedAssetsData, setStoredAssetsData] = useState<any>([]);
  const [tstdData, setTstdData] = useState<any[]>([]);

  const [map, setMap] = useState<google.maps.Map>();
  
  const { data: appraisalFileDetail } = useAppraisalFileDetail(id!);
  const {
    mutate: reLoadListImage,
  } = useAppraisalFileImages(id || '');
  const { handleGetUploadedImage, isLoading, captureImg } = useCaptureFrame({
    appraisalFileId: id!,
    fileName: 'mapCaptureImg.png',
    imageType: APPRAISAL_IMAGE_UPLOAD_TYPE.MAP_TSTD_AND_TSSS,
    reportCode: appraisalFileDetail?.reportCode || 'NULL',
  });

  const [uploadedMapImage, setUploadedMapImage] = useState<any>(null);
  const [center, setCenter] = useState<any>();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '',
    libraries: placesLibrary,
    language: 'vi',
    region: 'VN',
  });

  const handleMapLoad = (map: google.maps.Map) => {
    setMap(map);
  };
  const handleCenter = (lat: number, lng: number) => {
    if (map) {
      map.setZoom(15);
      setCenter({ lat, lng });
      map.panTo({
        lat,
        lng,
      });
    }
  };

  const handleUploadCaptureImage = async () => {
    const map = document.querySelector('.gm-style') as HTMLElement;
    const uploadedData = await handleGetUploadedImage(map);
    const images = [...appraisalFileDetail?.assetImages] || [];
    const removeDuplicateImages = images.filter(
      item => item.type !== APPRAISAL_IMAGE_UPLOAD_TYPE.MAP_TSTD_AND_TSSS,
    );

    if (uploadedData) {
      removeDuplicateImages.push({
        ...uploadedData,
      });

      const resUpdateImage = await assetImageAPI.putUpdateListImage(
        JSON.stringify(removeDuplicateImages),
        appraisalFileDetail.appraisalFileId,
      );
      if (resUpdateImage.data.code === 200) {
        reLoadListImage();
        message.success('Upload ảnh chụp bản đồ thành công');
      } else {
        message.error('Upload ảnh chụp bản đồ thất bại');
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Promise.all(
          tablePP.map(async (item: any) => {
            const res = await appraisalFilesApi.getAssetsValuationDetail({
              appraisalFileId: item.appraisalFileId,
              assetLevelTwoId: item.assetLevelTwoId,
              assetId: item.assetId,
              assetChildId: item.assetChildId,
              assetGrandChildId: item.assetGrandChildId,
              valuationMethodDetailId:
                item.valuationMethodDetails.find((el: any) => el.isCurrent)
                  ?.valuationMethodDetailId || null,
              valuationMethodId:
                item.valuationMethodDetails.find((el: any) => el.isCurrent)
                  ?.valuationMethodId || null,
            });
            return res?.data?.storedAssets || [];
          }),
        );
        const tstdResult: any[] = [];
        const tsssData: any[] = data
          .map((item, index) => {
            const [tstd, ...tsss] = item;
            if (index === 0) {
              tstdResult.push(tstd);
            }
            return tsss;
          })
          .flat();
        setTstdData(tstdResult);
        setStoredAssetsData(tsssData);
      } catch (error) {
        console.log('error:', error);
      }
    };
    fetchData();
  }, [tablePP]);
  useEffect(() => {
    const loadImage = async () => {
      try {
        if (appraisalFileDetail.assetImages) {
          const findMapImage = appraisalFileDetail.assetImages.find(
            (item: any) =>
              item.type === APPRAISAL_IMAGE_UPLOAD_TYPE.MAP_TSTD_AND_TSSS,
          );
          if (findMapImage) {
            // const fileItem = await loadListImage(findMapImage);
            setUploadedMapImage(findMapImage);
          }
        }
      } catch (error) {
        console.log('error:', error);
      }
    };
    loadImage();
  }, [appraisalFileDetail]);

  useEffect(() => {
    if (appraisalFileDetail?.latitude && appraisalFileDetail?.longitude) {
      handleCenter(appraisalFileDetail?.latitude, appraisalFileDetail?.longitude)
    }
  }, [appraisalFileDetail, map]);

  if (!isLoaded) return <Loading />;
  return (
    <Space
      direction='vertical'
      style={{ width: '100%' }}
      size={'small'}
      className='locate-wrapper'
    >
      {isLoaded ? (
        <div style={{ margin: '0 auto', maxWidth: '1200px' }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={handleMapLoad}
          >
            {map && (
              <>
                <Row className='places-container-tstd' justify={'end'}>
                  <Button
                    loading={isLoading}
                    type='primary'
                    onClick={handleUploadCaptureImage}
                    style={{ marginTop: '-16px', marginRight: '75px' }}
                  >
                    {uploadedMapImage ? 'Chụp lại ảnh bản đồ' : 'Chụp ảnh bản đồ'}
                  </Button>
                </Row>
                <Marker 
                  position={center}
                  label={{
                    color: '#333',
                    className: 'label-marker-custom',
                    text: 'TSTĐ',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                  icon={markerSvg}
                />
                {storedAssetsData
                  ?.filter((e: any) => e?.latitude && e?.longitude)
                  .map((e: any, index: number) => {
                    return (
                      <Marker
                        icon={locationSvg}
                        label={{
                          color: '#333',
                          className: 'label-marker-custom',
                          text: `TSSS ${index + 1}`,
                          fontSize: '16px',
                          fontWeight: 'bold',
                        }}
                        position={{
                          lat: e?.latitude,
                          lng: e?.longitude,
                        }}
                      />
                    );
                  })}
              </>
            )}
          </GoogleMap>
        </div>
      ) : (
        <></>
      )}
      {captureImg && <Image width={200} src={captureImg} />}
    </Space>
  );
};

export default LocateTstdAndTsss;
