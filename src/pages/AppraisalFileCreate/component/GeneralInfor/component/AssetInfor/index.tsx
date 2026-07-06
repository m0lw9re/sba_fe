import { message, Space } from "antd";
import { addressApi } from "apis/adress";
import { assetCommonApi } from "apis/assetCommon";
import TableInputAdd from "components/TableInputAddCustom/TableInputAddCustom";
import { RootState } from "configs/configureStore";
import {
  AppraisalFileAssetCommonCreateType,
  AppraisalFileAssetCommonType,
  AppraisalTypeType,
  AssetLevelThreeType,
  DistrictType,
  WardType,
} from "constant/types";
import { useFormik } from "formik";
import "pages/AppraisalFileCreate/component/GeneralInfor/component/AssetInfor/style.scss";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { randomId } from "utils";
import { useAppraisalTypes } from "utils/request";
import * as Yup from "yup";
import { columnsTableMenu, newItem } from "./config";
import { useAppDispatch } from "configs/hooks";
import { setChangeAppraisalFileCreate } from "configs/globalSlice";
import { isAssetMovableEstate } from "utils/asset";
import { ASSET_LV1, ASSET_LV2, ASSET_LV3 } from "constant/enums";

type RefProps = {
  addAssetInfor: () => void;
};

type Props = {
  assetInfor: {
    assetCommons: Array<AppraisalFileAssetCommonType>;
    assetLevelTwoId: number | null;
    assetLevelOneId: number | null;
  };
};

type FormDataType = {
  assetCommons: Array<AppraisalFileAssetCommonCreateType>;
};

const initialValue: FormDataType = {
  assetCommons: [],
};
const handleGenerateFormSchemaByAssetLevelTwoId = (assetLevelTwoId: number) => {
  // động sản -> có thêm trường description
  return Yup.object().shape({
    assetCommons: Yup.array().of(
      Yup.object().shape({
        appraisalTypeId: Yup.number().nullable().required("Vui lòng chọn"),
        assetLevelThreeId: Yup.number().nullable().required("Vui lòng chọn"),
        addressProvince: Yup.string().nullable().required("Vui lòng chọn"),
        addressDistrict: Yup.string().nullable().required("Vui lòng chọn"),
        addressWard: Yup.string().nullable().required("Vui lòng chọn"),
        ...(isAssetMovableEstate(assetLevelTwoId)
          ? {
              description: Yup.string()
                .nullable()
                .required("Vui lòng nhập mô tả chi tiết"),
            }
          : {}),
      })
    ),
  });
};

const AssetInfor = forwardRef<RefProps>(({}, ref) => {
  const dataAppraisalTypeSWR = useAppraisalTypes();
  const { provinceOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );
  const [districtOptions, setDistrictOptions] = useState<
    Array<Array<{ label: string; value: string }>>
  >([]);
  const [wardOptions, setWardOptions] = useState<
    Array<Array<{ label: string; value: string }>>
  >([]);
  const [assetLevelThreeOptions, setAssetLevelThreeOptions] = useState<
    AssetLevelThreeType[]
  >([]);
  const appraisalFileState = useSelector(
    (state: RootState) => state.appraisalFileCreateSlice
  );
  const { legalStatusRealEstateOptions, legalStatusMovableEstateOptions } =
    useSelector((state: RootState) => state.globalSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getAssetLevelThreeOptions = async () => {
      setAssetLevelThreeOptions([]);
      if (appraisalFileState.assetLevelTwoId) {
        const res = await assetCommonApi.getAssetLevel3(
          appraisalFileState.assetLevelTwoId
        );
        setAssetLevelThreeOptions(res.data);
      }
    };
    getAssetLevelThreeOptions();
  }, [appraisalFileState.assetLevelTwoId]);

  const form = useFormik({
    initialValues: initialValue,
    validationSchema: handleGenerateFormSchemaByAssetLevelTwoId(
      appraisalFileState?.assetLevelTwoId || 1
    ),
    onSubmit: (data: FormDataType): any => {
      return {
        ...data,
        assetCommons: data.assetCommons.map((item, index) => ({
          ...item,
          orderBy: index,
        })),
      };
    },
  });

  useEffect(() => {
    form.values.assetCommons.length > 0 &&
      dispatch(
        setChangeAppraisalFileCreate({
          title: "Thông tin tài sản",
          value: { ...form.values.assetCommons },
        })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.assetCommons.length]);

  useEffect(() => {
    if (form.values.assetCommons.length > 0)
      form.setValues({
        ...form.values,
        assetCommons: form.values.assetCommons.map((item) => ({
          ...item,
          legalStatusId: null,
        })),
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appraisalFileState.assetLevelOneId]);

  useImperativeHandle(ref, () => ({
    addAssetInfor: form.submitForm,
  }));

  useEffect(() => {
    if (appraisalFileState.assetLevelTwoId) {
      form.setValues({
        assetCommons: form.values.assetCommons.map((item) => {
          return {
            ...item,
            assetLevelThreeId: null,
          };
        }),
      });
    }
  }, [appraisalFileState.assetLevelTwoId]);

  const handleReplaceDistrictOptions = (
    index: number,
    newItemOptions: [{ value: string; label: string }]
  ) => {
    const newOptions = [...districtOptions];
    newOptions.splice(index, 1, newItemOptions);
    setDistrictOptions(newOptions);
  };

  const handleReplaceWardOptions = (
    index: number,
    newItemOptions: [{ value: string; label: string }]
  ) => {
    const newOptions = [...wardOptions];
    newOptions.splice(index, 1, newItemOptions);
    setWardOptions(newOptions);
  };

  const changeFormData = (data: Array<AppraisalFileAssetCommonCreateType>) => {
    form.setValues({ assetCommons: data });
  };

  const changeProvinceValue = (key: string, value: string) => {
    if (value) {
      const foundIndex = form.values.assetCommons.findIndex(
        (el) => el.key === key
      );
      if (foundIndex === -1) return -1;
      const newData = [...form.values.assetCommons];
      newData[foundIndex] = {
        ...form.values.assetCommons[foundIndex],
        addressProvince: value,
        addressDistrict: null,
        addressWard: null,
      };
      form.setValues({ assetCommons: newData });
      return foundIndex;
    }
    return -1;
  };

  const handleChangeProvince = async (key: string, value: string) => {
    if (value) {
      // get index item and set new data table
      const foundIndex = changeProvinceValue(key, value);
      if (foundIndex === -1) return;
      //get district options after change province
      const response = await addressApi.getDistricts({ code: value });
      const newItemOptions = await response?.data?.map((ele: DistrictType) => {
        return {
          label: ele.fullName,
          value: ele.code,
        };
      });
      // update district options
      handleReplaceDistrictOptions(foundIndex, newItemOptions);
    }
  };
  const handleChangeAssetLevelThree = async (key: string, value: number) => {
    if (appraisalFileState.assetLevelTwoId === ASSET_LV2.MACHINE) {
      const isMMTBAsset = form.values.assetCommons.some(
        (item) =>
          item.assetLevelThreeId === ASSET_LV3.MACHINE && key !== item.key
      );
      const isDCSXAsset = form.values.assetCommons.some(
        (item) =>
          item.assetLevelThreeId === ASSET_LV3.PRODUCTION_LINE &&
          key !== item.key
      );
      if (
        (isMMTBAsset && value === ASSET_LV3.PRODUCTION_LINE) ||
        (value === ASSET_LV3.MACHINE && isDCSXAsset)
      ) {
        message.error(
          "Không thể tạo hồ sơ MMTB và dây chuyền sản xuất cùng lúc."
        );
        return;
      }
    }

    const foundIndex = form.values.assetCommons.findIndex(
      (el) => el.key === key
    );
    if (foundIndex === -1) return;
    const newData = [...form.values.assetCommons];
    newData[foundIndex] = {
      ...form.values.assetCommons[foundIndex],
      assetLevelThreeId: value,
    };
    form.setValues({ assetCommons: newData });
  };

  const handleChangeDistrict = async (key: string, value: string) => {
    if (value) {
      // get index item and set new data table
      const foundIndex = changeDistrictValue(key, value);
      if (foundIndex === -1) return;
      const response = await addressApi.getWards({ code: value });
      const newItemOptions = await response?.data?.map((ele: WardType) => {
        return {
          label: ele.fullName,
          value: ele.code,
        };
      });
      // update ward options
      handleReplaceWardOptions(foundIndex, newItemOptions);
    }
  };

  const changeDistrictValue = (key: string, value: string) => {
    if (value) {
      const foundIndex = form.values.assetCommons.findIndex(
        (el) => el.key === key
      );
      if (foundIndex === -1) return -1;
      const newData = [...form.values.assetCommons];
      newData[foundIndex] = {
        ...form.values.assetCommons[foundIndex],
        addressDistrict: value,
        addressWard: null,
      };
      form.setValues({ assetCommons: newData });
      return foundIndex;
    }
    return -1;
  };

  const columns = columnsTableMenu.map((item) => {
    if (item.key === 9) {
      return {
        ...item,
        options: provinceOptions,
        handleChangeSelect: handleChangeProvince,
        error: form.errors.assetCommons,
        touched: form.touched.assetCommons,
      };
    } else if (item.key === 10) {
      return {
        ...item,
        optionsDynamic: districtOptions,
        handleChangeSelect: handleChangeDistrict,
        error: form.errors.assetCommons,
        touched: form.touched.assetCommons,
      };
    } else if (item.key === 11) {
      return {
        ...item,
        optionsDynamic: wardOptions,
        error: form.errors.assetCommons,
        touched: form.touched.assetCommons,
      };
    } else if (item.key === 6) {
      return {
        ...item,
        options: dataAppraisalTypeSWR?.data?.map((item: AppraisalTypeType) => {
          return {
            label: item.appraisalTypeName,
            value: item.appraisalTypeId,
          };
        }),
        error: form.errors.assetCommons,
        touched: form.touched.assetCommons,
      };
    } else if (item.key === 7) {
      return {
        ...item,
        options:
          appraisalFileState.assetLevelOneId === ASSET_LV1.REAL_ESTATE
            ? legalStatusRealEstateOptions
            : legalStatusMovableEstateOptions,
        error: form.errors.assetCommons,
        touched: form.touched.assetCommons,
      };
    } else if (item.key === 3) {
      return {
        ...item,
        options:
          assetLevelThreeOptions?.map((item) => {
            return {
              label: item.assetLevelThreeName,
              value: item.assetLevelThreeId,
            };
          }) || [],
        handleChangeSelect: handleChangeAssetLevelThree,
        error: form.errors.assetCommons,
        touched: form.touched.assetCommons,
      };
    } else if (item.key === 12) {
      // đông sản => có thêm trường mô tả chi tiết
      if (isAssetMovableEstate(appraisalFileState?.assetLevelTwoId || 1)) {
        return {
          ...item,
          error: form.errors.assetCommons,
          touched: form.touched.assetCommons,
        };
      } else {
        return {};
      }
    } else {
      return item;
    }
  });

  const handleAdd = () => {
    if (!appraisalFileState.assetLevelTwoId) {
      message.error("Vui lòng chọn loại và loại hình tài sản.");
    } else {
      form.setValues({
        assetCommons: [
          ...form.values.assetCommons,
          {
            ...newItem,
            key: randomId(),
          },
        ],
      });
    }
  };

  return (
    <Space
      style={{ width: "100%" }}
      direction="vertical"
      size={"small"}
      className="assetInfo-wapper"
    >
      <TableInputAdd
        data={form.values.assetCommons}
        setData={changeFormData}
        column={columns}
        isCheckbox={false}
        handleAdd={handleAdd}
        scroll={{ x: 1366 }}
      />
    </Space>
  );
});

export default AssetInfor;
