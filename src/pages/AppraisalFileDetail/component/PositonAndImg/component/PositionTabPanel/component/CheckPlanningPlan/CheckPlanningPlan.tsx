import { Row } from 'antd';
import PdfViewer from 'components/PdfViewer';
import { Button } from "antd";
import  { useState, useEffect } from 'react';

import { PlaceType } from '../..';
import './style.scss';

type Props = {
  place: PlaceType;
};

const CheckPlanningPlan = ({ place }: Props) => {

  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [screenSharingStream, setScreenSharingStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (screenSharingStream) {
      screenSharingStream.getTracks()[0].onended = handleScreenSharingEnded
    }

  }, [screenSharingStream]);

  const handleScreenSharingEnded = () => {
    setIsCapturing(false);
    setScreenSharingStream(null);
  };

  const toggleCapture = async () => {
    if (isCapturing) {
      // Stop the screen capture
      const video = document.getElementById('video') as HTMLVideoElement;
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        setIsCapturing(false);

        // Capture a screenshot
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (video.videoWidth && video.videoHeight && canvas && ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const screenshotDataUrl = canvas.toDataURL('image/png');


          // Automatically trigger the download
          const link = document.createElement('a');
          link.href = screenshotDataUrl;
          link.download = 'screenshot.png';
          link.style.display = 'none'; // Hide the link
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const video = document.getElementById('video') as HTMLVideoElement;
        if (video) {
          video.srcObject = stream;
        }
        setIsCapturing(true);
        setScreenSharingStream(stream);
      } catch (error) {
        console.error('Error accessing screen:', error);
      }
    }
  };

  const { lat, lng } = place;
  const portalUrl = `${
    process.env.REACT_APP_CHECK_PLANNING_LAND_PORTAL
  }/${lat.toFixed(6)}/${lng.toFixed(6)}`;


  return (
    <div style={{ width: '100%' }}>
      <Row className='planning-map-container'>
        <PdfViewer src={portalUrl || ''} />
        <Button className="btn-save" onClick={toggleCapture}>{isCapturing ? 'Chụp hình' : 'Bắt đầu chụp hình'}</Button>
          <video id="video" style={{ display: 'none' }} autoPlay />
      </Row>
    </div>
  );
};

export default CheckPlanningPlan;
