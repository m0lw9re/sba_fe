import "./style.scss";
import {
  Button,
  Checkbox,
  Radio,
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
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { randomId } from "utils/string";
import { AssetProjectInfoType } from "constant/types/appraisalFile";
import { addressApi } from "apis/adress";
import { isDeepEqual } from "utils";
import { debounce, isEqual } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
import {
  ConstructionOptions,
  setConstructionOptions,
} from "pages/AppraisalFileDetail/store/appraisalFileDetailSlice";
import { contructionApi } from "apis/contruction";
import { ContructionNameType } from "constant/types";
import FeatureProjectSummaryTable from "./component/FeatureProjectSummaryTable/FeatureProjectSummaryTable";
import FeatureProjectItemTab from "./component/FeatureProjectItemTab";

type Props = {
  assetProjectInfor: AssetProjectInfoType;
  isShowAppendixDetail: boolean | null;
};

type RefProps = {
  updateFeatureProject: () => void;
};

const keyLabel: {
  [key: string]: string;
} = {
  assetLandUsingPurposes: "Mục đích sử dụng đất",
  constructions: "Công trình xây dựng",
  assetTrees: "Cây trồng trên đất",
  totalFloorArea: "CTXD hình thành trong tương lai",
  describes: "Mô tả chi tiết",
};

const delay = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

const handleGenerateErrorMessage = (error: any) => {
  const keys: string[] = Object.keys(error);
  if (keys.length > 0) {
    let messageValue = "";
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const label = keyLabel[key];
      if (label) {
        messageValue += `Vui lòng kiểm tra thông tin ${label}`;
      }
    }
    message.error(messageValue);
    return messageValue;
  } else {
    return null;
  }
};

const FeatureProject = forwardRef<RefProps, Props>(
  ({ assetProjectInfor, isShowAppendixDetail }, ref) => {
    const dispatch = useDispatch();
    const { constructionOptions } = useSelector(
      (state: RootState) => state.appraisalFileDetailSlice
    );

    const [projectDataObj, setProjectDataObj] = useState<AssetProjectInfoType>(
      assetProjectInfor || {}
    );
    const [areaWidth, setAreaWidth] = useState<number | null>(null);

    const [isExportSummary, setIsExportSummary] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
      updateFeatureProject: async () => {
        const [updatedSummaryTable, validateResult] =
          await handleGetDataSummaryTable();

        if (!validateResult || !updatedSummaryTable) {
          message.error(`Vui lòng nhập đầy đủ bảng tóm tắt đặc điểm thửa đất`);
          return;
        }

        const [projectItemDataRef, projectItemDataErrors] =
          await btnRefUpdateFeatureProjectItem.current.updateFeatureProjectItem();
        if (projectItemDataErrors) {
          handleGenerateErrorMessage(projectItemDataErrors);
          return;
        }

        const dataForPush = {
          ...projectItemDataRef,
          provinceCode: updatedSummaryTable?.provinceCode,
          districtCode: updatedSummaryTable?.districtCode,
          wardCode: updatedSummaryTable?.wardCode,
          appraisalLocation: updatedSummaryTable?.appraisalLocation,
          areaWidth: updatedSummaryTable?.areaWidth,
          currentAsset: updatedSummaryTable?.currentAsset,
          description: updatedSummaryTable?.description,
        };

        delete dataForPush?.districts;
        delete dataForPush?.wards;
        delete dataForPush?.isShowAppendixDetail;

        let exportType = 0;
        // if (isExportSummary) exportType = 0;

        return {
          assetProjectInfor: dataForPush,
          exportType,
          isShowAppendixDetail:
            projectItemDataRef?.isShowAppendixDetail || false,
        };
      },
    }));

    const fetchDistrictsAndWards = async () => {
      await handleStartLoading();

      // lấy danh sách quận huyện và phường xã lần đầu load
      const districtCode = assetProjectInfor.provinceCode || "";
      const wardCode = assetProjectInfor.districtCode || "";

      const districtsPromises = async () => {
        if (!districtCode) return;
        const districts = await addressApi.getDistricts({
          code: districtCode,
        });
        return {
          districts: districts.data?.map((item: any) => ({
            value: item.code,
            label: item.fullName,
          })),
        };
      };

      const districtData = await districtsPromises();

      const wardsPromises = async () => {
        if (!wardCode) return;
        const wards = await addressApi.getWards({
          code: wardCode,
        });
        return {
          wards: wards.data?.map((item: any) => ({
            value: item.code,
            label: item.fullName,
          })),
        };
      };

      const wardData = await wardsPromises();

      const newData = {
        ...assetProjectInfor,
        districts: districtData?.districts,
        wards: wardData?.wards,
      };
      setAreaWidth(newData?.areaWidth);

      setProjectDataObj(newData);

      await handleEndLoading();
    };
    const handleChangeAreaWidth = (value: number | null) => {
      setAreaWidth(value);
    };

    // const btnRefUpdateFeatureProjectItem = useRef<any>([]);
    const btnRefUpdateFeatureProjectSummaryTable = useRef<any>();
    const btnRefUpdateFeatureProjectItem = useRef<any>([]);

    const handleStartLoading = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 400));
    };
    const handleEndLoading = async () => {
      setLoading(false);
    };

    const handleGetDataSummaryTable = async () => {
      // lấy data trong bảng tóm tắt, validate status
      const [updatedSummaryTable, validateResult] =
        await btnRefUpdateFeatureProjectSummaryTable.current?.updateSummaryTable();

      return [updatedSummaryTable, validateResult];
    };

    const updateListTab = useCallback(async () => {
      const [projectItemDataRef, projectItemDataErrors] =
        await btnRefUpdateFeatureProjectItem.current.updateFeatureProjectItem();
    }, []);
    const debouncedUpdateListTab = useCallback(
      debounce(updateListTab, 1000),
      []
    );

    useEffect(() => {
      if (assetProjectInfor) {
        fetchDistrictsAndWards();
      }
    }, [assetProjectInfor]);

    const summaryTableData = useMemo(() => {
      return {
        provinceCode: projectDataObj?.provinceCode,
        districtCode: projectDataObj?.districtCode,
        wardCode: projectDataObj?.wardCode,
        appraisalLocation: projectDataObj?.appraisalLocation,
        areaWidth: projectDataObj?.areaWidth,
        currentAsset: projectDataObj?.currentAsset,
        description: projectDataObj?.description,
        districts: projectDataObj.districts || [],
        wards: projectDataObj.wards || [],
      };
    }, [JSON.stringify(projectDataObj)]);

    const getContructionsName = async () => {
      if (projectDataObj) {
        // get ids of each construction type
        let ids =
          projectDataObj.constructions
            ?.map((el) => el.constructionTypeId)
            .filter((item) => item !== null)
            .flat() || [];

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
    }, [JSON.stringify(projectDataObj)]);

    return (
      <Spin spinning={loading}>
        <FeatureProjectSummaryTable
          ref={btnRefUpdateFeatureProjectSummaryTable}
          data={summaryTableData as any}
          onChangeAreaWidth={handleChangeAreaWidth}
          // onUpdateData={handleUpdateSummaryTable}
        />
        <Space size="middle" style={{ marginBottom: "8px", marginTop: "12px" }}>
          <Checkbox
            onChange={(e) => {
              const checked = e.target.checked;
              if (checked) {
                setIsExportSummary(checked);
              }
              setIsExportSummary(checked);
            }}
            checked={isExportSummary}
          >
            Xuất thông tin tóm tắt vào BBKS
          </Checkbox>
        </Space>
        <>
          <FeatureProjectItemTab
            ref={btnRefUpdateFeatureProjectItem}
            data={projectDataObj}
            updateListTab={debouncedUpdateListTab}
            areaWidth={areaWidth}
            isShowAppendixDetail={isShowAppendixDetail}
          />
        </>
      </Spin>
    );
  }
);

export default memo(FeatureProject, (prevProps, nextProps) => {
  return isDeepEqual(prevProps.assetProjectInfor, nextProps.assetProjectInfor);
});
