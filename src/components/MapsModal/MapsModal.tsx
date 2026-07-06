import {
  GoogleMap,
  Libraries,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api';
import { Button, Modal, Row, Space } from 'antd';
import Loading from 'components/common/Loading';
import { memo, useEffect, useState } from 'react';
import SearchLocation from './SearchLocation';
import './style.scss';

export type PlaceType2 = {
  lat: number;
  lng: number;
};

type Props = {
  coordinate?: PlaceType2;
  searchingAddress: string;
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
  setPlace: (place: PlaceType2) => void;
  onSave?: (place: any) => void;
  place?: PlaceType2;
};
const placesLibrary: Libraries = ['places', 'geocoding'];

const MapsModal = (props: Props) => {
  const { searchingAddress, place, setPlace, openModal, setOpenModal, onSave } = props;
  const [map, setMap] = useState<google.maps.Map>();
  const containerStyle = {
    width: '100%',
    height: '70vh',
  };

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
    }
  };
  
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

  const handleSaveCoordinate = () => {
    if (onSave && center.lat && center.lng) {
      setPlace(center);
      onSave({
        latitude: center.lat,
        longitude: center.lng,
      });
    }
    setOpenModal(false);
  };
  
  useEffect(() => {
    if (place) {
      setCenter({ lat: place.lat, lng: place.lng });
    }
  }, [JSON.stringify(place)])
  if (!isLoaded) return <Loading />
  return (
    <Modal
      width={1000}
      open={openModal}
      footer={null}
      destroyOnClose={false}
      onCancel={() => setOpenModal(false)}
      centered
      forceRender={false}
      maskClosable={false}
    >
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
              zoom={15}
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
                    align={'top'}
                    style={{ marginTop: '40px' }}
                  >
                    <SearchLocation
                      centerChanged={centerChanged}
                      center={center}
                      panTo={handleCenter}
                      searchingAddress={searchingAddress}
                    />
                    <Button
                      type='primary'
                      size='large'
                      onClick={handleSaveCoordinate}
                      style={{ marginLeft: '8px' }}
                    >
                      Lưu
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
      </Space>
    </Modal>
  );
};

export default memo(MapsModal);
