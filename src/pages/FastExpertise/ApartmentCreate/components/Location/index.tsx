import {
  Circle,
  GoogleMap,
  Libraries,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import {Row, Space} from "antd";
import SearchLocation from "./SearchLocation";
import {useState, useEffect} from "react";
import {useAppSelector} from "configs/hooks";
import locationSvg from "assets/images/svg/location-sign-svgrepo-com.svg";

export type PlaceType = {
  lat: number;
  lng: number;
};

const placesLibrary: Libraries = ["places", "geocoding"];

const Location = (props: any) => {
  const {form, values} = props;
  const type = useAppSelector(state => state.fastExpertiseSlice.type);
  const assetInfo = useAppSelector(state => state.fastExpertiseSlice.assetInfo);
  const [map, setMap] = useState<google.maps.Map>();
  const containerStyle = {
    width: "100%",
    height: "800px",
  };
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
    }
  };
  const handleMapLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const handleCenter = (lat: number, lng: number) => {
    if (map) {
      map?.setZoom(15);
      setCenter({lat, lng});
      map?.panTo({
        lat,
        lng,
      });
    }
  };

  useEffect(() => {
    handleChangePosition(assetInfo?.latitude, assetInfo?.longitude);
  }, [assetInfo]);

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
              if (type !== "view") {
                form.setFieldValue("latitude", e?.latLng?.lat());
                form.setFieldValue("longitude", e?.latLng?.lng());
              }

              handleChangePosition(
                e?.latLng?.lat() || 0,
                e?.latLng?.lng() || 0
              );
            }}
          >
            {map && (
              <>
                <Row className="places-container" justify={"center"}>
                  <SearchLocation panTo={handleCenter} form={form}/>
                </Row>
                <Marker
                  position={
                    center ?? {lat: 21.035856, lng: 105.7757954545131241423424}
                  }
                />
                <Circle
                  center={
                    center ?? {lat: 21.035856, lng: 105.7757954545131241423424}
                  }
                  radius={values?.radius * 1000}
                  options={{
                    fillColor: "#3C9EF2",
                    fillOpacity: 0.2,
                    strokeColor: "#3C9EF2",
                    strokeWeight: 2,
                  }}
                />
                {assetInfo?.valuations
                  ?.filter((e: any) => e?.latitude && e?.longitude)
                  .map((e: any) => {
                    return (
                      <Marker
                        icon={locationSvg}
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
export default Location;
