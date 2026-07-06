import {
  GoogleMap,
  Libraries,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import {Row, Space} from "antd";
import SearchLocation from "./SearchLocation";
import { useState} from "react";
import {PlaceType} from "../..";
import {useAppSelector} from "configs/hooks";
import locationSvg from "assets/images/svg/location-sign-svgrepo-com.svg";
type Props = {
  setPlace: (place: PlaceType) => void;
};
const placesLibrary: Libraries = ["places", "geocoding"];

const LandInfo = ({setPlace}: Props) => {
  const [map, setMap] = useState<google.maps.Map>();
  const containerStyle = {
    width: "100%",
    height: "800px",
  };
  const listTSSS = useAppSelector(state => state.fastExpertiseSlice.listTSSS);
  const [center, setCenter] = useState<any>();
  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '',
    libraries: placesLibrary,
    language: "vi",
    region: "VN",
  });

  const handleChangePosition = (lat: number, lng: number) => {
    if (lat && lng) {
      setCenter({lat, lng});
      setPlace({lat, lng});
    }
  };
  const handleMapLoad = (map: google.maps.Map) => {
    setMap(map);
  };
  const handleCenter = (lat: number, lng: number) => {
    if (map) {
      map?.setZoom(15);
      setCenter({lat, lng});
      setPlace({lat, lng});
      map?.panTo({
        lat,
        lng,
      });
    }
  };
  const svgMarker = {
    path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "blue",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
  };

  return (
    <Space
      direction="vertical"
      style={{width: "100%"}}
      size={"small"}
      className="locate-wrapper"
    >
      {isLoaded ? (
        <div style={{margin: "0 auto", maxWidth: "1200px"}}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center ?? {lat: 21.035856, lng: 105.7757954545131241423424}}
            zoom={10}
            onLoad={handleMapLoad}
            onDblClick={e => {
              handleChangePosition(
                e?.latLng?.lat() || 0,
                e?.latLng?.lng() || 0
              );
            }}
          >
            {map && (
              <>
                <Row className="places-container" justify={"center"}>
                  <SearchLocation panTo={handleCenter} />
                </Row>
                <Marker
                  position={
                    center ?? {lat: 21.035856, lng: 105.7757954545131241423424}
                  }
                  label={{
                    color: '#333',
                    className: 'label-marker-custom',
                    text: 'TSTĐ',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                />
                {listTSSS
                  ?.filter((e: any) => e?.latitude && e?.longitude)
                  .map((e: any, index: number) => {
                    return (
                      <Marker
                        icon={locationSvg}
                        position={{
                          lat: e?.latitude,
                          lng: e?.longitude,
                        }}
                        label={{
                          color: '#333',
                          className: 'label-marker-custom',
                          text: `TSSS ${index + 1}`,
                          fontSize: '16px',
                          fontWeight: 'bold',
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
    </Space>
  );
};
export default LandInfo;
