import React, { useRef } from "react";
import { Modal, Row, Typography, Button, Space } from "antd";
import { ReactComponent as CloseGallery } from "../../assets/images/svg/CloseGallery.svg";
import { ReactComponent as DownloadGallery } from "../../assets/images/svg/DownloadGallery.svg";
import { ReactComponent as ZoomIn } from "../../assets/images/svg/ZoomIn.svg";
import { ReactComponent as ZoomOut } from "../../assets/images/svg/ZoomOut.svg";
import "./style.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, type Swiper as SwiperRef, Thumbs } from "swiper";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { rest } from "lodash";
type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
};

const imageData = [
  {
    index: 1,
    src: "https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp",
  },
  {
    index: 2,
    src: "https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp",
  },
  {
    index: 3,
    src: "https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp",
  },
  {
    index: 4,
    src: "https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp",
  },
  {
    index: 5,
    src: "https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp",
  },
  {
    index: 6,
    src: "https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp",
  },
];

const ThumbsGallery: React.FC<Props> = ({ isOpenModal, closeModal }) => {
  const activeThumbs = useRef<SwiperRef>();
  const transformWrapperRef = useRef<ReactZoomPanPinchRef>(null);
  return (
    <>
      <Modal
        closable={false}
        onCancel={closeModal}
        open={isOpenModal}
        className="thumbsgallery-modal"
        style={{ top: 0 }}
        footer={false}
        title={
          <>
            <Row justify={"space-between"} align={"middle"}>
              <Typography className="gallery-title">
                Giấy tờ sở hữu đất
              </Typography>
              <Button
                icon={<CloseGallery />}
                onClick={closeModal}
                className="thumbsgallery-close-btn"
              />
            </Row>
          </>
        }
      >
        <Space className="gallery-wraper" direction="vertical" size={0}>
          {imageData && (
            <Swiper
              spaceBetween={10}
              navigation={true}
              thumbs={{ swiper: activeThumbs.current }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="thumbs-gallery"
              slideNextClass="next-gallery"
              draggable={false}
              allowTouchMove={false}
            >
              {imageData.map((image, index) => (
                <SwiperSlide key={index}>
                  <TransformWrapper
                    initialScale={1}
                    initialPositionX={0}
                    initialPositionY={0}
                    ref={transformWrapperRef}
                  >
                    <TransformComponent>
                      <img src={image.src} alt="img" key={index}></img>
                    </TransformComponent>
                  </TransformWrapper>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              //  paddingBottom: '20px'
            }}
          >
            {activeThumbs && (
              <Swiper
                onSwiper={(swiper) => {
                  activeThumbs.current = swiper;
                }}
                spaceBetween={8}
                slidesPerView={5}
                freeMode={true}
                watchSlidesProgress={true}
                slideToClickedSlide={true}
                slidesPerGroup={3}
                className="my-gallery"
              >
                {imageData.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img src={image.src} alt="img" key={index}></img>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
          <Row
            justify={"center"}
            className="btn-gallery-wrapper"
            align={"middle"}
          >
            <Space>
              <Button
                className="galler-action-btn btn-download-img"
                icon={<DownloadGallery />}
              >
                Tải ảnh
              </Button>
              <Button
                className="galler-action-btn btn-zoomin-img"
                icon={<ZoomIn />}
                onClick={() => transformWrapperRef.current?.zoomIn()}
              >
                Phóng to
              </Button>
              <Button
                className="galler-action-btn"
                icon={<ZoomOut />}
                onClick={() => transformWrapperRef.current?.zoomOut()}
              >
                Thu nhỏ
              </Button>
            </Space>
          </Row>
        </Space>
      </Modal>
    </>
  );
};

export default ThumbsGallery;
