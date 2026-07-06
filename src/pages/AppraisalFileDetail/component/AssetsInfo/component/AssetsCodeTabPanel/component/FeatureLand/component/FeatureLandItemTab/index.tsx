import { Button, Form, Radio, Row, Space, Typography } from "antd";
import Icons from "assets/icons";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { TreeAssetType } from "constant/types";
import {
  AssetLanUsingPurposeType,
  AssetLandInfoType,
  AssetProjectInFutureType,
} from "constant/types/appraisalFile";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import AddressLand from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/FeatureLand/component/AddressLand";
import DetailAddress from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/FeatureLand/component/DetailAddress";
import Contruction from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/FeatureLand/component/FeatureLandItemTab/component/Contruction";
import TreeInLand from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/FeatureLand/component/FeatureLandItemTab/component/TreeInLand";
import FeatureTable from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/FeatureLand/component/FeatureTable";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { useAppraisalFileDetail } from "utils/request";
import { randomId } from "utils/string";
import * as Yup from "yup";
import ProjectInFuture from "../../../ProjectInFuture";
import PurposeLand from "../PurposeLand";
import "./style.scss";
import { reTypeEmptyString2NullObj } from "utils/validate";
import { pick } from "lodash";

const { INPUT } = TYPE_FIELD;

type Props = {
  data: AssetLandInfoType;
  updateListTab: any;
  index: number;
  isMergeLand: boolean;
  setIsMergeLand: (value: boolean) => void;
};

type RefProps = {
  btnRefUpdateFeatureLandItem: () => void;
};

// const formSchema = Yup.object().shape({
//   mapSheetNumber: Yup.string()
//     .nullable()
//     .required("Số tờ bản đồ không được để trống"),
//   realAddressStreet: Yup.string()
//     .nullable()
//     .required("Đường không được để trống"),
//   legalShape: Yup.string().nullable().required("Hình dạng không được để trống"),
//   realShape: Yup.string().nullable().required("Hình dạng không được để trống"),
//   legalNumberOfFacade: Yup.number()
//     .typeError("Chỉ được nhập số")
//     .nullable()
//     .required("Số mặt tiền không được để trống"),
//   realNumberOfFacade: Yup.number()
//     .typeError("Chỉ được nhập số")
//     .nullable()
//     .required("Số mặt tiền không được để trống"),
//   legalFacadeLength: Yup.number()
//     .typeError("Chỉ được nhập số")
//     .nullable()
//     .required("Kích thước mặt tiền không được để trống"),
//   realFacadeLength: Yup.number()
//     .typeError("Chỉ được nhập số")
//     .nullable()
//     .required("Kích thước mặt tiền không được để trống"),
//   legalLandLength: Yup.number()
//     .typeError("Chỉ được nhập số")
//     .nullable()
//     .required("Kích thước chiều dài không được để trống"),
//   realLandLength: Yup.number()
//     .typeError("Chỉ được nhập số")
//     .nullable()
//     .required("Kích thước chiều dài không được để trống"),
//   realAreaWidth: Yup.number()
//     .typeError("Chỉ được nhập số")
//     .nullable()
//     .required("Diện tích khuôn viên không được để trống"),
//   legalAreaInPlan: Yup.number()
//     .typeError("Chỉ được nhập số")
//     .nullable()
//     .required("Diện tích phù hợp quy hoạch không được để trống"),
//   realAreaInPlan: Yup.number()
//     .typeError("Chỉ được nhập số")
//     .nullable()
//     .required("Diện tích phù hợp quy hoạch không được để trống"),
//   legalAreaUnPlan: Yup.number()
//     .typeError("Chỉ được nhập số")
//     .nullable()
//     .required("Diện tích không phù hợp quy hoạch không được để trống"),
//   realAreaUnPlan: Yup.number()
//     .typeError("Chỉ được nhập số")
//     .nullable()
//     .required("Diện tích không phù hợp quy hoạch không được để trống"),
//   legalPrivateArea: Yup.number()
//     .typeError("Chỉ được nhập số")
//     .nullable()
//     .required("Diện tích sử dụng riêng không được để trống"),
//   realPrivateArea: Yup.number()
//     .typeError("Chỉ được nhập số")
//     .nullable()
//     .required("Diện tích sử dụng riêng không được để trống"),
//   legalCommonArea: Yup.number()
//     .typeError("Chỉ được nhập số")
//     .nullable()
//     .required("Diện tích sử dụng chung không được để trống"),
//   realCommonArea: Yup.number()
//     .typeError("Chỉ được nhập số")
//     .nullable()
//     .required("Diện tích sử dụng chung không được để trống"),
//   assetLandUsingPurposes: Yup.array().of(
//     Yup.object().shape({
//       usingOrigin: Yup.string()
//         .nullable()
//         .required("Nguồn gốc SD không được để trống"),
//       usingPeriodId: Yup.string()
//         .nullable()
//         .required("Thời hạn SD không được để trống"),
//       usingPeriod: Yup.string()
//         .nullable()
//         .required("Thời hạn SD không được để trống"),
//       legalAreaWidth: Yup.number()
//         .typeError("Chỉ được nhập số")
//         .nullable()
//         .required("Diện tích khuôn viên không được để trống"),
//       realAreaWidth: Yup.number()
//         .typeError("Chỉ được nhập số")
//         .nullable()
//         .required("Diện tích khuôn viên không được để trống"),
//       legalAreaInPlan: Yup.number()
//         .typeError("Chỉ được nhập số")
//         .nullable()
//         .required("Diện tích phù hợp quy hoạch không được để trống"),
//       realAreaInPlan: Yup.number()
//         .typeError("Chỉ được nhập số")
//         .nullable()
//         .required("Diện tích phù hợp quy hoạch không được để trống"),
//       legalAreaUnPlan: Yup.number()
//         .typeError("Chỉ được nhập số")
//         .nullable()
//         .required("Diện tích không phù hợp quy hoạch không được để trống"),
//       realAreaUnPlan: Yup.number()
//         .typeError("Chỉ được nhập số")
//         .nullable()
//         .required("Diện tích không phù hợp quy hoạch không được để trống"),
//       legalPrivateArea: Yup.number()
//         .typeError("Chỉ được nhập số")
//         .nullable()
//         .required("Diện tích sử dụng riêng không được để trống"),
//       realPrivateArea: Yup.number()
//         .typeError("Chỉ được nhập số")
//         .nullable()
//         .required("Diện tích sử dụng riêng không được để trống"),
//       legalCommonArea: Yup.number()
//         .typeError("Chỉ được nhập số")
//         .nullable()
//         .required("Diện tích sử dụng chung không được để trống"),
//       realCommonArea: Yup.number()
//         .typeError("Chỉ được nhập số")
//         .nullable()
//         .required("Diện tích sử dụng chung không được để trống"),
//     })
//   ),
// });

const formSchema = Yup.object().shape({
  assetLandUsingPurposes: Yup.array().of(
    Yup.object().shape({
      realAreaWidth: Yup.number()
        .typeError("Chỉ được nhập số")
        .nullable()
        .required("Diện tích khuôn viên không được để trống"),
      realAreaInPlan: Yup.number().nullable(),
      realAreaNotConsiderValue: Yup.number().nullable(),
      realAreaUnPlan: Yup.number()
        .nullable()
        .test({
          name: "realAreaUnPlan_purpose",
          exclusive: false,
          params: {},
          message: "Diện tích KPHQH sai công thức",
          test: (value, context) => {
            const realAreaWidth: number = context.parent?.realAreaWidth || 0;
            const realAreaInPlan: number = context.parent?.realAreaInPlan || 0;
            const realAreaNotConsiderValue: number =
              context.parent?.realAreaNotConsiderValue || 0;

            const sub_value: string = Number(
              realAreaWidth - realAreaInPlan - realAreaNotConsiderValue
            ).toFixed(3);

            return value === Number(sub_value);
          },
        }),
    })
  ),
});

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
const cssLabel = { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 };
const cssInput = { xs: 18, sm: 18, md: 18, lg: 18, xl: 18 };

const FeatureLandItemTab = forwardRef<RefProps, Props>(
  ({ data, updateListTab, index, isMergeLand, setIsMergeLand }, ref) => {
    const { id } = useParams<{ id: string }>();
    const form = useFormik({
      initialValues: {} as AssetLandInfoType | any,
      validationSchema: formSchema,
      onSubmit: (data: AssetLandInfoType): any => {
        return {
          ...data,
          constructionChecklists: data.constructionChecklists
            ? data.constructionChecklists
            : [],
          constructionFutureInfors: data.constructionFutureInfors
            ? data.constructionFutureInfors
            : [],
          assetTrees:
            isTreeLand && data?.assetTrees ? [...data.assetTrees] : [],
        };
      },
    });

    const addressLandRef = useRef<{
      getData: () => any;
    }>(null);
    const constructionsRef = useRef<{
      getData: () => any;
    }>(null);
    const detailAddressRef = useRef<{
      getData: () => any;
    }>(null);
    const featureTableRef = useRef<{
      getData: () => any;
    }>(null);
    const projectInFutureRef = useRef<{
      getData: () => any;
    }>(null);

    const { data: appraisalDetail } = useAppraisalFileDetail(id || "");
    const [isConstructLand, setIsConstructLand] = useState<boolean>(false);
    const [isTreeLand, setIsTreeLand] = useState<boolean>(false);

    useEffect(() => {
      if (data?.assetTrees?.length > 0) {
        setIsTreeLand(true);
      }
      if (data?.constructions?.length > 0) {
        setIsConstructLand(true);
      }
    }, [data]);

    useEffect(() => {
      if (data) {
        const getData = {
          ...data,
          legalMainDirection: data.legalMainDirection,
          legalShape: data.legalShape,
          legalNumberOfFacade: data.legalNumberOfFacade,
          legalFacadeLength: data.legalFacadeLength,
          legalLandLength: data.legalLandLength,
          legalAreaWidth: data.legalAreaWidth,
          legalAreaInPlan: data.legalAreaInPlan,
          legalAreaUnPlan: data.legalAreaUnPlan,
          legalPrivateArea: data.legalPrivateArea,
          legalCommonArea: data.legalCommonArea,
          realMainDirection: data.realMainDirection,
          realShape: data.realShape,
          realNumberOfFacade: data.realNumberOfFacade,
          realFacadeLength: data.realFacadeLength,
          realLandLength: data.realLandLength,
          realAreaWidth: data.realAreaWidth,
          realAreaInPlan: data.realAreaInPlan,
          realAreaUnPlan: data.realAreaUnPlan,
          realPrivateArea: data.realPrivateArea,
          realCommonArea: data.realCommonArea,
          assetLandUsingPurposes: data.assetLandUsingPurposes
            ? data.assetLandUsingPurposes.map((item) => ({
                ...item,
                key: randomId(),
              }))
            : [],
          assetTrees: data.assetTrees
            ? data.assetTrees.map((item) => {
                return {
                  ...item,
                  key: randomId(),
                };
              })
            : [],
          constructions: data.constructions
            ? data.constructions.map((item) => {
                return {
                  ...item,
                  key: randomId(),
                };
              })
            : [],
          constructionFutureInfors: data.constructionFutureInfors?.map(
            (item) => {
              return {
                ...item,
                key: randomId(),
              };
            }
          ),
          constructionChecklists: data.constructionChecklists
            ?.map((item) => {
              return {
                ...item,
                key: randomId(),
              };
            })
            ?.sort(
              (a, b) =>
                Number(a.contructionFutureInforId) -
                Number(b.contructionFutureInforId)
            ),
        };
        form.setValues({ ...form.values, ...getData });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useImperativeHandle(ref, () => ({
      btnRefUpdateFeatureLandItem: async () => {
        const addressLandDataRef = await addressLandRef.current?.getData();
        const [constructionsDataRef, constructionsErrors] =
          await constructionsRef.current?.getData();
        const detailAddressDataRef = await detailAddressRef.current?.getData();
        const [featureTableDataRef, featureTableErrors] =
          await featureTableRef.current?.getData();
        const [projectInFutureDataRef, projectInFutureErrors] =
          projectInFutureRef.current
            ? await projectInFutureRef.current?.getData()
            : [{}, {}];

        await form.submitForm();

        const errors = {
          ...form.errors,
          ...featureTableErrors,
          ...constructionsErrors,
          ...projectInFutureErrors,
        };

        const validate = JSON.stringify(errors) === "{}" ? false : errors;
        // console.log("check err: ", validate);
        return [
          {
            ...form.values,
            ...addressLandDataRef,
            ...detailAddressDataRef,
            ...featureTableDataRef,
            ...projectInFutureDataRef,
            ...constructionsDataRef,
            assetLandUsingPurposes: form.values.assetLandUsingPurposes.map(
              (el, index) => ({ ...el, orderBy: index })
            ),
            orderBy: index,
          },
          validate,
        ];
      },
    }));

    const inputs: InputFiledParams[] = [
      {
        key: 1,
        label: "Số thửa",
        type: INPUT,
        placeholder: "Nhập",
        css: css,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        error: form.errors.landPlotNumber,
        value: form.values.landPlotNumber,
        onChange: (e: any) =>
          form.setValues({ ...form.values, landPlotNumber: e.target.value }),
      },
      {
        key: 2,
        label: "Số tờ bản đồ",
        type: INPUT,
        placeholder: "Nhập",
        css: css,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        error: form.errors.mapSheetNumber,
        value: form.values.mapSheetNumber,
        onChange: (e: any) =>
          form.setValues({ ...form.values, mapSheetNumber: e.target.value }),
      },
    ];

    const handleChangeData = useCallback(
      (data: any) => {
        const _data = reTypeEmptyString2NullObj(data);
        form.setValues({ ...form.values, ..._data });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [form.values]
    );

    const handleChangePurposeData = useCallback(
      (key: string, data: any) => {
        const tmpArr = [...form.values.assetLandUsingPurposes];

        const foundIndex = tmpArr.findIndex((el) => el.key === key);
        if (foundIndex !== -1) {
          const _data = reTypeEmptyString2NullObj(data);

          tmpArr[foundIndex] = {
            ...tmpArr[foundIndex],
            ..._data,
          };

          form.setValues({
            ...form.values,
            assetLandUsingPurposes: tmpArr,
          });
        }
      },
      [form.values]
    );
    const addressLandData = useMemo(() => {
      const result = pick(data, [
        "legalAddressDetail",
        "legalAddressStreet",
        "legalAddressWard",
        "legalAddressDistrict",
        "legalAddressProvince",
        "realAddressDetail",
        "realAddressStreet",
        "realAddressWard",
        "realAddressDistrict",
        "realAddressProvince",
        "legalDistricts",
        "districts",
        "legalWards",
        "wards",
      ]);
      return result;
    }, [data]);
    const detailAddressData = useMemo(() => {
      const result = pick(data, [
        "roadInPriceRange",
        "distanceToMainRoad",
        "roadContiguousTypeId",
        "positionInPriceRangeId",
        "positionId",
        "minWidthToMainRoad",
        "maxWidthToMainRoad",
        "zoneId",
        "note",
      ]);
      return result;
    }, [data]);
    const featureTableData = useMemo(() => {
      const result = pick(data, [
        "legalMainDirection",
        "legalShape",
        "legalNumberOfFacade",
        "legalFacadeLength",
        "legalLandLength",
        "legalAreaWidth",
        "legalAreaInPlan",
        "legalAreaUnPlan",
        "legalPrivateArea",
        "legalCommonArea",
        "legalAreaNotConsiderValue",
        "legalCurrentPrivateUsing",
        "legalLandLengthDetail",
        "realMainDirection",
        "realShape",
        "realNumberOfFacade",
        "realFacadeLength",
        "realLandLength",
        "realAreaWidth",
        "realAreaInPlan",
        "realAreaUnPlan",
        "realPrivateArea",
        "realCommonArea",
        "realAreaNotConsiderValue",
        "realCurrentPrivateUsing",
        "realLandLengthDetail",
      ]);
      return result;
    }, [data]);
    const projectInFutureData = useMemo(() => {
      const result = pick(data, [
        "contructionFutureText",
        "constructionFutureInfors",
        "constructionChecklists",
        "totalArea",
        "buildingDensity",
        "coeffcientsUsed",
        "height",
        "totalApartments",
        "numOfFloors",
        "underTankArea",
        "wasteTankArea",
        "numOfUnderFloors",
        "basementFloor",
        "depth",
        "constructionFloor",
        "constructionArea",
        "turnPart",
        "solePart",
        "towerPart",
        "constructionTitle",
        "structuralSolution",
        "architectualSolution",
        "systemEngineering",
        "systemTraffic",
        "interior",
        "estimateComment",
        "totalFloorArea",
      ]);
      return result;
    }, [data]);

    const constructionsData = useMemo(() => {
      return (
        data.constructions
          ?.map((item) => {
            return {
              ...item,
              key: randomId(),
            };
          })
          ?.sort((a, b) => Number(a.orderBy) - Number(b.orderBy)) || []
      );
    }, [data]);

    // useEffect(() => {
    //   if (isMergeLand && form.values.isConsolidationPurpose) {
    //     form.setValues({
    //       ...form.values,
    //       isConsolidationPurpose: false,
    //     });
    //   }
    // }, [isMergeLand]);
    // useEffect(() => {
    //   if (form.values?.assetLandUsingPurposes?.length === 1) {
    //     form.setValues({
    //       ...form.values,
    //       isConsolidationPurpose: false,
    //     });
    //   }
    // }, [form.values?.assetLandUsingPurposes?.length]);

    return (
      <Space style={{ width: "100%" }} direction="vertical" size={"small"}>
        {/* <Space size="middle">
          <Typography style={{ opacity: "0.6", minWidth: "120px" }}>
            Mục đích hỗn hợp:{" "}
          </Typography>
          <Radio.Group
            onChange={(e) => {
              const value = e.target.value;
              if (value && isMergeLand) {
                setIsMergeLand(false);
              }
              form.setValues({
                ...form.values,
                isConsolidationPurpose: value,
              });
            }}
            disabled={
              form.values?.assetLandUsingPurposes?.length <= 1 || isMergeLand
            }
            value={form.values.isConsolidationPurpose}
          >
            <Radio value={true}>Có</Radio>
            <Radio value={false}>Không</Radio>
          </Radio.Group>
        </Space> */}
        <Form labelWrap labelAlign="left" size="small">
          <Row gutter={[24, 4]} style={{ marginBottom: "8px" }}>
            <InputFields data={inputs} />
          </Row>
          <AddressLand data={addressLandData} ref={addressLandRef} />
          <DetailAddress
            data={detailAddressData}
            ref={detailAddressRef}
            provinceCode={form.values.realAddressProvince}
          />
          <FeatureTable
            data={featureTableData}
            ref={featureTableRef}
            updateListTab={updateListTab}
          />

          <Row justify={"start"}>
            <Button
              icon={<Icons.add />}
              style={{ background: "#2862AF", margin: "8px 0px" }}
              size="small"
              type="primary"
              onClick={() => {
                const tmpArr = [...form.values.assetLandUsingPurposes];
                const newObj: AssetLanUsingPurposeType = {
                  key: randomId(),
                  usingPurposeId: null,
                  usingOrigin: null,
                  originDetail: null,
                  usingPeriod: null,
                  usingPeriodId: null,
                  legalAreaWidth: null,
                  legalAreaInPlan: null,
                  legalAreaUnPlan: null,
                  legalPrivateArea: null,
                  legalCommonArea: null,
                  legalAreaNotConsiderValue: null,
                  realAreaWidth: null,
                  realAreaInPlan: null,
                  realAreaUnPlan: null,
                  realPrivateArea: null,
                  realCommonArea: null,
                  realAreaNotConsiderValue: null,
                  isConsolidationPurposeParent: false,
                };
                tmpArr.push(newObj);
                form.setValues({
                  ...form.values,
                  assetLandUsingPurposes: tmpArr,
                });
              }}
            >
              Thêm mục đích sử dụng
            </Button>
          </Row>
          <CollapseCustom
            isInner
            itemList={[
              ...(form.values.assetLandUsingPurposes
                ? form.values.assetLandUsingPurposes
                    .filter((el) => !el.isConsolidationPurposeParent)
                    .sort((a, b) => Number(a.orderBy) - Number(b.orderBy))
                    .map((item: AssetLanUsingPurposeType, index: number) => ({
                      key: index.toString(),
                      label: (
                        <Space>
                          <span>Mục đích sử dụng đất {index + 1}</span>
                        </Space>
                      ),
                      children: (
                        <PurposeLand
                          key={index}
                          assetLandUsingPurposeItem={item}
                          handleChange={handleChangePurposeData}
                          handleRemove={(key: string) => {
                            const tmpArr = [
                              ...form.values.assetLandUsingPurposes,
                            ];
                            const foundIndex = tmpArr.findIndex(
                              (el) => el.key === key
                            );
                            if (foundIndex !== -1) tmpArr.splice(foundIndex, 1);
                            form.setValues({
                              ...form.values,
                              assetLandUsingPurposes: tmpArr,
                            });
                          }}
                          errors={
                            form.errors?.assetLandUsingPurposes?.[index] || ""
                          }
                          touched={
                            form.touched?.assetLandUsingPurposes?.[index] || ""
                          }
                          updateListTab={updateListTab}
                        />
                      ),
                    }))
                : []),
            ]}
          />
          <CollapseCustom
            isInner
            defaultActiveKey={[1, 2]}
            itemList={[
              //cay trong tren dat
              {
                key: 1,
                label: "Cây trồng trên đất",
                children: (
                  <TreeInLand
                    errors={form.errors}
                    touched={form.touched}
                    visible={isTreeLand}
                    setVisible={setIsTreeLand}
                    onChange={handleChangeData}
                    handleAdd={() => {
                      const tmpArr = [...form.values.assetTrees];
                      const newItem: TreeAssetType = {
                        key: randomId(),
                        amount: null,
                        area: null,
                        assetLandInforId: form.values.assetLandInforId,
                        density: null,
                        location: null,
                        lossRate: null,
                        treeDetail: null,
                        treeId: null,
                        treeTypeId: null,
                        yearOld: null,
                      };
                      tmpArr.push(newItem);
                      form.setValues({
                        ...form.values,
                        assetTrees: tmpArr,
                      });
                    }}
                    treeLandInfor={{ assetTrees: form.values.assetTrees }}
                  />
                ),
              },
              // cong trinh xay dưng
              {
                key: 2,
                label: "Công trình xây dựng",
                children: (
                  <Contruction
                    ref={constructionsRef}
                    contructionLandInfor={constructionsData}
                    assetLandInforId={form.values.assetLandInforId}
                    index={index}
                    visible={isConstructLand}
                    setVisible={setIsConstructLand}
                  />
                ),
              },
              appraisalDetail?.assetLevelTwoId === 9
                ? {
                    key: 3,
                    label: "Công trình xây dựng hình thành trong tương lai",
                    forceRender: true,
                    children: (
                      <ProjectInFuture
                        data={projectInFutureData as AssetProjectInFutureType}
                        ref={projectInFutureRef}
                      />
                    ),
                  }
                : {},
            ]}
          />
        </Form>
      </Space>
    );
  }
);

export default memo(FeatureLandItemTab);
