import { RcFile } from 'antd/es/upload';
import { assetImageAPI } from 'apis/assetImage';
import { toPng } from 'html-to-image';
import { useRef, useState } from 'react';
import { dataURItoBlob } from 'utils/fileReader';

type Props = {
  fileName: string;
  reportCode: string | number;
  imageType: number;
  appraisalFileId: string | number;
};
export const useCaptureFrame = (props: Props) => {
  const { appraisalFileId, fileName, imageType, reportCode } = props;
  const [captureImg, setCaptureImg] = useState<string>('');
  const [imageUploadedInfo, setImageUploadedInfo] = useState<RcFile>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const captureRef = useRef<HTMLDivElement | null>(null);

  const handleCapture = async (element: HTMLElement) => {
    let result = null;
    try {
      setIsLoading(true);
      const dataUrl = await toPng(element, {
        includeQueryParams: true,
        quality: 0.6,
        fontEmbedCSS:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500&crossorigin=anonymous',
        preferredFontFormat: 'woff2',
      });
      result = dataUrl;
      setCaptureImg(dataUrl);
    } catch (err) {
      console.error(`Error capturing image: ${err}`);
      result = null;
    } finally {
      setIsLoading(false);
    }

    return result;
  };

  const handleUploadCaptureImage = async (captureUrl: string) => {
    setIsLoading(true);
    let result = null;
    const blob = dataURItoBlob(captureUrl);
    const unixDate = new Date().getTime();
    const file = new File([blob], `${fileName}-${unixDate}.png`, {
      type: blob.type,
    });
    const formData = new FormData();
    formData.append('files', file);
    try {
      const res = await assetImageAPI.uploadMultiFiles(reportCode, formData);
      if (!res.data.body[0]) {
        return null;
      }
      result = {
        ...res.data.body[0],
        type: imageType,
        assetImageId: null,
        appraisalFileId,
      };
      setImageUploadedInfo(result);
      return result;
    } catch {
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetUploadedImage = async (element: HTMLElement | null) => {
    setIsLoading(true);
    if (!element) return null;
    const captureUrl = await handleCapture(element);
    if (!captureUrl) return null;
    const result = await handleUploadCaptureImage(captureUrl);
    setIsLoading(false);
    return result;
  };
  return {
    captureImg,
    isLoading,
    imageUploadedInfo,
    handleGetUploadedImage,
    setIsLoading,
    captureRef,
  };
};
