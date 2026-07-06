import { Col, Form, Input, Row, Space } from "antd";
import { addressApi } from "apis/adress";
import TableInputAdd from "components/TableInputAddCustom/TableInputAddCustom";
import { RootState } from "configs/configureStore";
import { APPRAISAL_FILE_STATUS } from "constant/common";
import { ASSET_LV1 } from "constant/enums";
import {
  AppraisalFileAssetCommonType,
  AssetLevelThreeType,
  DistrictType,
  WardType,
} from "constant/types";
import { OptionType } from "constant/types/common";
import { useFormik } from "formik";
import "pages/AppraisalFileDetail/component/GeneralInfo/component/AssetInfo/style.scss";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { isAssetMovableEstate, isAssetRealEstate } from "utils/asset";
import { transformToOptions } from "utils/common";
import { useAssetLevelThree } from "utils/request";
import { randomId } from "utils/string";
import * as Yup from "yup";
import { columnsTableMenu, newItem } from "./config";

type Props = {
  assetInfor: {
    addressCustomDetail: string | null;
    assetCommons: Array<AppraisalFileAssetCommonType>;
    assetLevelTwoId: number | null;
    assetLevelOneId: number | null;
  };
  // loading đợi lấy options cho huyện và xã
  disableEdit: boolean;
  fileStatus: number;
  disableEditRoleCBTH: boolean;
};

type RefProps = {
  updateAssetInfor: () => void;
  completeFileFromLOS: () => void;
};

type FormDataType = {
  assetCommons: Array<AppraisalFileAssetCommonType>;
};

const handleGenerateFormSchemaByAssetLevelTwoId = (assetLevelTwoId: number) => {
  // động sản -> có thêm trường description
  return Yup.object().shape({
    assetCommons: Yup.array().of(
      Yup.object().shape({
        // appraisalTypeId: Yup.number().nullable().required("Vui lòng chọn"),
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
const initialValue: FormDataType = {
  assetCommons: [],
};

const AssetInfo = forwardRef<RefProps, Props>(
  ({ assetInfor, disableEdit, disableEditRoleCBTH, fileStatus }, ref) => {
    let { id }: { id?: string } = useParams();
    const appraisalFileState = useSelector(
      (state: RootState) => state.appraisalFileDetailSlice
    );
    const {
      provinceOptions,
      appraisalTypeOptions,
      legalStatusRealEstateOptions,
      legalStatusMovableEstateOptions,
    } = useSelector((state: RootState) => state.globalSlice);
    // Lấy danh sách tỉnh
    // Lấy danh sách tài sản level3
    const dataAssetLevelThreeSWR = useAssetLevelThree(
      appraisalFileState.assetLevelTwoId
    );
    const [districtOptions, setDistrictOptions] = useState<OptionType[][]>([]);
    const [wardOptions, setWardOptions] = useState<OptionType[][]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isDisableChangeAssetLevelThree =
      isAssetMovableEstate(appraisalFileState?.assetLevelTwoId || 1) &&
      fileStatus !== APPRAISAL_FILE_STATUS.ONE;

    const refInputAddressDetail = useRef<any>(null);

    const form = useFormik({
      initialValues: initialValue,
      validationSchema: handleGenerateFormSchemaByAssetLevelTwoId(
        appraisalFileState?.assetLevelTwoId || 1
      ),
      onSubmit: (data: FormDataType): any => {
        return {
          ...data,
          addressCustomDetail:
            refInputAddressDetail.current?.resizableTextArea?.textArea?.value ||
            null,
        };
      },
    });

    useEffect(() => {
      setIsLoading(true);
      if (assetInfor) {
        let newAssetCommons = [];
        if (appraisalFileState.assetLevelTwoId !== assetInfor.assetLevelTwoId) {
          newAssetCommons = assetInfor?.assetCommons?.map((item, index) => {
            return {
              ...item,
              ...form.values.assetCommons[index],
              assetLevelThreeId: null,
              description: item.description,
              assetLevelThreeName:
                item.assetLevelThree?.assetLevelThreeName || "",
              key: randomId(),
            };
          });
        } else {
          newAssetCommons = assetInfor?.assetCommons?.map((item, index) => {
            return {
              ...item,
              ...form.values.assetCommons[index],
              assetLevelThreeId: item.assetLevelThreeId,
              description: item.description,
              assetLevelThreeName:
                item.assetLevelThree?.assetLevelThreeName || "",
              key: randomId(),
            };
          });
        }
        form.setValues({ assetCommons: newAssetCommons });
      }
      setIsLoading(false);
    }, [appraisalFileState.assetLevelTwoId]);

    useImperativeHandle(ref, () => ({
      updateAssetInfor: form.submitForm,
      completeFileFromLOS: async () => {
        return {
          ...form.values,
          addressCustomDetail:
            refInputAddressDetail.current?.resizableTextArea?.textArea?.value ||
            null,
          assetCommons: form.values.assetCommons.map((item, index) => ({
            ...item,
            orderBy: index,
          })),
        };
      },
    }));

    // change datasource of table
    const changeFormData = (
      data: Array<AppraisalFileAssetCommonType & { key: string }>
    ) => {
      form.setValues({ assetCommons: data });
    };

    // update district options
    const handleReplaceDistrictOptions = (
      index: number,
      newItemOptions: [{ value: string; label: string }]
    ) => {
      const newOptions = [...districtOptions];
      newOptions.splice(index, 1, newItemOptions);
      setDistrictOptions(newOptions);
    };

    // update ward options
    const handleReplaceWardOptions = (
      index: number,
      newItemOptions: [{ value: string; label: string }]
    ) => {
      const newOptions = [...wardOptions];
      newOptions.splice(index, 1, newItemOptions);
      setWardOptions(newOptions);
    };

    const handleAdd = () => {
      form.setValues({
        assetCommons: [
          ...form.values.assetCommons,
          {
            ...newItem,
            key: randomId(),
            appraisalFileId: id || "",
          },
        ],
      });
    };

    // get index item and set new data table
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

    // handle select event of province value
    const handleChangeProvince = async (key: string, value: string) => {
      if (value) {
        // get index item and set new data table
        const foundIndex = changeProvinceValue(key, value);
        if (foundIndex === -1) return;
        //get district options after change province
        const response = await addressApi.getDistricts({ code: value });
        const newItemOptions = await response?.data?.map(
          (ele: DistrictType) => {
            return {
              label: ele.fullName,
              value: ele.code,
            };
          }
        );
        // update district options
        handleReplaceDistrictOptions(foundIndex, newItemOptions);
      }
    };

    // get index item and set new data table
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

    // handle select event of district value
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

    const fetchDistrictsAndWards = async () => {
      setIsLoading(true);

      // lấy danh sách quận huyện và phường xã
      const assetCommons: AppraisalFileAssetCommonType[] =
        assetInfor.assetCommons || [];
      const districtCodes = assetCommons.map(
        (item) => item.addressProvince || ""
      );
      const wardCodes = assetCommons.map((item) => item.addressDistrict || "");

      // deduplicate
      const districtCodesSet: string[] = [...new Set(districtCodes)];
      const wardCodesSet: string[] = [...new Set(wardCodes)];

      const districtsPromises = districtCodesSet.map(async (code) => {
        if (!code) return;
        const districts = await addressApi.getDistricts({
          code,
        });

        return {
          [code]: transformToOptions(districts?.data || [], "fullName", "code"),
        };
      });
      const districtsData = await Promise.all(districtsPromises);
      const wardsPromises = wardCodesSet.map(async (code) => {
        if (!code) return;
        const wards = await addressApi.getWards({
          code,
        });
        return {
          [code]: transformToOptions(wards?.data || [], "fullName", "code"),
        };
      });
      const wardsData = await Promise.all(wardsPromises);

      const handleGetDistrictsInArray = (code: string | null) => {
        if (!code) return [];
        return (
          districtsData.find((item) => (item ? item[code] : null))?.[code] || []
        );
      };
      const handleGetWardsInArray = (code: string | null) => {
        if (!code) return [];
        return (
          wardsData.find((item) => (item ? item[code] : null))?.[code] || []
        );
      };

      // get districts and wards and add to options
      const newDistrictOptions = assetCommons.map((item) => {
        return handleGetDistrictsInArray(item.addressProvince);
      });
      setDistrictOptions(newDistrictOptions);
      const newWardOptions = assetCommons.map((item) => {
        return handleGetWardsInArray(item.addressDistrict);
      });
      setWardOptions(newWardOptions);
      setIsLoading(false);
    };

    const columns = columnsTableMenu.map((item) => {
      if (item.key === "index") {
        return {
          ...item,
          render: (value: any, _: any, index: number) => {
            return index + 1;
          },
        };
      } else if (item.key === 3) {
        return {
          ...item,
          options:
            dataAssetLevelThreeSWR?.data?.map((item: AssetLevelThreeType) => {
              return {
                label: item.assetLevelThreeName,
                value: item.assetLevelThreeId,
              };
            }) || [],
          disable:
            (disableEdit && disableEditRoleCBTH) ||
            isDisableChangeAssetLevelThree,
          error: form.errors.assetCommons,
          touched: form.touched.assetCommons,
        };
      } else if (item.key === 6) {
        return {
          ...item,
          disable: disableEdit && disableEditRoleCBTH,
          options: appraisalTypeOptions,
          error: form.errors.assetCommons,
          touched: form.touched.assetCommons,
        };
      } else if (item.key === 7) {
        return {
          ...item,
          disable: disableEdit && disableEditRoleCBTH,
          options:
            assetInfor.assetLevelOneId === ASSET_LV1.REAL_ESTATE
              ? legalStatusRealEstateOptions
              : legalStatusMovableEstateOptions,
        };
      } else if (item.key === 9) {
        return {
          ...item,
          options: provinceOptions,
          handleChangeSelect: handleChangeProvince,
          disable: disableEdit && disableEditRoleCBTH,
          error: form.errors.assetCommons,
          touched: form.touched.assetCommons,
        };
      } else if (item.key === 10) {
        return {
          ...item,
          optionsDynamic: districtOptions,
          handleChangeSelect: handleChangeDistrict,
          disable: disableEdit && disableEditRoleCBTH,
          error: form.errors.assetCommons,
          touched: form.touched.assetCommons,
        };
      } else if (item.key === 11) {
        return {
          ...item,
          optionsDynamic: wardOptions,
          disable: disableEdit && disableEditRoleCBTH,
          error: form.errors.assetCommons,
          touched: form.touched.assetCommons,
        };
      } else if (item.key === 12) {
        // đông sản => có thêm trường mô tả chi tiết
        if (isAssetMovableEstate(appraisalFileState?.assetLevelTwoId || 1)) {
          return {
            ...item,
            disable: disableEdit && disableEditRoleCBTH,
            error: form.errors.assetCommons,
            touched: form.touched.assetCommons,
          };
        } else {
          return {
            // ...item,
            // style: {display: "none"}
          };
        }
      } else if (item.key === 13) {
        // bds => có thêm trường đường
        if (isAssetRealEstate(appraisalFileState?.assetLevelTwoId || 1)) {
          return {
            ...item,
            disable: disableEdit && disableEditRoleCBTH,
            touched: form.touched.assetCommons,
          };
        } else {
          return {
            // ...item,
            // style: {display: "none"}
          };
        }
      }
      // else if (item.key === "action") {
      //   if (!disableEdit) {
      //     return item;
      //   }
      // }
      else {
        return item;
      }
    });

    const dataSource =
      form.values?.assetCommons?.map((item) => {
        return {
          ...item,
          appraisalTypeName: item?.appraisalType?.appraisalTypeName || "",
          legalStatusName: item?.legalStatus?.legalStatusName || "",
          assetCodeView: item?.parentAssetCode || item.assetCode,
        };
      }) || [];

    useEffect(() => {
      fetchDistrictsAndWards();
    }, []);

    return (
      <Space
        style={{ width: "100%" }}
        direction="vertical"
        size={"small"}
        className="assetInfo-wapper"
      >
        <Row gutter={[24, 8]}>
          <Col xs={24}>
            <Form.Item
              colon={false}
              className="form-item-input-container"
              label={"Địa chỉ tài sản từ LOS"}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              <Input.TextArea
                showCount={false}
                size={"small"}
                rows={3}
                value={appraisalFileState.addressByLos}
                placeholder={"Hệ thống tự nhập"}
                allowClear={false}
              />
            </Form.Item>
          </Col>
        </Row>
        {assetInfor.assetLevelOneId === ASSET_LV1.MOVABLE_ESTATE && (
          <Row gutter={[24, 8]}>
            <Col xs={24}>
              <Form.Item
                colon={false}
                className="form-item-input-container"
                label={"Địa chỉ tài sản"}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Input.TextArea
                  ref={refInputAddressDetail}
                  showCount={false}
                  size={"small"}
                  rows={3}
                  defaultValue={assetInfor.addressCustomDetail || ""}
                  placeholder={"Hệ thống tự nhập"}
                  allowClear={false}
                />
              </Form.Item>
            </Col>
          </Row>
        )}
        <TableInputAdd
          isLoading={isLoading}
          data={dataSource}
          setData={changeFormData}
          column={columns}
          isCheckbox={false}
          scroll={{ x: 1366 }}
          handleAdd={handleAdd}
        />
      </Space>
    );
  }
);

export default memo(AssetInfo);
