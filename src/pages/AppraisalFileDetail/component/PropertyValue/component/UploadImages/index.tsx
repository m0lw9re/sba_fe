import { message, Modal, Space } from 'antd';
import { assetImageAPI } from 'apis/assetImage';
import { APPRAISAL_IMAGE_UPLOAD_TYPE } from 'constant/common';
import { ImageInfoType } from 'constant/types/positionAndImg';
import { memo, useRef, useState } from 'react';
import { useAppraisalFileImages } from 'utils/request/useAppraisalFileDetail';
import PositonAndImgTab from './component/PositonAndImgTab';

type Props = {
  appraisalFileId: string;
  proposalCode: string | number;
  reportCode: string;
  openUploadModal: boolean;
  setOpenUploadModal: (value: boolean) => void;
};

const UploadImages = ({
  appraisalFileId,
  proposalCode,
  reportCode,
  openUploadModal,
  setOpenUploadModal,
}: Props) => {
  const [uploading, setUploading] = useState<boolean>(false);

  const { data: listImage = [], mutate } =
    useAppraisalFileImages(appraisalFileId);
  const btnRefPositonAndImgTab = useRef<{
    updatePositonAndImgTab: () => void;
  }>(null);

  const handleGetUpdateImages = async () => {
    const imageDiagram: any =
      await btnRefPositonAndImgTab.current?.updatePositonAndImgTab();
    if (imageDiagram.isUploadFailed) {
      return { images: null, captureMapImg: null };
    }

    const images: ImageInfoType[] = [...listImage] || [];
    const removeDuplicateImages = images.filter(
      item =>
        item.type !==
        APPRAISAL_IMAGE_UPLOAD_TYPE.UPLOAD_IMAGES_MAP_TSTD_AND_TSSS,
    );
    return [...removeDuplicateImages, ...(imageDiagram.imagetab || [])];
  };
  const handleUploadImages = async () => {
    try {
      setUploading(true);
      const images = await handleGetUpdateImages();

      // update hình ảnh
      if (images) {
        const resUpdateImage = await assetImageAPI.putUpdateListImage(
          JSON.stringify(images || []),
          appraisalFileId,
        );
        if (resUpdateImage.data.code === 200) {
          message.success('Cập nhật hình ảnh thành công!');
          mutate();
        }
      }
    } catch (error) {
      console.log('error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      width={1000}
      open={openUploadModal}
      closable={false}
      okButtonProps={{
        loading: uploading,
      }}
      okText='Lưu'
      cancelText='Hủy'
      destroyOnClose
      maskClosable={false}
      onOk={async () => {
        await handleUploadImages();
        setOpenUploadModal(false);
      }}
      onCancel={() => setOpenUploadModal(false)}
    >
      <Space direction='vertical' size={'small'} style={{ width: '100%' }}>
        <PositonAndImgTab
          ref={btnRefPositonAndImgTab}
          listImage={listImage}
          proposalCode={proposalCode ? proposalCode : reportCode}
        />
      </Space>
    </Modal>
  );
};

export default memo(UploadImages);
