import { assetDetailApi } from "apis/assetDetail";
import { assetImageAPI } from "apis/assetImage";
import { AssetImageType } from "constant/types";
import { randomId } from "./string";

const LoadImage = async (type: string, filePath: string) => {
  const fileName = filePath.split("/")[3];
  const res = await assetDetailApi.getImage({
    type: type,
    fileName: fileName,
  });
  return res.data;
};
const loadListImage = async (item: AssetImageType) => {
  if (item?.ecmId) {
    try {
      const res = await assetImageAPI.loadImage(item.ecmId);
      if (!res.data) return null;
      const urlImg = URL.createObjectURL(res.data);
      let image = {
        key: randomId(),
        uid: item.ecmId,
        name: item?.filename,
        url: urlImg,
        description: item.description,
      };
      return image;
    } catch (error) {
      // console.log('Rrror get loadListImage:', error)
      return null;
    }
  } else {
    return null;
  }
};

const loadSingleImage = async (ecmId: string | null) => {
  if (ecmId) {
    try {
      const res = await assetImageAPI.loadImage(ecmId);
      if (!res.data) return null;
      const urlImg = URL.createObjectURL(res.data);
      return urlImg;
    } catch (error) {
      // console.log('Rrror get loadListImage:', error)
      return null;
    }
  } else {
    return null;
  }
};
export { LoadImage, loadListImage, loadSingleImage };
