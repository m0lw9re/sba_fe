import { useState } from 'react';
type Props = {
  searchingAddress?: string;
};
type PlaceType = {
  lat: number;
  lng: number;
};
const useMapModal = (props: Props) => {
  const { searchingAddress } = props;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [place, setPlace] = useState<PlaceType>();

  return {
    openModal,
    setOpenModal,
    place,
    setPlace,
    searchingAddress,
  };
};

export default useMapModal;
