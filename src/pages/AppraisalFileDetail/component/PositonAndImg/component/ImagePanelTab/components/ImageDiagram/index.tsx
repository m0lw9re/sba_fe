import { Image, Row, Spin, UploadFile, message } from "antd";
import Upload, { RcFile, UploadProps } from "antd/es/upload";
import Dragger from "antd/es/upload/Dragger";
import { assetImageAPI } from "apis/assetImage";
import Icons from "assets/icons";
import { AssetImageType } from "constant/types";
import ImageFormContainer from "pages/AppraisalFileDetail/component/PositonAndImg/component/ImagePanelTab/components/ImageDiagram/ImageFormContainer";
import "pages/AppraisalFileDetail/component/PositonAndImg/component/ImagePanelTab/components/ImageDiagram/style.scss";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState
} from "react";
import { getBase64 } from "utils";
import { base64ToBlob } from "utils/fileReader";
import { loadListImage } from "utils/loadImage";
type Props = {
  assetImages: Array<AssetImageType>;
  proposalCode: string | number;
  type: number;
  isRotating?: boolean;
};

type RefProps = {
  updateImageDiagram: () => void;
};

const ImageDiagram = forwardRef<RefProps, Props>(
  ({ assetImages, proposalCode, type, isRotating }, ref) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpenDragger, setIsOpenDragger] = useState<boolean>(true);
    const [previewImageIndex, setPreviewImageIndex] = useState<number>(0);
    const [previewList, setPreviewList] = useState<string[]>([]);
    const [isOpenPreviewImage, setIsOpenPreviewImage] =
      useState<boolean>(false);
    const handleOpenPreviewImage = async (file: UploadFile) => {
      const previewIndex = fileList.findIndex((item) => item.uid === file.uid);

      setPreviewImageIndex(previewIndex || 0);
      setIsOpenPreviewImage(true);
    };

    const handleRemoveImage = (uid: string) => {
      const newFileList = fileList.filter((item) => item.uid !== uid);
      setFileList(newFileList);
    };

    const handleReloadImage = async (file: UploadFile) => {
      let reloadImage: any = assetImages.filter(
        (item) => item.ecmId === file.uid
      );
      reloadImage = { ...reloadImage[0] };
      const fileItem = await loadListImage(reloadImage);
      const updatedFileList: any = fileList.map((item) => {
        if (item.uid === fileItem?.uid) {
          return fileItem;
        }
        return item;
      });
      setFileList(updatedFileList);
    };

    const handleChange: UploadProps["onChange"] = ({
      fileList: newFileList,
    }) => {
      setFileList(newFileList);
    };

    useEffect(() => {
      if (assetImages && assetImages.length > 0) {
        const getAll = async () => {
          const _tmpImages: any[] = [];
          setLoading(true);
          for (let i = 0; i < assetImages.length; i++) {
            const item: AssetImageType = assetImages[i];
            const existLoadedImage = fileList.find((image: any) => image.uid === item.ecmId)
            if (existLoadedImage) {
              _tmpImages.push(existLoadedImage);
              continue;
            }

            let retries = 0;
            let fileItem = null;

            while (!fileItem && retries < 5) {
              fileItem = await loadListImage(item);
              retries++;
              if (!fileItem) {
                // server failed to load image, retrying... after 200ms
                await new Promise((resolve) => setTimeout(resolve, 200));
              }
            }

            if (fileItem) {
              _tmpImages.push(fileItem);
            }
          }
          setFileList([..._tmpImages]);
          setLoading(false);
        };

        getAll();

        setIsOpenDragger(false);
      } else {
        setFileList([]);
      }
    }, [JSON.stringify(assetImages.map((item: AssetImageType) => item.ecmId))]);

    useEffect(() => {
      try {
        const _tmpPreviewList: string[] = [];
        fileList.map(async (file: any) => {
          let previewUrl = "";
          if (!file.url && !file.preview) {
            const base64 = await getBase64(file.originFileObj as RcFile);
            const blob = base64ToBlob(base64);
            previewUrl = URL.createObjectURL(blob);
          } else {
            previewUrl = file.url || (file.preview as string);
          }
          _tmpPreviewList.push(previewUrl);
        });
        setPreviewList(_tmpPreviewList);
      } catch (error) {
        console.log("error:", error);
      }
    }, [fileList]);

    const props: UploadProps = {
      name: "file",
      accept: ".png, .jpg, .jpeg",
      multiple: true,
      maxCount: 30,
      fileList,
      onChange(info) {
        setIsOpenDragger(false);
        setFileList(info.fileList);
      },
    };

    const uploadButton = (
      <div>
        <Icons.add />
        <div style={{ marginTop: 8, color: "#2862AF" }}>Upload ảnh</div>
      </div>
    );

    useImperativeHandle(ref, () => ({
      updateImageDiagram: handleUploadImageDiagram,
    }));

    const handleCustomStatusUpload = (options: any) => {
      if (options.onSuccess()) {
        options.onSuccess();
      }
      return 1;
    };

    const handleUploadImageDiagram = async () => {
      let oldImages: Array<AssetImageType> = [];
      let newImagesInfor: Array<AssetImageType> = [];
      if (assetImages && assetImages.length > 0) {
        oldImages = assetImages.filter(
          (item) =>
            fileList.findIndex((itemSub) => itemSub.uid === item.ecmId) >= 0
        );
      }
      let newImages = fileList.filter(
        (item) =>
          assetImages.findIndex((itemSub) => itemSub.ecmId === item.uid) < 0
      );
      // newImages = newImages.slice(
      //   -(fileList.length - refPrevFileList.current.length)
      // );
      // refPrevFileList.current = fileList;
      if (newImages && newImages.length > 0) {
        let maxRetries = 3;
        let retryCount = 0;
        let newImagesInfor = [];
        while (retryCount < maxRetries) {
          const formData = new FormData();
          newImages.map((item) => {
            formData.append("files", item.originFileObj as RcFile);
          });

          try {
            const res = await assetImageAPI.uploadMultiFiles(
              proposalCode,
              formData
            );
            newImagesInfor = res?.data?.body?.map(
              (item: any, index: number) => {
                return {
                  ...item,
                  type,
                  assetImageId: null,
                  description: "",
                  uid: newImages[index].uid,
                };
              }
            );
            return {
              images: [...oldImages, ...newImagesInfor],
              isUploadFailed: false,
            };
          } catch {
            retryCount++;
          }
        }

        if (retryCount === maxRetries) {
          message.error("Upload ảnh thất bại!");
          return {
            images: [...oldImages],
            isUploadFailed: true,
          }
        }
      }
      return {
        images: [...oldImages, ...newImagesInfor],
        isUploadFailed: false,
      };
    };

    // useEffect(() => {
    //   if (isRotating) {
    //     // dispatch(setRotating(true));
    //     if (assetImages && assetImages.length === 0) {
    //       setFileList((prevFileList) => []);
    //     } else {
    //       setFileList(fileList.filter((item: any, index: any) => item.key));
    //     }
    //   }
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isRotating]);

    return (
      <>
        {isOpenDragger ? (
          <Dragger {...props} height={202}>
            <p className="ant-upload-text">
              Kéo thả hoặc Upload file từ máy tính
            </p>
            <p style={{ color: "#2862AF", fontSize: "16px" }}>
              Upload ảnh{" "}
              <Icons.upload style={{ fontSize: "20px", marginLeft: "8px" }} />
            </p>
          </Dragger>
        ) : (
          <>
            {
              loading && (
                <Row justify={"center"} align={"middle"} style={{ padding: "12px 0" }}>
                  <Spin />
                </Row>
              )
            }
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
              accept=".png, .jpg, .jpeg"
              itemRender={(originNode, file) => {
                return (
                  <ImageFormContainer
                    file={file}
                    onPreviewImage={handleOpenPreviewImage}
                    onRemoveImage={handleRemoveImage}
                    handleReloadImage={() => handleReloadImage(file)}
                  />
                );
              }}
              className="diagram-form-upload-image"
              customRequest={handleCustomStatusUpload}
              multiple
              maxCount={30}
            >
              {!fileList || fileList.length >= 30 ? null : uploadButton}
            </Upload>
            <Image.PreviewGroup
              preview={{
                visible: isOpenPreviewImage,
                onChange: (current) => setPreviewImageIndex(current),
                onVisibleChange(value) {
                  setIsOpenPreviewImage(value);
                },
                current: previewImageIndex,
              }}
              items={previewList.map((item) => item)}
            ></Image.PreviewGroup>
          </>
        )}
      </>
    );
  }
);

export default memo(ImageDiagram);
