import { Row } from 'antd';
import PdfViewer from 'components/PdfViewer';
import { PlaceType } from '../..';
type Props = {
  place: PlaceType;
};

const ExpertiseInfo = ({ place }: Props) => {
  const { lat, lng } = place;
  const portalUrl = `${
    process.env.REACT_APP_CHECK_PLANNING_LAND_PORTAL
  }/${lat.toFixed(6)}/${lng.toFixed(6)}`;

  return (
    <div style={{ width: '100%' }}>
      <Row className='planning-map-container'>
        <PdfViewer src={portalUrl || ''} />
      </Row>
    </div>
  );
};
export default ExpertiseInfo;
