import { Button, Row } from 'antd';
import { LocationSVG } from 'assets';
import MapsModal from 'components/MapsModal/MapsModal';
import useMapModal from 'hooks/useMapModal';
import { useEffect } from 'react';
import './style.scss';
type PlaceType2 = {
  latitude: number;
  longitude: number;
};
type Props = {
  coordinate?: PlaceType2;
  searchingAddress?: string;
  onChange(data: PlaceType2): void;
};
const LocationCoordinateCell = ({
  coordinate,
  searchingAddress: addressData,
  onChange,
}: Props) => {
  const { openModal, setOpenModal, place, setPlace, searchingAddress } = useMapModal({ searchingAddress: addressData });

  useEffect(() => {
    if (coordinate && coordinate.latitude && coordinate.longitude)
      setPlace({
        lat: coordinate.latitude,
        lng: coordinate.longitude,
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinate]);

  return (
    <Row className='cell-local'>
      <MapsModal
        searchingAddress={searchingAddress || ''}
        openModal={openModal}
        setOpenModal={setOpenModal}
        setPlace={setPlace}
        place={place}
        onSave={onChange}
      />
      <Button
        size='small'
        type='text'
        className='cell-local-button'
        icon={<LocationSVG />}
        onClick={() => setOpenModal(true)}
      ></Button>
      {place ? [place.lat.toFixed(6), place.lng.toFixed(6)].join(',') : null}
    </Row>
  );
};

export default LocationCoordinateCell;
