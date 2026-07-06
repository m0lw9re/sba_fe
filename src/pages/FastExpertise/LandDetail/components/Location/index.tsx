import {
  Circle,
  GoogleMap,
  Libraries,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Row, Space } from "antd";
import SearchLocation from "./SearchLocation";
import { useEffect, useState } from "react";
import { PlaceType } from "../..";
import { useAppSelector } from "configs/hooks";
import locationSvg from "assets/images/svg/location-sign-svgrepo-com.svg";
import "./style.scss";

type Props = {
  radiusValue: number;
  setPlace: (place: PlaceType) => void;
};
const placesLibrary: Libraries = ["places", "geocoding"];

const LandInfo = ({ radiusValue, setPlace }: Props) => {
  const assetInfo = useAppSelector(
    (state) => state.fastExpertiseSlice.assetInfo
  );
  const [map, setMap] = useState<google.maps.Map>();
  const containerStyle = {
    width: "100%",
    height: "800px",
  };
  const listTSSS = useAppSelector((state) => state.fastExpertiseSlice.listTSSS);
  const [center, setCenter] = useState<any>();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '',
    libraries: placesLibrary,
    language: "vi",
    region: "VN",
  });
  useEffect(() => {
    handleChangePosition(assetInfo?.latitude, assetInfo?.longitude);
  }, [assetInfo]);
  const handleChangePosition = (lat: number, lng: number) => {
    if (lat && lng) {
      setCenter({ lat, lng });
      // setPlace({lat, lng});
    }
  };
  const handleMapLoad = (map: google.maps.Map) => {
    setMap(map);
  };
  const handleCenter = (lat: number, lng: number) => {
    if (map) {
      map?.setZoom(15);
      setCenter({ lat, lng });
      setPlace({ lat, lng });
      map?.panTo({
        lat,
        lng,
      });
    }
  };

  return (
    <Space
      direction="vertical"
      style={{ width: "100%" }}
      size={"small"}
      className="locate-wrapper"
    >
      {isLoaded ? (
        <div style={{ margin: "0 auto", maxWidth: "1200px" }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={
              center ?? { lat: 21.035856, lng: 105.7757954545131241423424 }
            }
            zoom={10}
            onLoad={handleMapLoad}
            onDblClick={(e) => {
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
                  label={{
                    color: "#333",
                    className: "label-marker-custom",
                    text: "TSĐG",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                  position={
                    center ?? {
                      lat: 21.035856,
                      lng: 105.7757954545131241423424,
                    }
                  }
                />
                <Circle
                  center={
                    center ?? {
                      lat: 21.035856,
                      lng: 105.7757954545131241423424,
                    }
                  }
                  radius={assetInfo?.radius * 1000}
                  options={{
                    fillColor: "#3C9EF2",
                    fillOpacity: 0.2,
                    strokeColor: "#3C9EF2",
                    strokeWeight: 2,
                  }}
                />
                {assetInfo?.valuations
                  ?.filter((e: any) => e?.latitude && e?.longitude)
                  .map((e: any, index: number) => {
                    return (
                      <Marker
                        icon={locationSvg}
                        label={{
                          color: "#333",
                          className: "label-marker-custom",
                          text: `TSSS ${index + 1}`,
                          fontSize: "16px",
                          fontWeight: "bold",
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
    </Space>
  );
};
export default LandInfo;
