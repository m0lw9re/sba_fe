import { Button, Checkbox, Form, Row, Space } from "antd";
import Icons from "assets/icons";
import { CollapseCustom } from "components/CollapseCustom";
import { TYPE_FIELD } from "constant/enums";
import { TreeAssetType } from "constant/types";
import {
  AssetLanUsingPurposeType,
  AssetProjectInfoType,
} from "constant/types/appraisalFile";
import { useFormik } from "formik";
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
import { reTypeEmptyString2NullObj } from "utils/validate";
import PurposeLand from "../PurposeLand";
import Contruction from "./component/Contruction";
import TreeInLand from "./component/TreeInLand";
import Describe from "./component/Describe";
import { formSchema } from "./config";
import "./style.scss";

const { INPUT } = TYPE_FIELD;

type Props = {
  data: AssetProjectInfoType;
  updateListTab: any;
  areaWidth: number | null;
  isShowAppendixDetail: boolean | null;
};

type RefProps = {
  updateFeatureProjectItem: () => void;
};

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
const cssLabel = { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 };
const cssInput = { xs: 18, sm: 18, md: 18, lg: 18, xl: 18 };

const FeatureProjectItemTab = forwardRef<RefProps, Props>(
  ({ data, updateListTab, areaWidth, isShowAppendixDetail }, ref) => {
    const { id } = useParams<{ id: string }>();
    const form = useFormik({
      initialValues: {} as AssetProjectInfoType | any,
      validationSchema: formSchema,
      onSubmit: (data: AssetProjectInfoType): any => {
        return {
          ...data,

          assetTrees:
            isTreeLand && data?.assetTrees ? [...data.assetTrees] : [],
        };
      },
    });

    const constructionsRef = useRef<{
      getData: () => any;
    }>(null);

    const detailDescribesRef = useRef<{
      getData: () => any;
    }>(null);

    const [isConstructLand, setIsConstructLand] = useState<boolean>(false);
    const [isTreeLand, setIsTreeLand] = useState<boolean>(false);
    const [isDescribe, setIsDescribe] = useState<boolean>(false);
    const [_isShowAppendixDetail, setIsShowAppendixDetail] =
      useState(isShowAppendixDetail);

    useEffect(() => {
      if (data?.assetTrees?.length > 0) {
        setIsTreeLand(true);
      }
      if (data?.constructions?.length > 0) {
        setIsConstructLand(true);
      }
      if (data?.detailDescribes?.length > 0) {
        setIsDescribe(true);
      }
    }, [data]);

    useEffect(() => {
      if (data) {
        const getData = {
          ...data,
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
        };
        form.setValues({ ...form.values, ...getData });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    // useEffect(() => {
    //   if (areaWidth !== null) {
    //     form.setValues({
    //       ...form.values,
    //       assetLandUsingPurposes: form.values.assetLandUsingPurposes.map(
    //         (item) => ({
    //           ...item,
    //           legalAreaWidth: areaWidth,
    //           legalAreaUnPlan: areaWidth - (item?.legalAreaInPlan || 0),
    //         })
    //       ),
    //     });
    //   }
    // }, [areaWidth]);

    useImperativeHandle(ref, () => ({
      updateFeatureProjectItem: async () => {
        const [constructionsDataRef, constructionsErrors] =
          await constructionsRef.current?.getData();
        const [detailDescribesDataRef, detailDescribesErrors] =
          await detailDescribesRef.current?.getData();

        await form.submitForm();
        const errors = {
          ...form.errors,
          ...constructionsErrors,
          ...detailDescribesErrors,
        };
        const validate = JSON.stringify(errors) === "{}" ? false : errors;

        return [
          {
            ...form.values,
            ...constructionsDataRef,
            ...detailDescribesDataRef,
            assetLandUsingPurposes: form.values.assetLandUsingPurposes.map(
              (el, index) => ({ ...el, orderBy: index })
            ),
            isShowAppendixDetail: _isShowAppendixDetail,
          },
          validate,
        ];
      },
    }));

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

    const detailDescribesData = useMemo(() => {
      return data.detailDescribes?.map((item) => {
        return {
          ...item,
          key: randomId(),
        };
      });
      //?.sort((a, b) => Number(a.orderBy) - Number(b.orderBy)) || []
    }, [data]);

    return (
      <Space style={{ width: "100%" }} direction="vertical" size={"small"}>
        <Form labelWrap labelAlign="left" size="small">
          <Row justify={"start"}>
            <Space size="large">
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
                    usingPeriod: null,
                    usingPeriodId: null,
                    originDetail: null,
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
              <Checkbox
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsShowAppendixDetail(checked);
                }}
                checked={_isShowAppendixDetail || false}
              >
                Xem chi tiết phụ lục
              </Checkbox>
            </Space>
          </Row>
          <CollapseCustom
            isInner
            itemList={[
              ...(form.values.assetLandUsingPurposes
                ? form.values.assetLandUsingPurposes
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
            defaultActiveKey={[1, 2, 3]}
            itemList={[
              //cay trong tren dat
              {
                key: 1,
                label: "Cây trồng trên đất",
                children: (
                  <TreeInLand
                    errors={form.errors?.assetTrees}
                    touched={form.touched?.assetTrees}
                    visible={isTreeLand}
                    setVisible={setIsTreeLand}
                    onChange={handleChangeData}
                    handleAdd={() => {
                      const tmpArr = [...form.values.assetTrees];
                      const newItem: TreeAssetType = {
                        key: randomId(),
                        amount: null,
                        area: null,
                        assetLandInforId: form.values.assetProjectInforId,
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
                    assetLandInforId={form.values.assetProjectInforId}
                    visible={isConstructLand}
                    setVisible={setIsConstructLand}
                  />
                ),
              },
              {
                key: 3,
                label: "Mô tả chi tiết",
                children: (
                  <Describe
                    ref={detailDescribesRef}
                    detailDescribes={detailDescribesData}
                    assetLandInforId={form.values.assetProjectInforId}
                    visible={isDescribe}
                    setVisible={setIsDescribe}
                  />
                ),
              },
            ]}
          />
        </Form>
      </Space>
    );
  }
);

export default memo(FeatureProjectItemTab);
