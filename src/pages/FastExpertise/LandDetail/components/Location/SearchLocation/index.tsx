import { AutoComplete, Menu } from "antd";
import { useAppSelector } from "configs/hooks";
import { useEffect, useState } from "react";
import usePlacesAutocomplete, {
  Suggestion,
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import "./style.scss";
interface SearchProps {
  panTo: (lat: number, lng: number) => void;
}

export default function SearchLocation({ panTo }: SearchProps) {
  const assetInfo = useAppSelector(
    (state) => state.fastExpertiseSlice.assetInfo
  );
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const {
    ready,
    value,
    setValue,
    suggestions: { data: dataSuggestions },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      region: "vn",
      language: "vi",
    },
    debounce: 500,
  });

  useEffect(() => {
    handleSelect(
      {
        description: assetInfo?.address,
      } as Suggestion,
      true
    );
  }, [assetInfo]);
  const handleSelect = (
    { description }: Suggestion,
    autoFillAddress?: boolean
  ) => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(description, false);
    clearSuggestions();

    // Get latitude and longitude via utility functions
    getGeocode({ address: description })
      .then((results) => {
        return getLatLng(results[0]);
      })
      .then(({ lat, lng }) => {
        // dispatch(setAssetInfo({...assetInfo, latitude: lat, longitude: lng}));
        panTo(lat, lng);
      })
      .catch((error) => {
        console.log("Error: ", error);
        // ZERO_RESULTS
        // nếu không tìm thấy định vị từ địa chỉ => định vị mặc định trụ sở SBA
        // if (autoFillAddress) {
        //   const place = {
        //     lat: 21.035856,
        //     lng: 105.7757954545131241423424,
        //   };
        //   panTo(place.lat, place.lng);
        // }
      });
  };
  const handleFindLocation = () => {
    // // có định vị user tự chọn
    if (assetInfo.latitude && assetInfo.longitude) {
      setValue(assetInfo.address, false);
      const place = {
        lat: Number(assetInfo.latitude),
        lng: Number(assetInfo.longitude),
      };
      panTo(place.lat, place.lng);
      return;
    } else {
      // tự động tìm định vị bằng địa chỉ
      handleSelect(
        {
          description: assetInfo.address,
        } as Suggestion,
        true
      );
    }
  };

  const handleCheckIsCoordinate = (inputValue: string) => {
    // check xem có phải là tọa độ hay không trước khi định vị
    const regex = new RegExp(
      "^[-+]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?),\\s*[-+]?(180(\\.0+)?|((1[0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)$"
    );
    if (!regex.test(inputValue)) {
      setIsFocus(false);
      return false;
    }
    const [lat, lng] = inputValue.split(",");
    if (lat && lng) {
      panTo(parseFloat(lat), parseFloat(lng));
    }
    setIsFocus(false);
  };

  useEffect(() => {
    if (assetInfo) {
      handleFindLocation();
    }
  }, [assetInfo]);
  return (
    <div className="search-select-google-map-container">
      <AutoComplete
        className="select-search-gmap select-custom"
        size="large"
        placeholder="Nhập vị trí cần tìm"
        disabled={!ready}
        value={value}
        options={dataSuggestions.map((suggestion) => {
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
        onSelect={(value) => {
          const findSuggestion = dataSuggestions.find(
            (suggestion: any) => suggestion.place_id === value
          );
          if (findSuggestion) handleSelect(findSuggestion);
        }}
        onSearch={(value) => setValue(value)}
        onFocus={() => setIsFocus(true)}
      />
      {dataSuggestions.length === 0 && value !== "" && isFocus && (
        <div
          className="select-search-gmap select-custom"
          style={{ width: "100%" }}
        >
          <Menu style={{ width: "100%" }}>
            <Menu.Item
              onClick={() => handleCheckIsCoordinate(value)}
              key="1"
              style={{ width: "100%" }}
            >
              <span>{value}</span>
            </Menu.Item>
          </Menu>
        </div>
      )}
    </div>
  );
}
