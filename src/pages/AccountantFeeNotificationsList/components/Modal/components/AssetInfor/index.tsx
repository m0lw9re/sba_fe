import { Space } from "antd";
import { addressApi } from "apis/adress";
import { assetCommonApi } from "apis/assetCommon";
import TableInputAdd from "components/TableInputAddCustom/TableInputAddCustom";
import { RootState } from "configs/configureStore";
import {
  AppraisalFileAssetCommonCreateType,
  AssetLevelThreeType,
  DistrictType,
  WardType,
} from "constant/types";
import { useFormik } from "formik";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { randomId } from "utils";
import { columnsTableMenu, newItem } from "./config";
import "./style.scss";

type RefProps = {
  addAssetInfor: () => void;
};

type FormDataType = {
  assetCommons: Array<AppraisalFileAssetCommonCreateType>;
};

const initialValue: FormDataType = {
  assetCommons: [],
};

const AssetInfor = forwardRef<RefProps>(({}, ref) => {
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

  useEffect(() => {
    const getAssetLevelThreeOptions = async () => {
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
    onSubmit: (data: FormDataType): any => {
      return data;
    },
  });

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
          label: ele.name,
          value: ele.code,
        };
      });
      // update district options
      handleReplaceDistrictOptions(foundIndex, newItemOptions);
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

  const handleChangeDistrict = async (key: string, value: string) => {
    if (value) {
      // get index item and set new data table
      const foundIndex = changeDistrictValue(key, value);
      if (foundIndex === -1) return;
      const response = await addressApi.getWards({ code: value });
      const newItemOptions = await response?.data?.map((ele: WardType) => {
        return {
          label: ele.name,
          value: ele.code,
        };
      });
      // update ward options
      handleReplaceWardOptions(foundIndex, newItemOptions);
    }
  };

  const columns = columnsTableMenu.map((item) => {
    if (item.key === 9) {
      return {
        ...item,
        // options:
        //   dataProvincesSWR?.data?.map((itemSub: ProvinceType) => {
        //     return {
        //       label: itemSub.name,
        //       value: itemSub.code,
        //     };
        //   }) || [],
        // handleChangeSelect: handleChangeProvince,
      };
    } else if (item.key === 10) {
      return {
        ...item,
        // optionsDynamic: districtOptions,
        // handleChangeSelect: handleChangeDistrict,
      };
    } else if (item.key === 11) {
      return {
        ...item,
        // optionsDynamic: wardOptions,
      };
    } else if (item.key === 6) {
      return {
        ...item,
        // options: dataAppraisalTypeSWR?.data?.map((item: AppraisalTypeType) => {
        //   return {
        //     label: item.appraisalTypeName,
        //     value: item.appraisalTypeId,
        //   };
        // }),
      };
    } else if (item.key === 7) {
      return {
        ...item,
        // options: dataLegalStatusSWR?.data?.map((item: LegalStatusType) => {
        //   return {
        //     label: item.legalStatusName,
        //     value: item.legalStatusId,
        //   };
        // }),
      };
    } else if (item.key === 3) {
      return {
        ...item,
        // options:
        //   assetLevelThreeOptions?.map((item) => {
        //     return {
        //       label: item.assetLevelThreeName,
        //       value: item.assetLevelThreeId,
        //     };
        //   }) || [],
      };
    } else {
      return item;
    }
  });

  const handleAdd = () => {
    form.setValues({
      assetCommons: [
        ...form.values.assetCommons,
        {
          ...newItem,
          key: randomId(),
        },
      ],
    });
  };

  return (
    <div className="asset-fee-notification">
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
          // scroll={{ x: 1366 }}
        />
      </Space>
    </div>
  );
});

export default AssetInfor;
