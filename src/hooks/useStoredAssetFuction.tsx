import { Modal, Tabs, TabsProps, message } from "antd";
import Table from "antd/es/table";
import { addressApi } from "apis/adress";
import { compareAssetsAPI } from "apis/compareAssets";
import { TYPE_FIELD } from "constant/enums";
import { AssetImageType, DistrictType, WardType } from "constant/types";
import { OptionType, UploadProps } from "constant/types/common";
import { ComparedAssetLandType } from "constant/types/compareAsset";
import { useState } from "react";
import { numberUtils, randomId } from "utils";
import {
  checkDuplicatedData,
  combineStoredAssetAddress,
  handleUploadImages,
} from "utils/storedAsset";

type Props = {
  compareAssetsData: Array<ComparedAssetLandType>;
  assetType: number;
  onResetForm: () => void;

  onChangeCompareAssets: (data: ComparedAssetLandType[]) => void;
};
export type CompareAssetImagesType = {
  index: number;
  image: Array<AssetImageType>;
};
const { INPUT_NUMBER } = TYPE_FIELD;

const columns: any = [
  {
    key: 1,
    title: "STT",
    dataIndex: "key",
    align: "center",
    width: 50,
  },
  {
    key: 2,
    title: "Mã tài sản",
    dataIndex: "assetCode",
    align: "center",
    width: 150,
  },
  {
    key: 3,
    title: "Địa chỉ",
    dataIndex: "address",
    align: "center",
    width: 300,
  },
  {
    key: 4,
    title: "Giá rao bán (đồng)",
    dataIndex: "estimatePrice",
    align: "right",
    type: INPUT_NUMBER,
    render: (value: any) => {
      return numberUtils.formatNumber(value);
    },
    width: 120,
  },
  {
    key: 5,
    title: "Giá thương lượng (đồng)",
    dataIndex: "transactionPrice",
    align: "right",
    type: INPUT_NUMBER,
    render: (value: any) => {
      return numberUtils.formatNumber(value);
    },
    width: 120,
  },
];

// sử dụng cho các logic khi tạo mới, edit TSSS của BĐS, Dự toán
const useStoredAssetLandFunction = (props: Props) => {
  const { compareAssetsData, assetType, onResetForm, onChangeCompareAssets } =
    props;

  const [listImage, setListImage] = useState<UploadProps[]>([]);
  const [districtOptions, setDistrictOptions] = useState<Array<OptionType[]>>(
    []
  );
  const [wardOptions, setWardOptions] = useState<Array<OptionType[]>>([]);

  const handleReplaceDistrictOptions = (
    index: number,
    newItemOptions: Array<OptionType>
  ) => {
    const newOptions = [...districtOptions];
    newOptions.splice(index, 1, newItemOptions);
    setDistrictOptions(newOptions);
  };
  const handleReplaceWardOptions = (
    index: number,
    newItemOptions: Array<OptionType>
  ) => {
    const newOptions = [...wardOptions];
    newOptions.splice(index, 1, newItemOptions);
    setWardOptions(newOptions);
  };
  const handleChangeDataField = async (
    index: number,
    dataField: string,
    value: any,
    label?: string
  ) => {
    const newData = [...compareAssetsData];
    if (dataField === "addressProvince") {
      newData[index] = {
        ...compareAssetsData[index],
        [dataField]: value as string,
        addressDistrict: null,
        addressProvinceName: label,
        addressWard: null,
        addressStreet: "",
      };
      const response = await addressApi.getDistricts({
        code: value as string,
      });
      const newItemOptions = await response?.data?.map((ele: DistrictType) => {
        return {
          label: ele.fullName,
          value: ele.code,
        };
      });
      handleReplaceDistrictOptions(index, newItemOptions);
    } else if (dataField === "addressDistrict") {
      newData[index] = {
        ...compareAssetsData[index],
        [dataField]: value as string,
        addressDistrictName: label,
        addressWard: null,
        addressStreet: "",
      };
      const response = await addressApi.getWards({ code: value as string });
      const newItemOptions = await response?.data?.map((ele: WardType) => {
        return {
          label: ele.fullName,
          value: ele.code,
        };
      });
      handleReplaceWardOptions(index, newItemOptions);
    } else if (dataField === "addressWard") {
      newData[index] = {
        ...compareAssetsData[index],
        [dataField]: value as string,
        addressWardName: label,
        addressStreet: "",
      };
    } else if (dataField === "coordinate") {
      newData[index] = {
        ...compareAssetsData[index],
        [dataField]: value as any,
        latitude: value?.latitude,
        longitude: value?.longitude,
      };
    } else if (dataField === "usingPurposeId") {
      newData[index] = {
        ...compareAssetsData[index],
        [dataField]: value as any,
        usingPurposeConsolidationIds: [],
        combineUsingPurposeConsolidationDetail: "",
      };
    } else if (dataField === "assetImage") {
      if (setListImage && listImage) {
        if (value?.length === 0) {
          setListImage([]);
        } else {
          const newImage: UploadProps[] = [{ index: index, image: value }];
          const combinedImages = [...listImage, ...newImage];

          const uniqueIndexes: Record<string, boolean> = {};

          const deduplicatedImages = combinedImages.reduce((acc: any, item) => {
            const index = item.index;
            if (!uniqueIndexes[index]) {
              uniqueIndexes[index] = true;
              acc.push(item);
            } else {
              const existingIndex = acc.findIndex(
                (existingItem: any) => existingItem.index === index
              );
              if (existingIndex !== -1) {
                acc[existingIndex] = item;
              }
            }
            return acc;
          }, []);

          setListImage(deduplicatedImages);
        }
      }
    } else {
      newData[index] = {
        ...compareAssetsData[index],
        [dataField]: value,
      };
    }
    if (
      dataField === "transactionPrice" ||
      dataField === "areaWidth" ||
      dataField === "constructionPrice" ||
      dataField === "constructionUnitPrice" ||
      dataField === "totalFloorArea" ||
      dataField === "remainQuality" ||
      dataField === "areaUnplan" ||
      dataField === "percent" ||
      dataField === "areaInplan"
    ) {
      // Lấy các giá trị cần thiết
      const transactionPriceValue = Number(
        newData[index]?.transactionPrice || 0
      );
      const percentValue = Number(newData[index]?.percent || 0) / 100;
      const areaWidthValue = Number(newData[index]?.areaWidth || 0);

      const areaInplanValue = Number(newData[index]?.areaInplan || 0);
      const areaUnplanValue = Number(newData[index]?.areaUnplan || 0);
      const constructionUnitPriceValue = Number(
        newData[index]?.constructionUnitPrice || 0
      );
      const totalFloorAreaValue = Number(newData[index]?.totalFloorArea || 0);
      const remainQualityValue =
        Number(newData[index]?.remainQuality || 0) / 100;

      // Giá trị CTXD constructionPrice
      const resultConstructionPrice =
        constructionUnitPriceValue * totalFloorAreaValue * remainQualityValue;

      // Đơn giá đất landUnitPrice
      const resultLandUnitPrice = areaWidthValue
        ? (transactionPriceValue - resultConstructionPrice) / areaWidthValue
        : 0;

      // tính toán các gia trị mới
      const lGPriceValue =
        numberUtils.roundNumber(
          percentValue * areaUnplanValue * resultLandUnitPrice
        ) || null;

      const lGUnitPriceValue = areaInplanValue
        ? numberUtils.roundNumber(
            (transactionPriceValue -
              (lGPriceValue || 0) -
              resultConstructionPrice) /
              areaInplanValue
          )
        : null;

      newData[index] = {
        ...compareAssetsData[index],
        [dataField]: value,
        landUnitPrice: numberUtils.roundNumber(resultLandUnitPrice) || 0,
        constructionPrice:
          numberUtils.roundNumber(resultConstructionPrice) || 0,
        lGPrice: lGPriceValue,
        lGUnitPrice: lGUnitPriceValue,
      };
    }
    if (dataField === "areaWidth" || dataField === "areaInplan") {
      const areaUnplanValue =
        Number(newData[index]?.areaWidth || 0) -
        Number(newData[index]?.areaInplan || 0);
      newData[index] = {
        ...newData[index],
        [dataField]: value,
        areaUnplan: areaUnplanValue < 0 ? null : areaUnplanValue,
      };
    }

    onChangeCompareAssets(newData);
  };

  const handleGetDistrictAndWard = async (
    asset: ComparedAssetLandType,
    index: number
  ) => {
    // get district and ward base on provinceCode
    const provinceCode = asset.addressProvince;
    const districtCode = asset.addressDistrict;
    if (!provinceCode || !districtCode) return;

    const responseDistricts = await addressApi.getDistricts({
      code: provinceCode as string,
    });
    const newItemDistrictOptions = responseDistricts?.data?.map(
      (ele: DistrictType) => {
        return {
          label: ele.fullName,
          value: ele.code,
        };
      }
    );
    handleReplaceDistrictOptions(index, newItemDistrictOptions);

    const responseWards = await addressApi.getWards({
      code: districtCode as string,
    });
    const newItemWardOptions = responseWards?.data?.map((ele: WardType) => {
      return {
        label: ele.fullName,
        value: ele.code,
      };
    });
    handleReplaceWardOptions(index, newItemWardOptions);
  };

  const handleProcessDuplicatedData = async () => {
    const duplicateIndexes = (await checkDuplicatedData({
      data: compareAssetsData,
      assetType,
    })) as {
      data: any;
      index: number;
    }[];
    // let newImagesInfor: Array<AssetImageType> = [];
    if (duplicateIndexes.length > 0) {
      const duplicateString = duplicateIndexes
        .map((item) => `Tài sản ${item.index + 1}`)
        .join(", ");
      message.error(`Dữ liệu giữa các tài sản trùng nhau: ${duplicateString}`); // message alert
      message.error(`
        Vui lòng kiểm tra các tiêu chí: 
        Tỉnh, Huyện, Xã, Số tờ, Số thửa, số nhà, Tên đường, Diện tích khuôn viên, Thông tin liên hệ và Giá rao bán.
      `);

      if (duplicateIndexes[0].data !== "") {
        duplicateIndexes.map((item) =>
          item.data.map((sub: any, index: number) => (sub.key = index + 1))
        );

        const tabItems: TabsProps["items"] = duplicateIndexes.map((item) => {
          const data = {
            key: (item.index + 1).toString(),
            label: `Tài sản ${item.index + 1}`,
            children: (
              <Table
                size="small"
                className="table-custom"
                dataSource={item?.data || []}
                columns={columns}
                bordered
                pagination={false}
                scroll={{ x: 1366 }}
              />
            ),
          };
          return data;
        });
        Modal.confirm({
          width: "70%",
          title: "Danh sách tài sản trùng lặp",
          okText: "Cập nhật",
          async onOk() {
            const dataUpdate: any = [];

            duplicateIndexes.map(async (item) => {
              item.data.map((sub: any, index: number) => {
                dataUpdate.push(compareAssetsData[index]);
                dataUpdate.map((item: any) => {
                  item.assetId = sub.assetId; // Thêm assetId tài sản cập nhật
                  item.assetCode = sub.assetCode;
                  // if (newImagesInfor && newImagesInfor.length > 0) {
                  //   newImagesInfor.map((image, index) => {
                  //     item.assetImage = image.ecmId;
                  //     return null;
                  //   });
                  // }
                  item.address = combineStoredAssetAddress(item);
                  item.usingPurposeConsolidationIds =
                    typeof item.usingPurposeConsolidationIds === "string"
                      ? item.usingPurposeConsolidationIds
                      : item.usingPurposeConsolidationIds?.join(",") || "";

                  return null;
                });
                return null;
              });

              const response = await compareAssetsAPI.updateStoredAssets(
                dataUpdate,
                assetType || 0
              );
              if (response.data.code === 200) {
                message.success(`Cập nhật ${response.data.message}`);
                onResetForm();
              } else message.error(`${response.data.message}`);
              return null;
            });
          },
          cancelText: "Hủy",
          content: <Tabs defaultActiveKey="1" items={tabItems} />,
        });
      }
      return true;
    } else {
      return false;
    }
  };
  const onUploadImages = async () => {
    return await handleUploadImages(listImage);
  };
  const handleCloneStoredAsset = ({
    newImagesInfor,
  }: {
    newImagesInfor: CompareAssetImagesType[];
    newListImage: Array<UploadProps>;
  }) => {
    const cloneCompareAssets: any = [...compareAssetsData].map((el) => ({
      ...el,
      key: randomId(),
    }));

    for (let i = 0; i < cloneCompareAssets.length; i++) {
      let item = cloneCompareAssets[i];

      if (newImagesInfor) {
        const newAssetImage = newImagesInfor?.[i]?.image
          .map((element) => element.ecmId)
          .join(";");
        // item.assetImage = newImagesInfor[indexImage]?.ecmId;
        item.assetImage = newAssetImage;
      } else item.assetImage = null;

      item.address = combineStoredAssetAddress(item);
      item.usingPurposeConsolidationIds =
        typeof item.usingPurposeConsolidationIds === "string"
          ? item.usingPurposeConsolidationIds
          : item.usingPurposeConsolidationIds?.join(",") || "";
      // return null;
    }
    return cloneCompareAssets;
  };
  const handleEditStoredAsset = async (
    cloneCompareAsset: ComparedAssetLandType
  ) => {
    try {
      const response = await compareAssetsAPI.updateStoredAssets(
        cloneCompareAsset,
        assetType || 0
      );
      if (response.data.code === 200) {
        message.success(`Cập nhật ${response.data.message}`);
        onResetForm();
        // reset image list
        setListImage([]);
        return response.data.data;
      } else {
        message.error(`Cập nhật ${response.data.message}`);
        throw new Error(`Cập nhật ${response.data.message}`);
      }
    } catch (error) {
      return null;
    }
  };
  const handleCreateStoredAsset = async (
    cloneCompareAssets: Array<ComparedAssetLandType>
  ) => {
    try {
      const response = await compareAssetsAPI.createLandEstateStoredAsset(
        cloneCompareAssets as any,
        assetType || 0
      );
      if (response.data.code === 200) {
        message.success(`Tạo mới ${response.data.message}`);
        onResetForm();
        // reset image list
        setListImage([]);
        return response.data.data;
      } else {
        message.error(`Tạo mới ${response.data.message}`);
        throw new Error(`Tạo mới ${response.data.message}`);
      }
    } catch (error) {
      return null;
    }
  };

  return {
    handleProcessDuplicatedData,
    listImage,
    setListImage,
    handleUploadImages: onUploadImages,
    handleEditStoredAsset,
    handleCreateStoredAsset,
    handleCloneStoredAsset,

    districtOptions,
    wardOptions,
    onChangeDataField: handleChangeDataField,
    setWardOptions,
    setDistrictOptions,
    handleGetDistrictAndWard,
  };
};

export default useStoredAssetLandFunction;
