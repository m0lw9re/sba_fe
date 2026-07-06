/* eslint-disable react-hooks/exhaustive-deps */
import { Card, message } from "antd";
import { addressApi } from "apis/adress";
import { compareAssetsAPI } from "apis/compareAssets";
import renderRequired from "components/RenderRequire";
import TableAddColEdit from "components/TableAddColEdit";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import { RootState } from "configs/configureStore";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
import { ASSET_LV3, DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import {
  ComparedAssetDeviceCreateType,
  DistrictType,
  WardType,
} from "constant/types";
import { OptionType, UploadProps } from "constant/types/common";
import dayjs from "dayjs";
import { useFormik } from "formik";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { randomId } from "utils";
import { loadSingleImage } from "utils/loadImage";
import {
  combineStoredAssetAddress,
  handleUploadImages,
} from "utils/storedAsset";
import { isDeepEqual, transformRowSchemaToColumnSchema } from "utils/validate";
import {
  defaultItem,
  deviceCompareAssetFormSchema,
  initialValue,
} from "./config";

type FormDataType = {
  compareAssets: ComparedAssetDeviceCreateType[];
};

type Props = {
  formType?: "add" | "edit" | "view";
  assetLevelThreeId: number;
};
type RefProps = {
  onSubmit: () => void;
  setValues: (data: ComparedAssetDeviceCreateType[]) => void;
  values: ComparedAssetDeviceCreateType[];
};

const {
  INPUT,
  SELECT,
  IMAGE,
  DAY_PICKER,
  INPUT_NUMBER,
  PERCENT,
  INPUT_NUMBER_ONLY,
} = TYPE_FIELD;

const StoredAssetDeviceForm = forwardRef<RefProps, Props>((props, ref) => {
  const { formType = "add", assetLevelThreeId } = props;
  const isView = formType === "view";
  const {
    dataSourceOptions,
    infoSourceOptions,
    manufacturingCountryOptions,
    provinceOptions,
  } = useSelector((state: RootState) => state.globalSlice);

  const [districtOptions, setDistrictOptions] = useState<Array<OptionType[]>>(
    initialValue.map(() => [])
  );
  const [wardOptions, setWardOptions] = useState<Array<OptionType[]>>(
    initialValue.map(() => [])
  );

  const [colTable, setColTable] = useState<ColumnsEdit>([]);
  const [listImage, setListImage] = useState<UploadProps[]>([]);

  const formControl = useFormik({
    initialValues: { compareAssets: initialValue } as FormDataType,
    validationSchema: deviceCompareAssetFormSchema,
    validateOnChange: true,
    onSubmit: async (data: FormDataType) => {
      try {
        // upload images
        const { newImagesInfor, isError } = await handleUploadImages(listImage);
        if (isError) return;

        // join image, process data before submit
        const cloneCompareAssets: any = [...data.compareAssets].map((el) => ({
          ...el,
          approved: el.approved === false ? null : el.approved,
          key: randomId(),
        }));

        for (let i = 0; i < cloneCompareAssets.length; i++) {
          let item = cloneCompareAssets[i];
          if (newImagesInfor) {
            const newAssetImage = newImagesInfor?.[i]?.image
              .map((element) => element.ecmId)
              .join(";");
            item.assetImage = newAssetImage;
          } else item.assetImage = null;

          item.address = combineStoredAssetAddress(item);
        }

        if (formType === "edit" || formType === "view") {
          const response = await compareAssetsAPI.updateStoredAssets(
            cloneCompareAssets,
            ASSET_PRICES_SHARED_TYPE.DEVICE
          );
          if (response.data.code === 200) {
            message.success(`Cập nhật ${response.data.message}`);
            formControl.resetForm();
            setListImage([]);
            return response.data.data;
          } else {
            message.error(`Cập nhật ${response.data.message}`);
          }
        } else {
          const response =
            await compareAssetsAPI.createRoadVehicleEstateStoredAsset(
              cloneCompareAssets,
              ASSET_PRICES_SHARED_TYPE.DEVICE
            );
          if (response.data.code === 200) {
            message.success(`Tạo mới ${response.data.message}`);
            formControl.resetForm();
            setListImage([]);
            return response.data.data;
          } else {
            message.error(`Tạo mới ${response.data.message}`);
          }
        }
      } catch {
        // message.error('Lỗi thêm mới tài sản so sánh');
      }
    },
  });

  const handleReplaceDistrictOptions = (
    index: number,
    newItemOptions: OptionType[]
  ) => {
    const newOptions = [...districtOptions];
    newOptions.splice(index, 1, newItemOptions);
    setDistrictOptions(newOptions);
  };

  const handleReplaceWardOptions = (
    index: number,
    newItemOptions: OptionType[]
  ) => {
    const newOptions = [...wardOptions];
    newOptions.splice(index, 1, newItemOptions);
    setWardOptions(newOptions);
  };

  const compareAssets = formControl.values.compareAssets;

  const handleUpdateForm = useCallback(
    (data: Array<ComparedAssetDeviceCreateType>) => {
      formControl.setValues({ compareAssets: data });
    },
    [formControl.values]
  );

  // table logic: add, sub, copy,...
  const handleAddCol = () => {
    handleUpdateForm([
      ...compareAssets,
      {
        ...defaultItem,
        key: randomId(),
      },
    ]);
  };
  const handleSubCol = (index: number) => {
    if (formType === "edit" && index === 0) {
      message.warning("Không thể xoá TSSS gốc khi đang chỉnh sửa");
      return;
    }
    if (compareAssets.length !== 1) {
      const newCompareAsset = [...compareAssets];
      newCompareAsset.splice(index, 1);
      handleUpdateForm(newCompareAsset);
    }
  };
  const handleCoppyCol = (index: number) => {
    const newCompareAssets = [...compareAssets];
    const copyCompareAssets = { ...newCompareAssets[index] };

    // delete copyCompareAssets.assetId
    copyCompareAssets.assetId = null;
    copyCompareAssets.assetCode = null;
    copyCompareAssets.key = randomId();
    copyCompareAssets.storedTypeId = copyCompareAssets.storedTypeId || 2;

    // Cập nhật dữ liệu cho quận/huyện và xã/phường của cột mới
    setDistrictOptions((prev: OptionType[][]) => {
      const newDistrictOptions = prev[index];
      return [...prev, newDistrictOptions];
    });
    setWardOptions((prev: OptionType[][]) => {
      const newWardOptions = prev[index];
      return [...prev, newWardOptions];
    });
    newCompareAssets.splice(index === 0 ? 1 : index, 0, copyCompareAssets);
    handleUpdateForm(newCompareAssets);
  };

  const handleChangeDataField = async (
    index: number,
    dataIndex: string,
    value: any,
    label?: string
  ) => {
    const newData = [...compareAssets];
    if (dataIndex === "addressProvince") {
      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value as string,
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
    } else if (dataIndex === "addressDistrict") {
      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value as string,
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
    } else if (dataIndex === "addressWard") {
      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value as string,
        addressWardName: label,
        addressStreet: "",
      };
    } else if (dataIndex === "assetImage") {
      if (setListImage && listImage) {
        if (value?.length === 0) {
          setListImage([]);
          return;
        }
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
    } else if (
      dataIndex === "transactionPrice" ||
      dataIndex === "estimatedRate"
    ) {
      // Công thức tính ước tính PTĐb -> tạo mới TSSS
      const transactionPrice =
        dataIndex === "transactionPrice"
          ? value
          : Number(newData[index]?.transactionPrice);
      const estimatedRate =
        dataIndex === "estimatedRate"
          ? value
          : Number(newData[index]?.estimatedRate);
      const estimatePrice = transactionPrice * (estimatedRate / 100);

      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value,
        estimatePrice: estimatePrice,
      };
    } else {
      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value,
      };
    }

    handleUpdateForm(newData);
  };

  const renderField = (key: string) => {
    let name = "";
    let lable: any = "";
    let typeFiled = INPUT;
    let order = 1;
    let onChange: any = () => {};
    let options: Array<{ label: string; value: string | number }> | null = null;
    let optionsDynamic: Array<OptionType[]> | null = null;
    let errorsNotify: any = formControl.errors?.compareAssets;
    let touchedNotify: any = formControl.touched?.compareAssets;
    let disable = isView;

    switch (key) {
      //Thông tin tài sản
      //   name = "Thông tin tài sản";
      //   lable = "Mã kho";
      //   order = 1;
      //   onChange = handleChangeDatasource;
      //   break;
      // }
      case "dataSourceId": {
        name = "Thông tin tài sản";
        typeFiled = SELECT;
        options = dataSourceOptions;
        lable = renderRequired("Nguồn dữ liệu");
        order = 2;
        onChange = handleChangeDataField;
        break;
      }
      case "infoSourceId": {
        name = "Thông tin tài sản";
        typeFiled = SELECT;
        options = infoSourceOptions;
        lable = renderRequired("Nguồn thông tin");
        order = 3;
        onChange = handleChangeDataField;
        break;
      }
      case "contact": {
        name = "Thông tin tài sản";
        lable = renderRequired("Người liên hệ - SĐT");
        typeFiled = INPUT;
        order = 4;
        onChange = handleChangeDataField;
        break;
      }
      case "transactionStatus": {
        name = "Thông tin tài sản";
        lable = renderRequired("Tình trạng giao dịch");
        typeFiled = INPUT;
        order = 5;
        onChange = handleChangeDataField;
        break;
      }
      case "transactionTime": {
        name = "Thông tin tài sản";
        lable = renderRequired("Thời điểm");
        typeFiled = DAY_PICKER;
        order = 6;
        onChange = handleChangeDataField;
        break;
      }
      // Địa chỉ
      case "addressProvince": {
        name = "Địa chỉ";
        typeFiled = SELECT;
        options = provinceOptions; // GET /api/v1/province/get_all
        lable = renderRequired("Tỉnh/Thành phố");
        order = 7;
        onChange = handleChangeDataField;
        optionsDynamic = null;
        break;
      }
      case "addressDistrict": {
        name = "Địa chỉ";
        typeFiled = SELECT;
        options = null;
        optionsDynamic = districtOptions;
        lable = renderRequired("Quận/ Huyện/ Thị xã/ Thành phố");
        order = 8;
        onChange = handleChangeDataField;
        break;
      }
      case "addressWard": {
        name = "Địa chỉ";
        typeFiled = SELECT;
        optionsDynamic = wardOptions;
        options = null;
        lable = renderRequired("Xã/ Phường/ Thị trấn");
        order = 9;
        onChange = handleChangeDataField;
        break;
      }
      case "addressDetail": {
        name = "Địa chỉ";
        lable = renderRequired("Mô tả chi tiết");
        typeFiled = INPUT;
        order = 10;
        onChange = handleChangeDataField;
        break;
      }
      // Chi tiết
      case "assetImage": {
        name = "Chi tiết";
        lable = "Hình ảnh tài sản";
        typeFiled = IMAGE;
        order = 11;
        onChange = handleChangeDataField;
        break;
      }
      case "productionLineName": {
        if (assetLevelThreeId === ASSET_LV3.PRODUCTION_LINE) {
          name = "Chi tiết";
          lable = renderRequired("Tên dây chuyền sản xuất");
          name = "Chi tiết";
          typeFiled = INPUT;
          order = 11.5;
          onChange = handleChangeDataField;
          break;
        } else {
          return {};
        }
      }
      case "name": {
        name = "Chi tiết";
        lable = renderRequired("Tên MMTB");
        typeFiled = INPUT;
        order = 12;
        onChange = handleChangeDataField;
        break;
      }
      case "brand": {
        name = "Chi tiết";
        lable = "Nhãn hiệu";
        typeFiled = INPUT;
        order = 13;
        onChange = handleChangeDataField;
        break;
      }
      case "engineNo": {
        name = "Chi tiết";
        lable = "Số máy";
        typeFiled = INPUT;
        order = 13.1;
        onChange = handleChangeDataField;
        break;
      }
      case "model": {
        name = "Chi tiết";
        lable = "Số loại/Model";
        typeFiled = INPUT;
        order = 14;
        onChange = handleChangeDataField;
        break;
      }

      case "yearMfg": {
        name = "Chi tiết";
        lable = "Năm sản xuất";
        typeFiled = INPUT_NUMBER_ONLY;
        order = 15;
        onChange = handleChangeDataField;
        break;
      }
      case "countryMfgId": {
        name = "Chi tiết";
        typeFiled = SELECT;
        options = manufacturingCountryOptions; // GET /api/v1/country/get_all
        lable = "Nước sản xuất";
        order = 16;
        onChange = handleChangeDataField;
        break;
      }
      case "noteLegalSBA": {
        name = "Chi tiết";
        lable = renderRequired("Pháp lý");
        typeFiled = INPUT;
        order = 16.5;
        onChange = handleChangeDataField;
        break;
      }
      case "manufacturer": {
        name = "Chi tiết";
        lable = "Nhà sản xuất";
        typeFiled = INPUT;
        order = 17;
        onChange = handleChangeDataField;
        break;
      }
      case "power": {
        name = "Chi tiết";
        lable = "Công suất (kW)";
        typeFiled = INPUT_NUMBER;
        order = 18;
        onChange = handleChangeDataField;
        break;
      }
      case "controlType": {
        name = "Chi tiết";
        lable = "Chế độ điều khiển";
        typeFiled = INPUT;
        order = 19;
        onChange = handleChangeDataField;
        break;
      }
      case "size": {
        name = "Chi tiết";
        lable = "Kích thước (mm)";
        typeFiled = INPUT;
        order = 20;
        onChange = handleChangeDataField;
        break;
      }
      case "specs": {
        name = "Chi tiết";
        lable = "Thông số kỹ thuật";
        typeFiled = INPUT;
        order = 21;
        onChange = handleChangeDataField;
        break;
      }
      case "electricEngine": {
        name = "Chi tiết";
        lable = "Động cơ điện (kW)";
        typeFiled = INPUT_NUMBER;
        order = 28;
        onChange = handleChangeDataField;
        break;
      }
      case "mainEngine": {
        name = "Chi tiết";
        lable = "Động cơ chính (kW)";
        typeFiled = INPUT_NUMBER;
        order = 29;
        onChange = handleChangeDataField;
        break;
      }
      case "engineSystem": {
        name = "Chi tiết";
        lable = "Hệ thống thiết bị điện";
        typeFiled = INPUT;
        order = 30;
        onChange = handleChangeDataField;
        break;
      }
      // ###
      case "additionalContent": {
        name = "Chi tiết";
        lable = "Nội dung khác";
        typeFiled = INPUT;
        order = 26;
        onChange = handleChangeDataField;
        break;
      }
      case "currentUseSituation": {
        name = "Chi tiết";
        lable = "Hiện trạng sử dụng";
        typeFiled = INPUT;
        order = 32;
        onChange = handleChangeDataField;
        break;
      }
      // #######
      case "numberOfDaysUsed": {
        name = "Chi tiết";
        lable = "Số thời gian đã qua sử dụng (ngày)";
        typeFiled = INPUT_NUMBER_ONLY;
        order = 28;
        onChange = handleChangeDataField;
        break;
      }
      case "remainQuality": {
        name = "Chi tiết";
        lable = "Chất lượng còn lại (%)";
        typeFiled = PERCENT;
        order = 33;
        onChange = handleChangeDataField;
        break;
      }

      case "transactionPrice": {
        name = "Chi tiết";
        lable = renderRequired("Giá giao dịch/ rao bán (đồng)");
        typeFiled = INPUT_NUMBER;
        order = 34;
        onChange = handleChangeDataField;
        break;
      }

      case "estimatedRate": {
        name = "Chi tiết";
        lable = renderRequired("Tỷ lệ ước tính (%)");
        typeFiled = PERCENT;
        order = 35;
        onChange = handleChangeDataField;
        break;
      }
      // #######

      case "estimatePrice": {
        name = "Chi tiết";
        lable = renderRequired("Giá ước tính (đồng)");
        order = 44;
        typeFiled = INPUT_NUMBER;
        disable = true;
        break;
      }
    }

    return {
      name,
      lable,
      typeFiled,
      order,
      key,
      onChange,
      options,
      optionsDynamic,
      errorsNotify,
      touchedNotify,
      listImage,
      disable,
      setListImage,
    };
  };

  const handleConvertData = (
    data: Array<ComparedAssetDeviceCreateType>
  ): any[] => {
    if (!data) return [];
    let datasource = [];

    const dataConverted = transformRowSchemaToColumnSchema(data);

    for (const key in dataConverted) {
      const renderName_label = renderField(key);

      const value = dataConverted[key];

      if (key === "transactionTime") {
        for (let i = 0; i < value.length; i++)
          value[i] = value[i]
            ? dayjs(value[i]).format(DATE_TIME_FORMAT.day)
            : "";
      }

      if (!renderName_label.name) continue;

      const obj = {
        key: key,
        name: renderName_label.name,
        lable: renderName_label.lable,
        typeFiled: renderName_label.typeFiled,
        order: renderName_label.order,
        onChange: renderName_label.onChange,
        options: renderName_label.options,
        optionsDynamic: renderName_label.optionsDynamic,
        errorsNotify: renderName_label.errorsNotify,
        touchedNotify: renderName_label.touchedNotify,
        listImage: renderName_label.listImage,
        disable: renderName_label.disable,
        setListImage: setListImage,
        ...value,
      };

      datasource.push(obj);
    }
    return datasource.sort((a, b) => a.order - b.order);
  };

  const handleGetDistrictAndWard = async (
    asset: ComparedAssetDeviceCreateType,
    index: number
  ) => {
    // get district and ward base on provinceCode
    const provinceCode = asset.addressProvince;
    const districtCode = asset.addressDistrict;
    if (!provinceCode || !districtCode) return;

    const responseDistricts = await addressApi.getDistricts({
      code: provinceCode as string,
    });
    const newItemDistrictOptions = await responseDistricts?.data?.map(
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
    const newItemWardOptions = await responseWards?.data?.map(
      (ele: WardType) => {
        return {
          label: ele.fullName,
          value: ele.code,
        };
      }
    );
    handleReplaceWardOptions(index, newItemWardOptions);
  };
  const handleLoadEditData = async () => {
    let imageItems: UploadProps[] = [];
    for (let index = 0; index < compareAssets.length; index++) {
      const item = compareAssets[index];
      handleGetDistrictAndWard(item, index);

      let loadedImages: any[] = [];
      const ecmIds = item.assetImage?.split(";") || [];
      for (let j = 0; j < ecmIds?.length; j++) {
        const ecmId = ecmIds[j];
        if (!ecmId) continue;
        const loadedImage = await loadSingleImage(ecmId);
        loadedImages.push({
          ecmId: ecmId,
          name: ecmId,
          status: "done",
          url: loadedImage,
        });
      }

      imageItems.push({
        index,
        image: loadedImages,
      });
    }
    setListImage && setListImage(imageItems);
  };

  useImperativeHandle(ref, () => ({
    onSubmit: formControl.submitForm,
    setValues: handleUpdateForm,
    values: formControl.values.compareAssets,
  }));

  useEffect(() => {
    const columnsTb: ColumnsEdit = [
      {
        title: "Nội dung",
        dataIndex: "name",
        key: "name",
        colSpan: 2,
      },
      {
        title: "lable",
        dataIndex: "lable",
        key: "lable",
        colSpan: 0,
      },
      ...compareAssets.map((_, index) => ({
        title: `TS ${index + 1}`,
        dataIndex: `ts${index + 1}`,
        key: `ts${index + 1}`,
      })),
      {
        title: "",
        dataIndex: "action",
        key: "action",
      },
    ];
    setColTable(columnsTb);
  }, [compareAssets]);

  // update assetLevelThreeId to every asset
  useEffect(() => {
    if (!compareAssets || !assetLevelThreeId) return;
    const newCompareAssets = [...compareAssets];
    handleUpdateForm(
      newCompareAssets.map((item: any, index: number) => {
        item.assetLevelThreeId = assetLevelThreeId;
        return item;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetLevelThreeId]);

  useEffect(() => {
    if (formType === "edit" || formType === "view") {
      handleLoadEditData();
    }
  }, [
    formType,
    JSON.stringify(
      compareAssets?.filter((item) => item.assetId)?.map((item) => item.assetId)
    ),
  ]);

  useEffect(() => {
    if (formType === "add") {
      handleLoadEditData();
    }
  }, [
    formType,
    JSON.stringify(compareAssets?.map((item) => item.assetId || null)),
  ]);

  return (
    <Card size="small">
      <TableAddColEdit
        imageList={listImage}
        columns={colTable}
        dataSource={handleConvertData(compareAssets)}
        handleAddCol={handleAddCol}
        handleCoppyCol={handleCoppyCol}
        handleSubCol={handleSubCol}
      />
    </Card>
  );
});

export default memo(StoredAssetDeviceForm, (prevProps, nextProps) => {
  return (
    isDeepEqual(prevProps.formType, nextProps.formType) &&
    isDeepEqual(prevProps.assetLevelThreeId, nextProps.assetLevelThreeId) &&
    isDeepEqual(prevProps, nextProps)
  );
});
