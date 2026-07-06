import { AutoComplete, Menu } from 'antd';
import { useEffect, useState } from 'react';
import usePlacesAutocomplete, {
  Suggestion,
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import './style.scss';
interface SearchProps {
  center: {
    lat: number;
    lng: number;
  };
  searchingAddress: string;
  centerChanged: boolean;
  panTo: (lat: number, lng: number) => void;
}

export default function SearchLocation({
  center,
  searchingAddress,
  centerChanged,
  panTo,
}: SearchProps) {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const {
    ready,
    value,
    setValue,
    suggestions: { data: dataSuggestions },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      region: 'vn',
      language: 'vi',
    },
    debounce: 500,
  });

  const handleSelect = (
    { description }: Suggestion,
    autoFillAddress?: boolean,
  ) => {
    setValue(description, false);
    clearSuggestions();

    getGeocode({ address: description })
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        panTo(lat, lng);
      })
      .catch(error => {
        // ZERO_RESULTS
        // nếu không tìm thấy định vị từ địa chỉ => định vị mặc định trụ sở SBA
        if (autoFillAddress) {
          const place = {
            lat: 21.035856,
            lng: 105.7757954545131241423424,
          };
          panTo(place.lat, place.lng);
        }
      });
  };

  // show địa chỉ khi user change tọa độ
  const handleGetAddressFromCoordinate = async () => {
    try {
      setValue(`${center.lat}, ${center.lng}`, false);
      getGeocode({
        location: center,
      }).then(results => {
        let address = '';
        if (
          results[0].types.includes('street_address') ||
          results[0].types.includes('establishment') ||
          results[0].types.includes('home_goods_store') ||
          results[0].types.includes('point_of_interest') ||
          results[0].types.includes('store')
        ) {
          address = results[0].formatted_address;
        }
        if (address) {
          setValue(address, false);
        }
      });
    } catch (error) {
      console.log('error:', error);
    }
    return null;
  };
  // tìm địa chỉ bằng địa chỉ tài sản
  const handleFindLocation = async () => {
    // // có định vị user tự chọn
    if (center?.lat && center?.lng) {
      const place = {
        lat: center.lat,
        lng: center.lng,
      };
      setValue(`${place.lat}, ${place.lng}`, false);

      return;
    } else if (searchingAddress) {
      // tự động tìm định vị bằng địa chỉ
      handleSelect(
        {
          description: searchingAddress,
        } as Suggestion,
        true,
      );
    } else {
      const place = {
        lat: 21.035856,
        lng: 105.7757954545131241423424,
      };
      panTo(place.lat, place.lng); 
      setValue(`${place.lat}, ${place.lng}`, false);
    }
  };

  const handleCheckIsCoordinate = (inputValue: string) => {
    // check xem có phải là tọa độ hay không trước khi định vị
    const regex = new RegExp(
      '^[-+]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?),\\s*[-+]?(180(\\.0+)?|((1[0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)$',
    );
    if (!regex.test(inputValue)) {
      setIsFocus(false);
      return false;
    }
    const [lat, lng] = inputValue.split(',');
    if (lat && lng) {
      panTo(parseFloat(lat), parseFloat(lng));
    }
    setIsFocus(false);
  };

  useEffect(() => {
    if (center?.lat && center?.lng) {
      handleGetAddressFromCoordinate();
    } else {
      handleFindLocation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center]);

  useEffect(() => {
    if (searchingAddress) {
      // tự động tìm định vị bằng địa chỉ
      handleSelect(
        {
          description: searchingAddress,
        } as Suggestion,
        true,
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchingAddress]);

  return (
    <div className='search-select-google-map-container'>
      <AutoComplete
        className='select-search-gmap select-custom'
        size='large'
        placeholder='Nhập vị trí cần tìm'
        disabled={!ready}
        value={value}
        options={dataSuggestions.map(suggestion => {
          const {
            place_id,
            structured_formatting: { main_text, secondary_text },
          } = suggestion;
          return {
            value: place_id,
            label: (
              <div>
                <strong>{main_text}</strong> <span>{secondary_text}</span>
              </div>
            ),
          };
        })}
        onSelect={value => {
          const findSuggestion = dataSuggestions.find(
            (suggestion: any) => suggestion.place_id === value,
          );
          if (findSuggestion) handleSelect(findSuggestion);
        }}
        onSearch={value => setValue(value)}
        onInputKeyDown={e => {
          if (e.key === 'Enter' && isFocus) {
            handleCheckIsCoordinate(value);
          }
        }}
        onFocus={() => setIsFocus(true)}
      />
      {dataSuggestions.length === 0 && value !== '' && isFocus && (
        <div
          className='select-search-gmap select-custom'
          style={{ width: '100%' }}
        >
          <Menu style={{ width: '100%' }}>
            <Menu.Item
              onClick={() => handleCheckIsCoordinate(value)}
              key='1'
              style={{ width: '100%' }}
            >
              <span>{value}</span>
            </Menu.Item>
          </Menu>
        </div>
      )}
    </div>
  );
}
