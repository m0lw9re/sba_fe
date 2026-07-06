import "./style.scss";
import {
  Button,
  Col,
  Input,
  Radio,
  Row,
  Space,
  Tabs,
  Typography,
  message,
  Form,
  Spin,
} from "antd";
import Icons from "assets/icons";
import {
  createRef,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import FeatureApartmentItemTab from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/FeatureApartment/component/FeatureApartmentItemTab"; //" ./component/FeatureApartmentItemTab";
import { AssetApartmentInfoType } from "constant/types/appraisalFile";
import { addressApi } from "apis/adress";
import { randomId } from "utils";
import Consolidation from "./component/Consolidation";
import { CollapseCustom } from "components/CollapseCustom";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
import ButtonCustom from "components/ButtonCustom";
import { isEqual } from "lodash";

type Props = {
  mergeApartmentData: {
    combinePrivateArea: number | null;
    combineNote: string | null;
    combineAppraisalLocation: string | null;
  };
  assetApartmentInfos: Array<AssetApartmentInfoType>;
};

type RefProps = {
  updateFeatureApartment: () => void;
};

const assetApartmentInfoInit: any = {};

const FeatureApartment = forwardRef<RefProps, Props>(
  ({ assetApartmentInfos, mergeApartmentData }, ref) => {
    const { addressByLos } = useSelector(
      (state: RootState) => state.appraisalFileDetailSlice
    );
    // Hợp khối
    const [isMergeApartment, setIsMergeApartment] = useState<boolean>(false);
    const [isExportSummary, setIsExportSummary] = useState<boolean>(false);
    // Danh sách căn hộ
    const [tabList, setTabList] = useState<Array<AssetApartmentInfoType>>(
      assetApartmentInfos || []
    );
    const [tabListForMerge, setTabListForMerge] = useState<
      Array<AssetApartmentInfoType>
    >([]);
    const [activeTab, setActiveTab] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const refInputAddressDetail = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      updateFeatureApartment: async () => {
        let resArray: any = [];
        let tabError = [];
        let updateMergeApartmentData;

        for (
          let i = 0;
          i < btnRefUpdateFeatureApartmentItemList.current.length;
          i++
        ) {
          const [res] = await btnRefUpdateFeatureApartmentItemList.current[
            i
          ].current?.btnRefUpdateFeatureApartmentItem();

          // xóa các trường không cần thiết
          delete res?.districts;
          delete res?.wards;
          delete res?.isSelected;
          if (res)
            resArray.push({
              ...res,
              isConsolidation: isMergeApartment,
              // // override các trường trong bảng tóm tắt
              // realAddressProvince: updatedSummaryTable[i].realAddressProvince,
              // realAddressDistrict: updatedSummaryTable[i].realAddressDistrict,
              // realAddressWard: updatedSummaryTable[i].realAddressWard,
              // realAddressStreet: updatedSummaryTable[i].realAddressStreet,
              // realAddressDetail: updatedSummaryTable[i].realAddressDetail,
              // realAreaWidth: updatedSummaryTable[i].realAreaWidth,
              // note: updatedSummaryTable[i].note,
            });
          else tabError.push(i + 1);
        }

        if (isMergeApartment) {
          const res =
            await btnRefUpdateMergeApartment.current?.updateMergeApartment();
          updateMergeApartmentData = res;
          if (!updateMergeApartmentData) {
            message.error(`Vui lòng nhập đầy đủ thông tin hợp khối`);
          }
        } else {
          updateMergeApartmentData = {
            combinePrivateArea: null,
            combineNote: null,
            combineAppraisalLocation:
              refInputAddressDetail.current?.resizableTextArea?.textArea
                ?.value || null,
          };
        }

        if (tabError.length > 0) {
          message.error(
            `Vui lòng nhập đầy đủ thông tin căn hộ số: ${tabError.join(", ")}`
          );
          resArray = undefined;
        }

        let exportType = 0;
        if (!isExportSummary && isMergeApartment) exportType = 1;
        if (isExportSummary && !isMergeApartment) exportType = 2;

        return {
          assetApartmentInfos: resArray,
          mergeApartmentData: updateMergeApartmentData,
          exportType,
        };
      },
    }));

    const fetchDistrictsAndWards = async () => {
      // lấy danh sách quận huyện và phường xã lần đầu load
      const districtCodes = assetApartmentInfos.map(
        (item) => item.realAddressProvince || ""
      );
      const wardCodes = assetApartmentInfos.map(
        (item) => item.realAddressDistrict || ""
      );

      const legalDistrictCodes = assetApartmentInfos.map(
        (item) => item.legalAddressProvince || ""
      );
      const legalWardCodes = assetApartmentInfos.map(
        (item) => item.legalAddressDistrict || ""
      );

      const districtCodesSet: string[] = [...new Set(districtCodes)];
      const wardCodesSet: string[] = [...new Set(wardCodes)];

      const legalDistrictCodesSet: string[] = [...new Set(legalDistrictCodes)];
      const legalWardCodesSet: string[] = [...new Set(legalWardCodes)];

      const districtsPromises = districtCodesSet.map(async (code) => {
        if (!code) return;
        const districts = await addressApi.getDistricts({
          code,
        });
        return {
          districts: districts.data?.map((item: any) => ({
            value: item.code,
            label: item.fullName,
          })),
        };
      });
      const districtsData = await Promise.all(districtsPromises);

      let legalDistrictsData: any = [];
      if (isEqual(districtCodesSet, legalDistrictCodesSet)) {
        legalDistrictsData = districtsData;
      } else {
        const legalDistrictsPromises = legalDistrictCodesSet.map(
          async (code) => {
            if (!code) return;
            const districts = await addressApi.getDistricts({
              code,
            });
            return {
              districts: districts.data?.map((item: any) => ({
                value: item.code,
                label: item.fullName,
              })),
            };
          }
        );
        legalDistrictsData = await Promise.all(legalDistrictsPromises);
      }

      const wardsPromises = wardCodesSet.map(async (code) => {
        if (!code) return;
        const wards = await addressApi.getWards({
          code,
        });
        return {
          wards: wards.data?.map((item: any) => ({
            value: item.code,
            label: item.fullName,
          })),
        };
      });
      const wardsData = await Promise.all(wardsPromises);

      let legalWardsData: any = [];
      if (isEqual(wardCodesSet, legalWardCodesSet)) {
        legalWardsData = wardsData;
      } else {
        const legalWardsPromises = legalWardCodesSet.map(async (code) => {
          if (!code) return;
          const wards = await addressApi.getWards({
            code,
          });
          return {
            wards: wards.data?.map((item: any) => ({
              value: item.code,
              label: item.fullName,
            })),
          };
        });
        legalWardsData = await Promise.all(legalWardsPromises);
      }

      const handleGetDistrictsInArray = (code: string | null) => {
        const index = districtCodesSet.findIndex((item) => item === code);
        if (index === -1) return [];
        return districtsData[index]?.districts || [];
      };
      const handleGetWardsInArray = (code: string | null) => {
        const index = wardCodesSet.findIndex((item) => item === code);
        if (index === -1) return [];
        return wardsData[index]?.wards || [];
      };
      const handleGetLegalDistrictsInArray = (code: string | null) => {
        const index = legalDistrictCodesSet.findIndex((item) => item === code);
        if (index === -1) return [];
        return legalDistrictsData[index]?.districts || [];
      };
      const handleGetLegalWardsInArray = (code: string | null) => {
        const index = legalWardCodesSet.findIndex((item) => item === code);
        if (index === -1) return [];
        return legalWardsData[index]?.wards || [];
      };
      const newData = assetApartmentInfos.map((item, index) => {
        return {
          ...item,
          districts: handleGetDistrictsInArray(item.realAddressProvince),
          wards: handleGetWardsInArray(item.realAddressDistrict),
          legalDistricts: handleGetLegalDistrictsInArray(
            item.legalAddressProvince
          ),
          legalWards: handleGetLegalWardsInArray(item.legalAddressDistrict),
          key: randomId(),
          id: randomId(),
        };
      });

      setTabList(newData);
    };

    useEffect(() => {
      if (assetApartmentInfos) {
        if (assetApartmentInfos.length > 0) {
          fetchDistrictsAndWards();
          setTabListForMerge(
            assetApartmentInfos.map((item) => ({
              ...item,
              id: randomId(),
            }))
          );
          let checkMergeApartment = false;
          for (let i = 0; i < assetApartmentInfos.length; i++) {
            if (!assetApartmentInfos[i].isConsolidation)
              checkMergeApartment = false;

            if (assetApartmentInfos[i].isConsolidation)
              checkMergeApartment = true;
          }
          if (checkMergeApartment) setIsExportSummary(false);
          setIsMergeApartment(checkMergeApartment);
        } else {
          handleAddTab();
        }
      }
    }, [JSON.stringify(assetApartmentInfos)]);

    // useEffect(() => {
    //   if (mergeApartmentData) {
    //     const tmp: any = { ...mergeApartmentData };
    //     let isExitedValue = true;
    //     for (const key in tmp) {
    //       if (tmp[key] === null) {
    //         isExitedValue = false;
    //         break;
    //       }
    //     }

    //     if (isExitedValue) setIsExportSummary(false);

    //     setIsMergeApartment(isExitedValue);
    //   }
    // }, [mergeApartmentData]);

    const btnRefUpdateFeatureApartmentItemList = useRef<any>([]);
    const btnRefUpdateMergeApartment = useRef<{
      updateMergeApartment: () => void;
    }>(null);

    if (
      btnRefUpdateFeatureApartmentItemList.current.length !== tabList.length
    ) {
      // add or remove refs
      btnRefUpdateFeatureApartmentItemList.current = Array(tabList.length)
        .fill(null)
        .map(
          (_, i) =>
            btnRefUpdateFeatureApartmentItemList.current[i] ||
            createRef<{ btnRefUpdateFeatureApartmentItem: () => void }>()
        );
    }

    const handleChangeActiveTab = async (key: string) => {
      setActiveTab(key);
      setTabList(tabList);
    };
    const handleStartLoading = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 400));
    };
    const handleEndLoading = async () => {
      setLoading(false);
    };
    const handleDeleteTab = async (itemId: any) => {
      await handleStartLoading();
      // let resArray = [];
      // for (
      //   let i = 0;
      //   i < btnRefUpdateFeatureApartmentItemList.current.length;
      //   i++
      // ) {
      //   const [res] = await btnRefUpdateFeatureApartmentItemList.current[
      //     i
      //   ].current?.btnRefUpdateFeatureApartmentItem();
      //   if (res) resArray.push(res);
      //   else return;
      // }
      const array = [...tabList];
      const foundItem = array.filter((item) => item.id !== itemId);
      const foundIndex = array.findIndex((item) => item.id === itemId);
      setTabList(foundItem);
      setActiveTab((foundIndex - 1).toString() || "0");
      if (foundItem?.length < 2) setIsMergeApartment(false);
      await handleEndLoading();
    };

    const handleAddTab = async () => {
      await handleStartLoading();
      setTabList([
        ...tabList,
        {
          ...assetApartmentInfoInit,
          id: randomId(),
        },
      ]);
      await handleEndLoading();
    };

    const getDataCopyOfTab = useCallback(
      async (index: number) => {
        await handleStartLoading();
        const [res] = await btnRefUpdateFeatureApartmentItemList.current[
          index
        ].current?.btnRefUpdateFeatureApartmentItem();
        const tabData = res || tabList[index];
        if (tabData) {
          const newItem = {
            ...tabData,
            id: randomId(),
            assetApartmentInforId: null,
          };
          await handleEndLoading();
          return newItem;
        }
      },
      [isMergeApartment, tabList]
    );

    const handleCopyRow = useCallback(
      async (index: number) => {
        const newItem: any = await getDataCopyOfTab(index);
        setTabList((prev) => [...prev, newItem]);
        setTabListForMerge((prev) => [...prev, newItem]);
      },
      [getDataCopyOfTab]
    );

    const updateListTab = useCallback(async () => {
      if (!isMergeApartment) return;
      let resArray = [];
      for (
        let i = 0;
        i < btnRefUpdateFeatureApartmentItemList.current.length;
        i++
      ) {
        const [res] = await btnRefUpdateFeatureApartmentItemList.current[
          i
        ].current?.btnRefUpdateFeatureApartmentItem();
        if (res) resArray.push(res);
        else return;
      }
      setTabListForMerge(resArray);
    }, []);

    return (
      <div>
        <Spin spinning={loading}>
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
                  value={addressByLos}
                  placeholder={"Hệ thống tự nhập"}
                  allowClear={false}
                />
              </Form.Item>
            </Col>
            {!isMergeApartment && tabList.length > 1 && (
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
                    defaultValue={
                      mergeApartmentData.combineAppraisalLocation || ""
                    }
                    placeholder={"Hệ thống tự nhập"}
                    allowClear={false}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
          <Tabs
            className="feature-land-tab-custom"
            items={tabList.map((item, index) => {
              let btn = (
                <Button
                  type="primary"
                  style={{ borderRadius: "50%" }}
                  danger
                  onClick={() => {
                    handleDeleteTab(item.id!);
                  }}
                  icon={<Icons.sub />}
                  size="small"
                />
              );
              if (index === 0)
                btn = (
                  <Button
                    type="primary"
                    style={{ borderRadius: "50%", background: "#2862af" }}
                    onClick={handleAddTab}
                    icon={<Icons.add />}
                    size="small"
                  />
                );
              return {
                key: index.toString(),
                label: (
                  <Space>
                    <span>Căn hộ {index + 1}</span>
                    {btn}
                    <ButtonCustom
                      bgColor="#00b335"
                      size="small"
                      icon={<Icons.copy style={{ color: "#FFFFFF" }} />}
                      onClick={() => handleCopyRow(index)}
                    />
                  </Space>
                ),
                forceRender: true,
                children: (
                  <>
                    <Space size="middle" style={{ marginBottom: "8px" }}>
                      <Typography style={{ opacity: "0.6" }}>
                        Hợp khối:{" "}
                      </Typography>
                      <Radio.Group
                        onChange={(e) => {
                          const checked = e.target.value;
                          if (isExportSummary && checked) {
                            setIsMergeApartment(checked);
                            setIsExportSummary(false);
                          }
                          setIsMergeApartment(checked);
                        }}
                        value={isMergeApartment}
                        disabled={tabList.length <= 1 ? true : false}
                      >
                        <Radio value={true}>Có</Radio>
                        <Radio value={false}>Không</Radio>
                      </Radio.Group>
                    </Space>

                    <FeatureApartmentItemTab
                      ref={btnRefUpdateFeatureApartmentItemList.current[index]}
                      data={item}
                      updateListTab={updateListTab}
                      index={index}
                    />
                  </>
                ),
              };
            })}
            activeKey={activeTab}
            onChange={(key) => handleChangeActiveTab(key)}
          />
        </Spin>
        {isMergeApartment && (
          <CollapseCustom
            isInner
            itemList={[
              {
                label: "Thông tin hợp khối",
                children: (
                  <Consolidation
                    ref={btnRefUpdateMergeApartment}
                    assetApartmentInfors={tabListForMerge}
                    mergeApartmentData={mergeApartmentData}
                  />
                ),
              },
            ]}
          />
        )}
      </div>
    );
  }
);

export default memo(FeatureApartment);
