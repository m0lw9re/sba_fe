import {Row} from "antd";
import PdfViewer from "components/PdfViewer";
import {PlaceType} from "../..";
import {useEffect, useState} from "react";
import {useAppSelector} from "configs/hooks";
import {toNumber} from "utils/format";
type Props = {
  place: PlaceType;
};

const Zoning = () => {
  const assetInfo = useAppSelector(state => state.fastExpertiseSlice.assetInfo);
  const [portalUrl, setPortalUrl] = useState("");

  useEffect(() => {
    setPortalUrl(
      `${process.env.REACT_APP_CHECK_PLANNING_LAND_PORTAL}/${toNumber(
        assetInfo?.latitude
      ).toFixed(6)}/${toNumber(assetInfo?.longitude).toFixed(6)}`
    );
  }, [assetInfo]);
  return (
    <div style={{width: "100%"}}>
      <Row className="planning-map-container">
        <PdfViewer src={portalUrl || ""} />
      </Row>
    </div>
  );
};
export default Zoning;
