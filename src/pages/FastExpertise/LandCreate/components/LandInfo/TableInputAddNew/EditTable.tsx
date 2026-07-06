import {Form, Input, Row, Select} from "antd";
import {FormInstance} from "antd/lib/form/Form";
import React, {useEffect, useState} from "react";
import {TYPE_FIELD} from "constants/enums";

import {Rule} from "antd/es/form";
import {useAppDispatch, useAppSelector} from "configs/hooks";

import {setAddressText} from "pages/FastExpertise/Store/fastExpertise";
import {addressApi} from "apis/adress";
import {useAddressProvince} from "utils/request";
import {ProvinceType} from "constant/types";
import {hasValue} from "utils/format";
import ButtonCustom from "components/ButtonCustom";
type EditableRowProps = {
  index: number;
};
const {INPUT, SELECT, GET_LOCATION_BTN} = TYPE_FIELD;
export type EditableCellProps = {
  title: React.ReactNode;
  editable?: boolean;
  children: React.ReactNode;
  dataIndex: any;
  record: any;
  selected: boolean;
  options: any;
  name: string;
  index: number;
  type: TYPE_FIELD;
  disabled?: boolean;
  value?: any;
  onChange?: (e: any) => void;
  handleSave: (record: any, index: number) => void;
  onFocus?: () => void;
  onPressEnter?: (e: any) => void;
  addonAfter?: any;
  rules?: Rule[];
  hidden?: boolean;
  autoFocus?: boolean;
  fields?: any[];
  percentable?: boolean;
  currencable?: boolean;
  placeholder?: string;
  form?: any;
  values?: any;
};

export const EditableContext = React.createContext<FormInstance<any> | null>(
  null
);

export const EditableRow: React.FC<EditableRowProps> = ({index, ...props}) => {
  return (
    <>
      <tr {...props} />
    </>
  );
};

export const EditableCell: React.FC<any> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  selected,
  options,
  handleSave,
  name,
  index,
  type,
  onChange,
  onPressEnter,
  disabled,
  value,
  hidden,
  autoFocus,
  fields,
  percentable,
  currencable,
  placeholder,
  form,
  rules,
  values,
  checkValidateTableOnChange,
  ...restProps
}) => {
  const dispatch = useAppDispatch();
  const [newOptions, setNewOptions] = useState(options || []);

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const {data} = useAddressProvince();
  // const addressText = useAppSelector((state) => state.fastExpertiseSlice.addressText);
  const assetInfo = useAppSelector(state => state.fastExpertiseSlice.assetInfo);

  const setFieldValue = (dataIndex: string, value: any) => {
    form?.setFieldValue([name, index, dataIndex], value);
  };

  const getFieldValue = (dataIndex: string) => {
    return form?.getFieldValue([name, index, dataIndex]);
  };

  useEffect(() => {
    const setFieldsValue = () => {
      if (dataIndex === "addressProvince") {
        setFieldValue("addressProvince", assetInfo?.provinces?.code);
      }
      if (dataIndex === "addressDistrict") {
        setListDistrictOptions(assetInfo?.provinces?.code);
      }
      if (dataIndex === "addressWard") {
        setListWardOptions(assetInfo?.districts?.code);
      }
      if (dataIndex === "addressStreet") {
      }
      if (dataIndex === "addressDetail") {
      }
    };
    if (assetInfo) {
      setFieldsValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetInfo]);
  useEffect(() => {
    const setFieldsValue = () => {
      if (dataIndex === "addressDistrict") {
        setFieldValue("addressDistrict", assetInfo?.districts?.code);
      }
      if (dataIndex === "addressWard") {
        setFieldValue("addressWard", assetInfo?.wards?.code);
      }
      if (dataIndex === "addressStreet") {
        setFieldValue("addressStreet", assetInfo?.addressStreet);
      }
      if (dataIndex === "addressDetail") {
        setFieldValue("addressDetail", assetInfo?.addressDetail);
      }
    };
    setFieldsValue();
  }, [newOptions]);

  useEffect(() => {
    // const setText = () => {
    // if (dataIndex == "addressProvince") {
    //   setProvinceText(assetInfo?.provinces?.code);
    // }
    // if (dataIndex == "addressDistrict") {
    //   setDistrictText(assetInfo?.districts?.code);
    // }
    // if (dataIndex == "addressWard") {
    //   setWardText(assetInfo?.wards?.code);
    // }
    // };

    if (assetInfo) {
      setAddressTextByCodes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetInfo, newOptions]);

  const setAddressTextByCodes = async () => {
    try {
      const provinceCode = getFieldValue("addressProvince");
      const districtCode = getFieldValue("addressDistrict");
      const wardCode = getFieldValue("addressWard");

      const provinceText = data?.find(
        (e: any) => e?.code === provinceCode
      )?.fullName;
      const listDistrict = await addressApi.getDistricts({
        code: provinceCode,
      });
      const listWard = (await addressApi.getWards({code: districtCode})) || [];
      const districtText = listDistrict?.data?.find(
        (e: any) => e?.code === districtCode
      )?.fullName;
      const wardText = listWard?.data?.find(
        (e: any) => e?.code === wardCode
      )?.fullName;
      const streetText = getFieldValue("addressStreet");
      const detailText = getFieldValue("addressDetail");

      dispatch(
        setAddressText({
          provinceText: provinceText,
          districtText: districtText,
          wardText: wardText,
          streetText: streetText,
          detailText: detailText,
        })
      );
    } catch (error) {}
  };

  useEffect(() => {
    const setFieldProvince = () => {
      if (dataIndex === "addressProvince") {
        setNewOptions(
          data?.map((itemSub: ProvinceType) => {
            return {
              label: itemSub.fullName,
              value: itemSub.code,
            };
          }) || []
        );

        if (hasValue(assetInfo?.assetId)) {
          setFieldValue("addressProvince", assetInfo?.provinces?.code);
          // setAddressTextByCodes();
        } else {
          setFieldValue("addressProvince", assetInfo?.addressProvince);
        }
      }
    };
    setFieldProvince();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, assetInfo]);

  const setListDistrictOptions = async (addressProvince: any) => {
    try {
      const res =
        (await addressApi.getDistricts({code: addressProvince})) || [];
      setNewOptions(
        res?.data.map((e: any) => ({value: e?.code, label: e?.fullName}))
      );
    } catch (error) {}
  };

  const setListWardOptions = async (addressDistrict: any) => {
    try {
      const res = (await addressApi.getWards({code: addressDistrict})) || [];
      setNewOptions(
        res?.data.map((e: any) => ({value: e?.code, label: e?.fullName}))
      );
    } catch (error) {}
  };

  // const setProvinceText = (code: string) => {
  //   const provinceText = newOptions.find(
  //     (option: any) => option?.value === code
  //   )?.label;

  //   dispatch(
  //     setAddressText({
  //       ...addressText,
  //       provinceText: provinceText,
  //       streetText: assetInfo?.addressStreet,
  //       detailText: assetInfo?.addressDetail,
  //     })
  //   );
  // };

  // const setDistrictText = async (code: string) => {
  //   const districtText = newOptions.find(
  //     (option: any) => option?.value === code
  //   )?.label;
  //   console.log(districtText);
  //   dispatch(
  //     setAddressText({
  //       ...addressText,
  //       districtText: districtText,
  //       streetText: assetInfo?.addressStreet,
  //       detailText: assetInfo?.addressDetail,
  //     })
  //   );
  // };

  // const setWardText = (code: string) => {
  //   const wardText = newOptions.find(
  //     (option: any) => option?.value === code
  //   )?.label;
  //   console.log(wardText);
  //   dispatch(
  //     setAddressText({
  //       ...addressText,
  //       wardText: wardText,
  //       streetText: assetInfo?.addressStreet,
  //       detailText: assetInfo?.addressDetail,
  //     })
  //   );
  // };

  let childNode = children;

  if (type === INPUT) {
    childNode = (
      <Form.Item
        name={[name, index, dataIndex]}
        initialValue={getFieldValue(dataIndex) ?? null}
        rules={rules}
      >
        <Input
          placeholder={disabled ? "--" : "Nhập"}
          disabled={disabled}
          onChange={async e => {
            // if (dataIndex === "addressStreet") {
            //   dispatch(
            //     setAddressText({...addressText, streetText: e.target.value})
            //   );
            // }
            // if (dataIndex === "addressDetail") {
            //   dispatch(
            //     setAddressText({...addressText, detailText: e.target.value})
            //   );
            // }
            // setAddressTextByCodes();
          }}
          onKeyDown={e => {
            if (
              e.key === "Enter" &&
              (dataIndex === "addressStreet" || dataIndex === "addressDetail")
            ) {
              setAddressTextByCodes();
            }
          }}
        ></Input>
      </Form.Item>
    );
  }

  if (type === SELECT) {
    childNode = (
      <Form.Item
        style={{margin: 0}}
        name={[name, index, dataIndex]}
        initialValue={getFieldValue(dataIndex) ?? null}
        rules={rules}
      >
        <Select
          showSearch
          style={{
            width: "100%",
          }}
          filterOption={(input, option) =>
            (option?.label?.toString().toLowerCase() ?? "").includes(
              input.toLowerCase()
            )
          }
          open={openDropdown}
          onFocus={() => {
            if (dataIndex === "addressProvince") {
            }
            if (dataIndex === "addressDistrict") {
              setListDistrictOptions(getFieldValue("addressProvince"));
            }
            if (dataIndex === "addressWard") {
              setListWardOptions(getFieldValue("addressDistrict"));
            }
            setOpenDropdown(true);
          }}
          onBlur={() => {
            setOpenDropdown(false);
          }}
          onSelect={() => {
            setOpenDropdown(false);
          }}
          // onClick={e => {
          //   if (dataIndex === "addressProvince") {
          //   }
          //   if (dataIndex === "addressDistrict") {
          //     setListDistrictOptions(getFieldValue("addressProvince"));
          //   }
          //   if (dataIndex === "addressWard") {
          //     setListWardOptions(getFieldValue("addressDistrict"));
          //   }
          // }}
          onChange={e => {
            if (checkValidateTableOnChange) {
              checkValidateTableOnChange();
            }

            if (dataIndex === "addressProvince") {
              setFieldValue("addressDistrict", null);
              setFieldValue("addressWard", null);
              // setAddressTextByCodes();
              // setProvinceText(e);
            }
            if (dataIndex === "addressDistrict") {
              setFieldValue("addressWard", null);
              // setAddressTextByCodes();
              // setDistrictText(e);
            }
            if (dataIndex === "addressWard") {
              // setWardText(e);
              // setAddressTextByCodes();
            }
          }}
          onKeyDown={e => {
            if (
              e.key === "Enter" &&
              (dataIndex === "addressProvince" ||
                dataIndex === "addressDistrict" ||
                dataIndex === "addressWard")
            ) {
              setAddressTextByCodes();
            }
          }}
          placeholder={disabled ? "--" : "Chọn"}
          options={newOptions}
          disabled={disabled}
          allowClear={true}
          {...restProps}
        />
      </Form.Item>
    );
  }
  if (type === GET_LOCATION_BTN) {
    childNode = (
      <Row justify={"center"}>
        <ButtonCustom
          type="primary"
          bgColor="#2862AF"
          onClick={() => {
            setAddressTextByCodes();
          }}
          label="Định vị"
          disabled={disabled}
        />
      </Row>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};
