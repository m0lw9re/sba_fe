import { message } from 'antd';
import { UploadProps } from 'constant/types/common';

import { RcFile } from 'antd/es/upload';
import { assetImageAPI } from 'apis/assetImage';
import { AssetImageType } from 'constant/types';
import { ComparedAssetLandType } from 'constant/types/compareAsset';
import { CompareAssetImagesType } from 'hooks/useStoredAssetFuction';
type Props = {
  data: Array<ComparedAssetLandType>;
  assetType: number;
};
const checkDuplicatedData = async ({ data, assetType }: Props) => {
  const duplicateIndexes = [];
  // Iterate through each object in the array
  for (let i = 0; i < data.length; i++) {
    const currentObject = data[i];

    // Check if the current object has the same values for the specified fields
    const isDuplicate = data.some(
      (obj, index) =>
        index !== i &&
        obj.addressProvince === currentObject.addressProvince &&
        obj.addressDistrict === currentObject.addressDistrict &&
        obj.addressWard === currentObject.addressWard &&
        obj.addressStreet === currentObject.addressStreet &&
        obj.addressDetail === currentObject.addressDetail &&
        obj.landPlotNumber === currentObject.landPlotNumber &&
        obj.mapSheetNumber === currentObject.mapSheetNumber &&
        obj.areaWidth === currentObject.areaWidth &&
        obj.contact === currentObject.contact &&
        obj.estimatePrice === currentObject.estimatePrice,
    );
    if (isDuplicate) {
      duplicateIndexes.push({
        data: '',
        index: i,
      });
    } else {
      // disable
      // Nếu các dữ liệu tạo ra không trùng nhau thì check tiếp trên hệ thống đã tồn tại chưa
      // let filters = {
      //   assetType: assetType,
      //   // approved: true,
      //   addressProvince: currentObject.addressProvince,
      //   addressDistrict: currentObject.addressDistrict,
      //   addressWard: currentObject.addressWard,
      //   addressStreet: currentObject.addressStreet
      //     ? currentObject.addressStreet
      //     : '',
      //   addressDetail: currentObject.addressDetail
      //     ? currentObject.addressDetail
      //     : '',
      //   mapSheetNumber: currentObject.mapSheetNumber
      //     ? currentObject.mapSheetNumber
      //     : '',
      //   landPlotNumber: currentObject.landPlotNumber
      //     ? currentObject.landPlotNumber
      //     : '',
      //   areaWidth: currentObject.areaWidth,
      //   positionId: currentObject.positionId,
      // };
      // // tìm tsss chưa được duyệt
      // const isDuplicateRes = await compareAssetsAPI.checkDuplicatedData(
      //   { page: 0, limit: 10 },
      //   filters,
      // );
      // // tìm tsss đã được duyệt
      // const isDuplicateResApproved = await compareAssetsAPI.checkDuplicatedData(
      //   { page: 0, limit: 10 },
      //   {
      //     ...filters,
      //     approved: true,
      //   },
      // );
      // // If a duplicate is found, add the index to the result array
      // if (isDuplicateRes.data.count > 0 && isDuplicateRes.data.data) {
      //   const data = isDuplicateRes.data.data.filter(
      //     (item: ComparedAssetLandType) =>
      //       item.assetId !== currentObject.assetId,
      //   );
      //   if (data.length > 0) {
      //     duplicateIndexes.push({
      //       data,
      //       index: i,
      //     });
      //   }
      // }
      // if (
      //   isDuplicateResApproved.data.count > 0 &&
      //   isDuplicateResApproved.data.data
      // ) {
      //   const data = isDuplicateResApproved.data.data.filter(
      //     (item: ComparedAssetLandType) =>
      //       item.assetId !== currentObject.assetId,
      //   );
      //   if (data.length > 0) {
      //     duplicateIndexes.push({
      //       data,
      //       index: i,
      //     });
      //   }
      // }
    }
  }
  return duplicateIndexes;
};
const handleUploadImages = async (listImage: UploadProps[]) => {
  let newImagesInfor: CompareAssetImagesType[] = [];
  let isError = false;
  let newListImage: UploadProps[] = [];
  try {
    newListImage = listImage.filter(item => item.image.length !== 0);
    if (newListImage && newListImage.length > 0) {
      for (let index = 0; index < newListImage.length; index++) {
        const item = newListImage[index];
        const uploadedImages: AssetImageType[] = [];
        // append image to formData
        const formData = new FormData();
        item.image.forEach((element: any) => {
          if (element?.originFileObj) {
            formData.append('files', element.originFileObj as RcFile);
          } else {
            uploadedImages.push(element);
          }
        });
        // check item in formData
        if (formData.getAll('files').length > 0) {
          try {
            // call upload api
            const res = await assetImageAPI.uploadMultiFiles(
              'KhoGia',
              formData,
            );
            // push uploaded image to list
            uploadedImages.push(
              ...res?.data?.body?.map((item: any) => {
                return {
                  ...item,
                  assetImageId: null,
                  description: '',
                };
              }),
            );
          } catch (error: any) {
            console.log(error);
            message.error('Cập nhật ảnh thất bại!');
          }
        }

        newImagesInfor.push({
          index,
          image: uploadedImages,
        });
      }
      return { newImagesInfor, newListImage, isError };
    }
  } catch (error) {
    isError = true;
    return {
      newImagesInfor: [],
      newListImage: [],
      isError,
    };
  }
  return { newImagesInfor, newListImage, isError };
};
const combineStoredAssetAddress = (item: ComparedAssetLandType) => {
  let address = [];
  item?.addressDetail && address.push(item.addressDetail);
  item?.addressStreet && address.push(item.addressStreet);
  address.push(item.addressWardName);
  address.push(item.addressDistrictName);
  address.push(item.addressProvinceName);
  return address.join(', ');
};
export { checkDuplicatedData, combineStoredAssetAddress, handleUploadImages };
