import "./style.scss";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Space,
  Spin,
  Tabs,
  Typography,
  message,
} from "antd";
import Icons from "assets/icons";
import {
  createRef,
  forwardRef,
  Fragment,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import FeatureLandItemTab from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/FeatureLand/component/FeatureLandItemTab";
import Consolidation from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/FeatureLand/component/Consolidation";
import { randomId } from "utils/string";
import { AssetLandInfoType } from "constant/types/appraisalFile";
import { CollapseCustom } from "components/CollapseCustom";
import FeatureLandSummaryTable from "./component/FeatureLandSummaryTable/FeatureLandSummaryTable";
import { addressApi } from "apis/adress";
import ButtonCustom from "components/ButtonCustom";
import { isDeepEqual } from "utils";
import { debounce, isEqual } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
import {
  ConstructionOptions,
  setConstructionOptions,
  setListAppendixAssets,
} from "pages/AppraisalFileDetail/store/appraisalFileDetailSlice";
import { contructionApi } from "apis/contruction";
import { ContructionNameType } from "constant/types";
import ManifestModal from "./component/ManifestModal";
import icons from "assets/icons";
import { ecmFileApi } from "apis/ecmFile";
import saveAs from "file-saver";

type Props = {
  assetLandInfos: Array<AssetLandInfoType>;
  mergeLandData: {
    facadeLength: number | null;
    totalLength: number | null;
    combinePrivateArea: number | null;
    combineCommonArea: number | null;
    combineAreaWidth: number | null;
    combineAreaInPlan: number | null;
    combineAreaUnPlan: number | null;
    combineNote: string | null;
    combineAppraisalLocation: string | null;
    combineLandShape: string | null;
    combineAreaNotConsiderValue: number | null;
    combineLandAddressDetail: string | null;
    combineAreaWidthDetail: string | null;
  };
};

type RefProps = {
  updateFeatureLand: () => void;
};
const assetLandInfoInit: AssetLandInfoType = {
  landPlotNumber: null,
  legalAddressDistrict: null,
  legalAddressWard: null,
  legalAddressStreet: null,
  legalAddressDetail: null,
  assetLandUsingPurposes: [],
  assetTrees: [],
  constructions: [],
  dateCreate: null,
  dateModify: null,
  distanceToMainRoad: null,
  distanceToNearestBranch: null,
  legalAddressProvince: null,
  legalAreaInPlan: null,
  legalAreaUnPlan: null,
  legalAreaWidth: null,
  legalCommonArea: null,
  legalFacadeLength: null,
  legalLandLength: null,
  legalMainDirection: null,
  legalNumberOfFacade: null,
  legalPrivateArea: null,
  legalShape: null,
  legalAreaNotConsiderValue: null,
  legalCurrentPrivateUsing: null,
  legalLandLengthDetail: null,
  mapSheetNumber: null,
  note: null,
  realAddressDetail: null,
  realAddressDistrict: null,
  realAddressProvince: null,
  realAddressStreet: null,
  realAddressWard: null,
  realAreaInPlan: null,
  realAreaUnPlan: null,
  realAreaWidth: null,
  realCommonArea: null,
  realFacadeLength: null,
  realLandLength: null,
  realMainDirection: null,
  realNumberOfFacade: null,
  realPrivateArea: null,
  realShape: null,
  realAreaNotConsiderValue: null,
  realCurrentPrivateUsing: null,
  realLandLengthDetail: null,
  roadContiguousTypeId: null,
  roadInPriceRange: null,
  whoCreate: null,
  zoneId: null,
  maxWidthToMainRoad: null,
  minWidthToMainRoad: null,
  positionId: null,
  positionInPriceRangeId: null,
  assetId: null,
  assetLandInforId: null,
  isConsolidation: false,
  isConsolidationPurpose: false,
  isViewManifest: false,
};

const keyLabel: {
  [key: string]: string;
} = {
  assetLandUsingPurposes: "Mục đích sử dụng đất",
  constructions: "Công trình xây dựng",
  totalFloorArea: "CTXD hình thành trong tương lai",
  realAreaUnPlan: "Diện tích KPHQH",
};

// const delay = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

const handleGenerateErrorMessage = (error: any, landIndex: number) => {
  const keys: string[] = Object.keys(error);
  if (keys.length > 0) {
    let messageValue = "";
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const label = keyLabel[key];
      if (label) {
        messageValue += `Vui lòng kiểm tra thông tin ${label} tại thửa đất ${landIndex} \n`;
      }
    }
    message.error(messageValue);
    return messageValue;
  } else {
    return null;
  }
};

const FeatureLand = forwardRef<RefProps, Props>(
  ({ assetLandInfos, mergeLandData }, ref) => {
    const dispatch = useDispatch();

    const { constructionOptions, addressByLos, listAppendixAssets } =
      useSelector((state: RootState) => state.appraisalFileDetailSlice);

    const [isMergeLand, setIsMergeLand] = useState<boolean>(true);
    const [isViewManifest, setIsViewManifest] = useState<boolean>(false);
    const [isViewManifestModal, setIsViewManifestModal] = useState<{
      isOpenModal: boolean;
      formType: "add" | "edit";
    }>({ isOpenModal: false, formType: "add" });

    const [isConsolidationPurpose, setIsConsolidationPurpose] =
      useState<boolean>(true);
    const [isExportSummary, setIsExportSummary] = useState<boolean>(false);
    const [tabList, setTabList] = useState<Array<AssetLandInfoType>>(
      assetLandInfos || []
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [tabListForMerge, setTabListForMerge] = useState<
      Array<AssetLandInfoType>
    >([]);
    const [activeTab, setActiveTab] = useState<string>("0");

    const refInputAddressDetail = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      updateFeatureLand: async () => {
        let resArray: any = [];
        let resError: boolean = false;
        let updateMergeLandData: any;

        const [updatedSummaryTable, validateResult] =
          await handleGetDataSummaryTable();
        if (!validateResult) {
          message.error(
            `Vui lòng nhập Tỉnh/TP, diện tích khuôn viên, mô tả ở bảng tóm tắt thửa đất`
          );
          return;
        }

        for (
          let i = 0;
          i < btnRefUpdateFeatureLandItemList.current.length;
          i++
        ) {
          const [res, validErrors] =
            await btnRefUpdateFeatureLandItemList.current[
              i
            ].current?.btnRefUpdateFeatureLandItem();
          // show error message
          if (validErrors) {
            resError = true;
            setActiveTab(i.toString());
            handleGenerateErrorMessage(validErrors, i + 1);
            break;
          }
          const dataForPush = {
            ...tabList[i],
            ...res,
            // override các trường trong bảng tóm tắt
            realAddressProvince: updatedSummaryTable[i].realAddressProvince,
            realAddressDistrict: updatedSummaryTable[i].realAddressDistrict,
            realAddressWard: updatedSummaryTable[i].realAddressWard,
            realAddressStreet: updatedSummaryTable[i].realAddressStreet,
            realAddressDetail: updatedSummaryTable[i].realAddressDetail,
            realAreaWidth: updatedSummaryTable[i].realAreaWidth,
            note: updatedSummaryTable[i].note,
            isConsolidation: isMergeLand,
            isConsolidationPurpose: isConsolidationPurpose,
            isViewManifest: isViewManifest,
          };

          // xóa các trường không cần thiết
          delete dataForPush?.districts;
          delete dataForPush?.wards;
          delete dataForPush?.isSelected;
          resArray.push(dataForPush);
        }

        if (isViewManifest) {
          if (!listAppendixAssets || listAppendixAssets.length === 0) {
            message.error("Vui lòng upload file xem bảng kê!");
            return;
          }
        }

        if (isMergeLand) {
          const res = await btnRefUpdateMergeLand.current?.updateMergeLand();
          updateMergeLandData = res;
          if (!updateMergeLandData) {
            message.error(`Vui lòng nhập đầy đủ thông tin hợp thửa`);
            resError = true;
          } else {
            updateMergeLandData = {
              ...updateMergeLandData,
              combineLandAddressDetail: null,
            };
          }
        } else {
          updateMergeLandData = {
            facadeLength: null,
            totalLength: null,
            combinePrivateArea: null,
            combineCommonArea: null,
            combineAreaWidth: null,
            combineAreaInPlan: null,
            combineAreaUnPlan: null,
            combineNote: null,
            combineAreaNotConsiderValue: null,
            combineLandAddressDetail:
              refInputAddressDetail.current?.resizableTextArea?.textArea
                ?.value || null,
          };
        }
        // stop update logic
        if (resError) {
          resArray = undefined;
        }

        let exportType = 0;
        if (!isExportSummary && isMergeLand) exportType = 1;
        if (isExportSummary && !isMergeLand) exportType = 2;

        return {
          assetLandInfos: resArray,
          mergeLandData: updateMergeLandData,
          exportType,
        };
      },
    }));

    const fetchDistrictsAndWards = async () => {
      await handleStartLoading();

      // lấy danh sách quận huyện và phường xã lần đầu load
      const districtCodes = assetLandInfos.map(
        (item) => item.realAddressProvince || ""
      );
      const wardCodes = assetLandInfos.map(
        (item) => item.realAddressDistrict || ""
      );

      const legalDistrictCodes = assetLandInfos.map(
        (item) => item.legalAddressProvince || ""
      );
      const legalWardCodes = assetLandInfos.map(
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

      const newData = assetLandInfos.map((item, index) => {
        return {
          ...item,
          districts: handleGetDistrictsInArray(item.realAddressProvince),
          wards: handleGetWardsInArray(item.realAddressDistrict),
          legalDistricts: handleGetLegalDistrictsInArray(
            item.legalAddressProvince
          ),
          legalWards: handleGetLegalWardsInArray(item.legalAddressDistrict),
        };
      });
      setTabList(
        newData.map((item) => ({
          ...item,
          isConsolidationPurpose: item.isConsolidationPurpose ? true : false,
          key: randomId(),
          id: randomId(),
        }))
      );

      await handleEndLoading();
    };

    useEffect(() => {
      if (assetLandInfos) {
        fetchDistrictsAndWards();
        setTabListForMerge(
          assetLandInfos.map((item) => ({
            ...item,
            id: randomId(),
          }))
        );

        let checkMergeLand = false;
        let checkConsolidationPurpose = false;
        let isViewManifest = false;
        for (let i = 0; i < assetLandInfos.length; i++) {
          if (!assetLandInfos[i].isConsolidation) checkMergeLand = false;
          if (!assetLandInfos[i].isConsolidationPurpose)
            checkConsolidationPurpose = false;
          if (!assetLandInfos[i].isViewManifest) isViewManifest = false;
          if (assetLandInfos[i].isConsolidation) checkMergeLand = true;
          if (assetLandInfos[i].isConsolidationPurpose)
            checkConsolidationPurpose = true;
          if (assetLandInfos[i].isViewManifest) isViewManifest = true;
        }

        if (checkMergeLand) setIsExportSummary(false);
        setIsMergeLand(checkMergeLand);
        setIsConsolidationPurpose(checkConsolidationPurpose);
        setIsViewManifest(isViewManifest);
      }
    }, [JSON.stringify(assetLandInfos)]);

    const btnRefUpdateFeatureLandItemList = useRef<any>([]);
    const btnRefUpdateFeatureLandSummaryTable = useRef<any>();
    const btnRefUpdateMergeLand = useRef<{ updateMergeLand: () => void }>(null);

    if (btnRefUpdateFeatureLandItemList.current.length !== tabList.length) {
      // add or remove refs
      btnRefUpdateFeatureLandItemList.current = Array(tabList.length)
        .fill(null)
        .map(
          (_, i) =>
            btnRefUpdateFeatureLandItemList.current[i] ||
            createRef<{ btnRefUpdateFeatureLandItem: () => void }>()
        );
    }

    const handleStartLoading = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 400));
    };
    const handleEndLoading = async () => {
      setLoading(false);
    };

    const updateListTab = useCallback(async () => {
      if (!isMergeLand) return;
      let resArray = [];
      for (let i = 0; i < btnRefUpdateFeatureLandItemList.current.length; i++) {
        const [res] = await btnRefUpdateFeatureLandItemList.current[
          i
        ].current?.btnRefUpdateFeatureLandItem();
        if (res) resArray.push(res);
        else return;
      }
      setTabListForMerge(resArray);
    }, []);
    const debouncedUpdateListTab = useCallback(
      debounce(updateListTab, 1000),
      []
    );

    const handleChangeActiveTab = async (key: string) => {
      setActiveTab(key);
    };

    const handleDeleteTab = async (index: number) => {
      await handleStartLoading();

      const resArray: any = [];
      const [updatedSummaryTable] = await handleGetDataSummaryTable();

      for (let i = 0; i < btnRefUpdateFeatureLandItemList.current.length; i++) {
        if (i === index) continue;
        const [res] = await btnRefUpdateFeatureLandItemList.current[
          i
        ].current?.btnRefUpdateFeatureLandItem();

        if (res) {
          const dataForPush = {
            ...tabList[i],
            ...res,
            // override các trường trong bảng tóm tắt
            realAddressProvince: updatedSummaryTable[i].realAddressProvince,
            realAddressDistrict: updatedSummaryTable[i].realAddressDistrict,
            realAddressWard: updatedSummaryTable[i].realAddressWard,
            realAddressStreet: updatedSummaryTable[i].realAddressStreet,
            realAddressDetail: updatedSummaryTable[i].realAddressDetail,
            realAreaWidth: updatedSummaryTable[i].realAreaWidth,
            note: updatedSummaryTable[i].note,
            isConsolidation: isMergeLand,
            isConsolidationPurpose: isConsolidationPurpose,
            isSelected: updatedSummaryTable[i].isSelected,
            id: updatedSummaryTable[i].id,
          };
          resArray.push(dataForPush);
        }
      }
      setTabList(resArray);
      setTabListForMerge(resArray);
      setActiveTab((index - 1).toString() || "0");

      await handleEndLoading();
    };

    const handleAddTab = async () => {
      await handleStartLoading();

      setTabList((prev) => [
        ...prev,
        {
          ...assetLandInfoInit,
          id: randomId(),
          key: randomId(),
        },
      ]);
      setLoading(false);

      await handleEndLoading();
    };

    const getDataCopyOfTab = useCallback(
      async (index: number) => {
        const [updatedSummaryTable] = await handleGetDataSummaryTable();
        const [res] = await btnRefUpdateFeatureLandItemList.current[
          index
        ].current?.btnRefUpdateFeatureLandItem();
        const summaryTableItem = updatedSummaryTable[index];

        const tabData = res || tabList[index];
        if (tabData) {
          const newItem = {
            ...tabData,
            // override các trường trong bảng tóm tắt
            realAddressProvince: summaryTableItem.realAddressProvince,
            realAddressDistrict: summaryTableItem.realAddressDistrict,
            realAddressWard: summaryTableItem.realAddressWard,
            realAddressStreet: summaryTableItem.realAddressStreet,
            realAddressDetail: summaryTableItem.realAddressDetail,
            realAreaWidth: summaryTableItem.realAreaWidth,
            note: summaryTableItem.note,
            isSelected: summaryTableItem.isSelected || false,
            id: summaryTableItem.id,

            isConsolidation: isMergeLand,
            isViewManifest: isViewManifest,
            isConsolidationPurpose: isConsolidationPurpose,
            key: randomId(),
            assetId: null,
            assetLandInforId: null,
            constructions:
              tabData.constructions?.map((construction: any) => ({
                ...construction,
                constructionId: null,
                assetLandInforId: null,
                dateCreate: null,
                dateModify: null,
                key: randomId(),
                id: randomId(),
              })) || [],
            assetTrees:
              tabData.assetTrees?.map((tree: any) => ({
                ...tree,
                treeId: null,
                assetLandInforId: null,
                key: randomId(),
                id: randomId(),
              })) || [],
            assetLandUsingPurposes:
              tabData.assetLandUsingPurposes
                ?.filter((el: any) => !el.isConsolidationPurposeParent)
                ?.map((purpose: any) => ({
                  ...purpose,
                  assetLandUsingPurposeId: null,
                  assetLandInforId: null,
                  key: randomId(),
                })) || [],
            constructionChecklists:
              tabData.constructionChecklists?.map((item: any) => ({
                ...item,
                contructionFutureInforId: null,
                assetLandInforId: null,
                key: randomId(),
              })) || [],
            constructionFutureInfors:
              tabData.constructionFutureInfors?.map((item: any) => ({
                ...item,
                contructionFutureInforId: null,
                assetLandInforId: null,
                key: randomId(),
              })) || [],
          };
          return newItem;
        }
      },
      [isMergeLand, isConsolidationPurpose, tabList]
    );

    const handleCopyRow = useCallback(
      async (index: number) => {
        await handleStartLoading();

        const newItem = await getDataCopyOfTab(index);

        setTabList((prev) => [...prev, newItem]);
        setTabListForMerge((prev) => [...prev, newItem]);

        await handleEndLoading();
      },
      [getDataCopyOfTab]
    );
    const handleCopyMultiRow = useCallback(
      async (index: number) => {
        await handleStartLoading();

        try {
          const newDataSource: AssetLandInfoType[] = [];
          const dataRow = await getDataCopyOfTab(index);

          const [updatedSummaryTable] = await handleGetDataSummaryTable();

          for (let i = 0; i < updatedSummaryTable.length; i++) {
            if (updatedSummaryTable[i].isSelected) {
              newDataSource[i] = dataRow;
            } else {
              newDataSource[i] = tabList[i];
            }
          }

          setTabList(newDataSource);
          setTabListForMerge(newDataSource);
        } catch (error) {
          console.error("Error copying row:", error);
        }
        await handleEndLoading();
      },
      [getDataCopyOfTab, tabList]
    );

    const handleGetDataSummaryTable = async () => {
      // lấy data trong bảng tóm tắt, validate status
      const [updatedSummaryTable, validateResult] =
        await btnRefUpdateFeatureLandSummaryTable.current?.updateSummaryTable();
      return [updatedSummaryTable, validateResult];
    };

    const handleUpdateSummaryTable = async (data: any) => {
      let resArray = [];
      for (let i = 0; i < btnRefUpdateFeatureLandItemList.current.length; i++) {
        const summaryDataRow = data[i];
        const [res] = await btnRefUpdateFeatureLandItemList.current[
          i
        ].current?.btnRefUpdateFeatureLandItem();
        const newData = {
          ...tabList[i],
          ...res,
          realAddressProvince: summaryDataRow.realAddressProvince,
          realAddressDistrict: summaryDataRow.realAddressDistrict,
          realAddressWard: summaryDataRow.realAddressWard,
          realAddressStreet: summaryDataRow.realAddressStreet,
          realAddressDetail: summaryDataRow.realAddressDetail,
          realAreaWidth: summaryDataRow.realAreaWidth,
          note: summaryDataRow.note,
          districts: summaryDataRow.districts,
          wards: summaryDataRow.wards,
          isSelected: summaryDataRow.isSelected || false,
          id: summaryDataRow.id,
        };
        if (newData) resArray.push(newData);
        else return;
      }

      setTabList(resArray);
    };

    const summaryTableData = useMemo(() => {
      return (
        tabList?.map((item: AssetLandInfoType) => {
          return {
            realAddressProvince: item?.realAddressProvince,
            realAddressDistrict: item?.realAddressDistrict,
            realAddressWard: item?.realAddressWard,
            realAddressStreet: item?.realAddressStreet,
            realAddressDetail: item?.realAddressDetail,
            realAreaWidth: item?.realAreaWidth,
            note: item?.note,
            districts: item.districts || [],
            wards: item.wards || [],
            isSelected: item.isSelected || false,
            id: item.id,
            key: item.key,
          };
        }) || []
      );
    }, [JSON.stringify(tabList)]);

    const getContructionsName = async () => {
      if (tabList.length > 0) {
        // get ids of each construction type
        let ids = tabList
          .map(
            (item) =>
              item.constructions
                ?.map((el) => el.constructionTypeId)
                .filter((item) => item !== null)
                .flat() || []
          )
          .flat();
        const idsArr = [...new Set(ids)];

        // check ids is in constructionOptions
        const isExist = idsArr.every((item) =>
          constructionOptions?.some((el) => el[item!] !== undefined)
        );
        if (isExist) return;

        // call api...
        const responses = await Promise.all(
          idsArr.map(async (item: number | null) => {
            if (item === null) return null;
            try {
              const response = await contructionApi.getContructionName(item);
              return {
                [item]:
                  response?.data?.map((item: ContructionNameType) => {
                    return {
                      label: item.constructionName,
                      value: item.constructionNameId,
                    };
                  }) || [],
              };
            } catch {
              message.error("Lỗi khi lấy dữ liệu");
              return {
                [item]: [],
              };
            }
          })
        );
        // store to redux state
        const tmpArr = responses.filter(
          (item) => item !== null
        ) as ConstructionOptions[];
        dispatch(setConstructionOptions(tmpArr));
      }
    };
    useEffect(() => {
      getContructionsName();
      if (tabList.length === 1) {
        setIsMergeLand(false);
      }
    }, [tabList]);

    return (
      <Fragment>
        <Spin spinning={loading}>
          <Row gutter={[24, 8]} style={{ marginBottom: "8px" }}>
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
            {!isMergeLand && tabList.length > 1 && (
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
                    defaultValue={mergeLandData.combineLandAddressDetail || ""}
                    placeholder={"Hệ thống tự nhập"}
                    allowClear={false}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
          <FeatureLandSummaryTable
            ref={btnRefUpdateFeatureLandSummaryTable}
            data={summaryTableData as any}
            onChangeActiveTab={handleChangeActiveTab}
            onAddTab={handleAddTab}
            onDeleteTab={handleDeleteTab}
            onCopyMultiRow={handleCopyMultiRow}
            onUpdateData={handleUpdateSummaryTable}
          />
          <Space
            size="middle"
            style={{ marginBottom: "8px", marginTop: "12px" }}
          >
            <Checkbox
              onChange={(e) => {
                const checked = e.target.checked;
                if (isMergeLand && checked) {
                  setIsExportSummary(checked);
                  setIsMergeLand(false);
                }
                setIsExportSummary(checked);
              }}
              checked={isExportSummary}
            >
              Xuất thông tin tóm tắt vào BBKS
            </Checkbox>
          </Space>
          <Tabs
            className="feature-land-tab-custom"
            items={[...tabList].map((item: AssetLandInfoType, index) => {
              let btn = (
                <Button
                  type="primary"
                  style={{ borderRadius: "50%" }}
                  danger
                  onClick={() => {
                    handleDeleteTab(index);
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
                    <span>Thửa đất {index + 1}</span>
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
                    <Space direction="vertical" style={{ marginBottom: "8px" }}>
                      <Space size="large" align="baseline">
                        <Space size="middle">
                          <Typography
                            style={{ opacity: "0.6", minWidth: "120px" }}
                          >
                            Hợp thửa:{" "}
                          </Typography>
                          <Radio.Group
                            onChange={(e) => {
                              const checked = e.target.value;
                              setIsMergeLand(checked);
                              if (checked) setIsConsolidationPurpose(false);
                              debouncedUpdateListTab();

                              if (checked && isExportSummary)
                                setIsExportSummary(false);
                            }}
                            value={isMergeLand}
                            disabled={tabList.length <= 1}
                          >
                            <Radio value={true}>Có</Radio>
                            <Radio value={false}>Không</Radio>
                          </Radio.Group>
                        </Space>
                        <Checkbox
                          onChange={(e) => {
                            const checked = e.target.checked;

                            setIsViewManifest(checked);

                            if (!checked) {
                              setIsViewManifestModal({
                                ...isViewManifestModal,
                                isOpenModal: false,
                                formType: "add",
                              });
                              dispatch(setListAppendixAssets([]));
                            }
                          }}
                          checked={isViewManifest}
                        >
                          Xem bảng kê
                        </Checkbox>
                        {isViewManifest ? (
                          !listAppendixAssets ||
                          listAppendixAssets.length === 0 ? (
                            <Button
                              size="small"
                              type="default"
                              onClick={() => {
                                setIsViewManifestModal({
                                  ...isViewManifestModal,
                                  isOpenModal: true,
                                  formType: "add",
                                });
                              }}
                            >
                              Upload file xem bảng kê
                            </Button>
                          ) : (
                            <Space>
                              <Button
                                size="small"
                                type="text"
                                onClick={() => {
                                  setIsViewManifestModal({
                                    ...isViewManifestModal,
                                    isOpenModal: true,
                                    formType: "edit",
                                  });
                                }}
                              >
                                {listAppendixAssets[0].filename}
                              </Button>
                              <Button
                                size="small"
                                type="text"
                                icon={<icons.download />}
                                onClick={async () => {
                                  const ecmId = listAppendixAssets[0].ecmId;
                                  if (ecmId) {
                                    const res =
                                      await ecmFileApi.downloadECMFile(
                                        "appendix",
                                        ecmId
                                      );
                                    saveAs(
                                      res.data,
                                      listAppendixAssets[0].filename ||
                                        "manifest.pdf"
                                    );
                                  }
                                }}
                              />
                            </Space>
                          )
                        ) : null}
                      </Space>

                      <Space size="middle">
                        <Typography
                          style={{ opacity: "0.6", minWidth: "120px" }}
                        >
                          Mục đích hỗn hợp:{" "}
                        </Typography>
                        <Radio.Group
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value && isMergeLand) {
                              setIsMergeLand(false);
                            }
                            setIsConsolidationPurpose(value);
                            // form.setValues({
                            //   ...form.values,
                            //   isConsolidationPurpose: value,
                            // });
                          }}
                          disabled={
                            // item.assetLandUsingPurposes?.length <= 1 ||
                            isMergeLand
                          }
                          value={isConsolidationPurpose}
                        >
                          <Radio value={true}>Có</Radio>
                          <Radio value={false}>Không</Radio>
                        </Radio.Group>
                      </Space>
                    </Space>

                    <FeatureLandItemTab
                      ref={btnRefUpdateFeatureLandItemList.current[index]}
                      index={index}
                      data={item}
                      updateListTab={debouncedUpdateListTab}
                      isMergeLand={isMergeLand}
                      setIsMergeLand={setIsMergeLand}
                    />
                  </>
                ),
              };
            })}
            activeKey={activeTab}
            onChange={(key) => handleChangeActiveTab(key)}
          />
          {
            <CollapseCustom
              style={!isMergeLand ? { visibility: "hidden", height: 0 } : {}}
              isInner
              itemList={[
                {
                  label: "Thông tin hợp thửa",
                  children: (
                    <Consolidation
                      ref={btnRefUpdateMergeLand}
                      assetLandInfors={tabListForMerge}
                      mergeLandData={mergeLandData}
                    />
                  ),
                },
              ]}
            />
          }
        </Spin>
        <ManifestModal
          // assetId={""}
          onChange={() => {}}
          isOpen={isViewManifestModal.isOpenModal}
          modalType={isViewManifestModal.formType}
          onClose={() =>
            setIsViewManifestModal({
              ...isViewManifestModal,
              isOpenModal: false,
            })
          }
          record={listAppendixAssets[0]}
        />
      </Fragment>
    );
  }
);

export default memo(FeatureLand, (prevProps, nextProps) => {
  return (
    isDeepEqual(prevProps.assetLandInfos, nextProps.assetLandInfos) &&
    isDeepEqual(prevProps.mergeLandData, nextProps.mergeLandData)
  );
});
