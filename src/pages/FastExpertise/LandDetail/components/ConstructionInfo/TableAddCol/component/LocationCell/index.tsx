import { Button, Row } from "antd";
import { LocationSVG } from "assets";
import "./style.scss";
const LocationCell = ({ coordinate }: { coordinate: any }) => {
  return (
    <Row className="cell-local">
      <Button
        size="small"
        type="text"
        className="cell-local-button"
        icon={<LocationSVG />}
      ></Button>
      {coordinate
        ? [coordinate.latitude, coordinate.longitude].join(",")
        : null}
    </Row>
  );
};

export default LocationCell;
