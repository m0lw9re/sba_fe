import { ExclamationCircleOutlined, RedoOutlined } from "@ant-design/icons";
import { Button, Image } from "antd";
import { TrashWhiteSVG } from "assets";
import Icons from "assets/icons";
import { useEffect, useState } from "react";
import "./style.scss";
interface ImageItemCustomProps {
  src: string;
  onPreview: () => void;
  onRemoved: () => void;
  handleReloadImage?: () => void;
  hasError?: boolean;
}
export const ImageItemCustom = ({
  src,
  onPreview,
  onRemoved,
  hasError,
  handleReloadImage,
}: ImageItemCustomProps) => {
  const [showFill, setShowFill] = useState(false);
  const [renderedSize, setRenderedSize] = useState<any>(null);
  const [fileSize, setFileSize] = useState<any>(null);
  useEffect(() => {
    const fetchImageSize = async () => {
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        const sizeInBytes = blob.size;

        // Convert size from bytes to kilobytes
        const sizeInKb = Math.round(sizeInBytes / 1024);

        setFileSize(sizeInKb);
      } catch (error) {
        console.error("Error fetching image size:", error);
      }
    };

    fetchImageSize();
  }, [src]);

  const handleImageLoad = (event: any) => {
    const img = event.target;
    const renderedWidth = img.width;
    const renderedHeight = img.height;

    const size = `${renderedWidth} x ${renderedHeight}`;
    setRenderedSize(size);
  };

  return (
    <div
      className={`image-container ${
        hasError ? "error" : fileSize === 23 ? "error-src" : ""
      }`}
      onMouseOver={() => setShowFill(true)}
      onMouseLeave={() => setShowFill(false)}
      onClick={handleReloadImage}
    >
      <Image
        src={src}
        preview={false}
        alt="image-upload"
        className="image-contain-upload"
        onLoad={handleImageLoad}
      />
      {(hasError || fileSize === 23) && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "50%",
            transform: "translate(-50%, -50%)",
          }}
          className="error-icon"
        >
          {hasError && (
            <ExclamationCircleOutlined style={{ fontSize: 32, color: "red" }} />
          )}
          {fileSize === 23 && (
            <RedoOutlined style={{ fontSize: 32, color: "rgb(47,107,179)" }} />
          )}
        </div>
      )}
      {showFill && (
        <div
          className={`modal-confirm-action ${!showFill && "hide-fill-control"}`}
        >
          <div className="action-control">
            <Button
              className="buton-action-image"
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
            >
              <Icons.eyeOutlined style={{ fontSize: "20px", color: "white" }} />
            </Button>
            <Button
              className="buton-action-image"
              onClick={(e) => {
                e.stopPropagation();
                onRemoved();
              }}
            >
              <TrashWhiteSVG style={{ marginTop: "2px" }} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
