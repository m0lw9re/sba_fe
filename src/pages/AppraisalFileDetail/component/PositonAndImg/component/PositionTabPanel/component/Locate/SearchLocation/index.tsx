import { AutoComplete, Menu } from 'antd';
import { addressApi } from 'apis/adress';
import { appraisalFilesApi } from 'apis/appraisalFiles';
import { RootState } from 'configs/configureStore';
import { AppraisalFileAssetDetailType } from 'constant/types/appraisalFile';
import { getAssetRealEstateData } from 'utils/asset';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import usePlacesAutocomplete, {
  Suggestion,
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { useAppraisalFileDetail } from 'utils/request';
import './style.scss';
interface SearchProps {
  center: {
    lat: number;
    lng: number;
  };
  centerChanged: boolean;
  panTo: (lat: number, lng: number) => void;
}

export default function SearchLocation({
  center,
  centerChanged,
  panTo,
}: SearchProps) {
  let { id }: { id?: string } = useParams();

  const { data: appraisalDetail } = useAppraisalFileDetail(id || '');
  const { provinceOptions } = useSelector((state: RootState) => state.globalSlice)


  const handleGetProvince = (code: string) => {
    const province = provinceOptions?.find((item: any) => item.value === code);
    return province?.label;
  };
  const handleGetDistrict = async (
    provinceCode: string,
    districtCode: string,
  ) => {
    try {
      const districts = await addressApi.getDistricts({
        code: provinceCode,
      });
      const districtName = districts.data?.find(
        (item: any) => item.code === districtCode,
      )?.fullName;
      return districtName;
    } catch (error) {
      console.log('error:', error);
    }
    return null;
  };
  const handleGetWard = async (districtCode: string, wardCode: string) => {
    try {
      const wards = await addressApi.getWards({
        code: districtCode,
      });
      const wardName = wards.data?.find(
        (item: any) => item.code === wardCode,
      )?.fullName;
      return wardName;
    } catch (error) {
      console.log('error:', error);
    }
    return null;
  };

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
        console.log('Error: ', error);
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
  const handleFindLocation = async (
    assetsDetail: AppraisalFileAssetDetailType[],
  ) => {
    // // có định vị user tự chọn
    const realAddress = await handleGetAddress(assetsDetail);
    if (appraisalDetail.latitude && appraisalDetail.longitude) {
      const place = {
        lat: appraisalDetail.latitude || 21.035856,
        lng: appraisalDetail.longitude || 105.7757954545131241423424,
      };
      setValue(`${place.lat}, ${place.lng} (${realAddress})`, false);

      panTo(place.lat, place.lng);
      return;
    } else {
      // tự động tìm định vị bằng địa chỉ
      handleSelect(
        {
          description: realAddress,
        } as Suggestion,
        true,
      );
    }
  };

  const handleGetAddress = async (
    assetsDetail: AppraisalFileAssetDetailType[],
  ) => {
    if (
      appraisalDetail?.assetLevelTwoId === 3 ||
      appraisalDetail?.assetLevelTwoId === 4 ||
      appraisalDetail?.assetLevelTwoId === 5 ||
      appraisalDetail?.assetLevelTwoId === 6 ||
      appraisalDetail?.assetLevelTwoId === 7 ||
      appraisalDetail?.assetLevelTwoId === 8 ||
      appraisalDetail?.assetLevelTwoId === 10
    ) {
      return appraisalDetail?.address;
    }
    const assetObject = getAssetRealEstateData(assetsDetail[0]);

    const addressInfo =
      assetObject?.assetLandInfors?.[0] ||
      assetObject?.assetApartmentInfors?.[0];

    if (!assetsDetail[0] || !assetsDetail[0]?.assetObject || !addressInfo) {
      return null;
    }

    const realProvince = addressInfo.realAddressProvince;
    const realDistrict = addressInfo.realAddressDistrict;
    const realWard = addressInfo.realAddressWard;
    const realStress = addressInfo.realAddressStreet;
    const realAddressDetail = addressInfo.realAddressDetail;
    if (!realProvince || !realDistrict || !realWard) {
      return null;
    }

    const result = await Promise.all([
      handleGetWard(realDistrict, realWard),
      handleGetDistrict(realProvince, realDistrict),
      handleGetProvince(realProvince),
    ]);
    const [wardName, districtName, provinceName] = result;

    const realAddress = `${
      realAddressDetail ? realAddressDetail + ' ' : ''
    }${realStress}, ${wardName}, ${districtName}, ${provinceName}`;
    return realAddress;
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
  const handleFetchAssetsInfo = async () => {
    try {
      const res = await appraisalFilesApi.getAllAssetsDetail(
        appraisalDetail?.assetLevelTwoId,
        appraisalDetail?.assetCommons || [],
      );
      handleFindLocation(res.data || []);
    } catch (error) {
      console.log('error:', error);
    }
  };
  useEffect(() => {
    if (appraisalDetail) {
      handleFetchAssetsInfo();
    }
  }, [appraisalDetail]);

  useEffect(() => {
    if (
      center?.lat &&
      center?.lng &&
      appraisalDetail?.latitude !== center?.lat &&
      appraisalDetail?.longitude !== center?.lng &&
      centerChanged
    ) {
      handleGetAddressFromCoordinate();
    }
  }, [center]);
  return (
    <div className='search-select-google-map-container-appraisal'>
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
