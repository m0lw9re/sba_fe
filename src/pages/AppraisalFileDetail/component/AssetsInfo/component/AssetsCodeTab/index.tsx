import { Tabs, message } from "antd";
import { appraisalFilesApi } from "apis/appraisalFiles";
import { AppraisalFileAssetDetailType } from "constant/types/appraisalFile";
import { usePrevious } from "hooks/usePrevious";
import AssetsCodeTabPanel from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel";
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
import { useParams } from "react-router-dom";
import { isDeepEqual } from "utils";
import "./style.scss";
import { ASSET_LV2 } from "constant/enums";
import { setListAppendixAssets } from "pages/AppraisalFileDetail/store/appraisalFileDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "configs/configureStore";

type Props = {
  assetCommons: Array<{
    assetCode: string;
    parentAssetCode?: string | null;
    assetLevelThreeId: number | null;
  }>;
  assetLevelTwoId: number;
};

type RefProps = {
  getAssetCodeTab: () => void;
  updateAssetCodeTab: () => void;
};

const AssetsCodeTab = forwardRef<RefProps, Props>(
  ({ assetCommons, assetLevelTwoId }, ref) => {
    const dispatch = useDispatch();
    const { listAppendixAssets } = useSelector(
      (state: RootState) => state.appraisalFileDetailSlice
    );
    const { id } = useParams<{ id: string }>();
    const prevProps = usePrevious(assetCommons);

    const [assetsDetail, setAssetsDetail] = useState<
      Array<AppraisalFileAssetDetailType>
    >([]);

    const btnRefUpdateAssetCodeTabPanelList = useRef<any>([]);

    useImperativeHandle(ref, () => ({
      getAssetCodeTab: handleGetAssetCodeTab,
      updateAssetCodeTab: handleUpdateAssetCodeTab,
    }));

    const assetCodeTabRender = useMemo(() => {
      return assetsDetail.map(
        (item: AppraisalFileAssetDetailType, index: number) => ({
          key: item.assetCode,
          label: item.parentAssetCode || item.assetCode,
          forceRender: true,
          children: (
            <AssetsCodeTabPanel
              ref={btnRefUpdateAssetCodeTabPanelList.current[index]}
              index={index}
              assetDetail={{ ...item, assetLevelTwoId: assetLevelTwoId }}
            />
          ),
        })
      );
    }, [assetsDetail]);

    const getAllAssetsDetail = useCallback(async () => {
      try {
        //new
        const res = await appraisalFilesApi.getAllAssetsDetail(
          assetLevelTwoId,
          assetCommons
        );
        setAssetsDetail(res.data);
        if (
          assetLevelTwoId === ASSET_LV2.LAND ||
          assetLevelTwoId === ASSET_LV2.ESTIMATE
        ) {
          const listAppendixAssets = res.data[0]?.listAppendixAssets || [];
          dispatch(setListAppendixAssets(listAppendixAssets));
        }
      } catch (error) {
        console.log(error);
      }
    }, [assetCommons, assetLevelTwoId]);

    const handleCheckIsUsingPurposeSelected = (assetLandInfors: any[]) => {
      let isUsingPurposeSelected = true;
      assetLandInfors?.forEach((item: any) => {
        if (item.assetLandUsingPurposes.length === 0) {
          isUsingPurposeSelected = false;
          return;
        }
        item.assetLandUsingPurposes?.forEach((item2: any) => {
          if (!item2.usingPurposeId) {
            isUsingPurposeSelected = false;
            return;
          }
        });
      });
      return isUsingPurposeSelected;
    };

    const handleCheckLegalInformationsHaveData = (legalInformations: any[]) => {
      let isLegalInformationsHaveData = true;
      if (legalInformations?.length === 0 || !legalInformations) return false;

      legalInformations?.forEach((item: any) => {
        // check legalInformations have at least one field has data for every asset
        if (
          !item.legalInformationTypeId &&
          !item.legalInformationNumber &&
          !item.issueUnit &&
          !item.issueDate &&
          !item.owner &&
          !item.details &&
          !item.investor
        ) {
          isLegalInformationsHaveData = false;
          return;
        }
      });
      return isLegalInformationsHaveData;
    };

    const handleUpdateAssetCodeTab = async () => {
      try {
        let assetArray = [];
        let assetsObjError: boolean = false;
        let isUsingPurposeSelected = true;
        let isLegalInformationsHaveData = true;
        for (
          let i = 0;
          i < btnRefUpdateAssetCodeTabPanelList.current.length;
          i++
        ) {
          const assetsObj = await btnRefUpdateAssetCodeTabPanelList.current[
            i
          ].current?.updateAssetCodeTabPanel();
          // check validate feature land

          if (!assetsObj) {
            assetsObjError = true;
            break;
          }

          // check validate using purpose
          if (
            !handleCheckIsUsingPurposeSelected(
              assetsObj?.assetObject?.assetLandInfors
            )
          ) {
            isUsingPurposeSelected = false;
            break;
          }

          // check validate legal informations
          if (
            !handleCheckLegalInformationsHaveData(
              assetsObj?.assetObject?.legalInformations
            )
          ) {
            isLegalInformationsHaveData = false;
            break;
          }
          if (assetsObj) assetArray.push(assetsObj);
        }
        if (assetsObjError) return;
        if (!isUsingPurposeSelected) {
          message.error("Vui lòng thêm mục đích sử dụng cho tài sản.");
          return;
        }

        if (!isLegalInformationsHaveData) {
          message.error(
            "Vui lòng kiểm tra thông tin pháp lý hoặc những hàng không có dữ liệu."
          );
          return;
        }

        const updatedAssetArray = assetArray.map((asset) => ({
          ...asset,
          assetObject: {
            ...asset.assetObject,
            type: asset.assetLevelThreeId,
          },
          listAppendixAssets: [...listAppendixAssets],
        }));

        const res = await appraisalFilesApi.updateAssetsEntire(
          assetLevelTwoId,
          id!,
          updatedAssetArray
        );

        if (res.data?.body?.code === 200 || res.data?.code === 200) {
          message.success("Cập nhật thông tin tài sản thành công");
          //get new data after update
          await getAllAssetsDetail();
          return assetArray;
        } else {
          message.error(res.data?.body?.message || res.data?.message);
        }
      } catch (error: any) {
        console.log(error);
        if (error.message) message.error(error.message);
        else
          message.error(
            "Cập nhật thông tin tài sản không thành công. Kiểm tra lại các tham số nhập"
          );
      }
    };

    const handleGetAssetCodeTab = async () => {
      let assetArray = [];
      let assetsObjError: boolean = false;
      for (
        let i = 0;
        i < btnRefUpdateAssetCodeTabPanelList.current.length;
        i++
      ) {
        const assetsObj = await btnRefUpdateAssetCodeTabPanelList.current[
          i
        ].current?.updateAssetCodeTabPanel();

        if (!assetsObj) {
          assetsObjError = true;
          break;
        }
        if (assetsObj) assetArray.push(assetsObj);
      }
      if (assetsObjError) return;
      return assetArray;
    };

    useEffect(() => {
      if (!isDeepEqual(prevProps, assetCommons)) getAllAssetsDetail();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prevProps, assetCommons, assetLevelTwoId]);

    if (
      btnRefUpdateAssetCodeTabPanelList.current.length !== assetCommons?.length
    ) {
      // add or remove refs
      btnRefUpdateAssetCodeTabPanelList.current = Array(assetCommons?.length)
        .fill(null)
        .map(
          (_, i) =>
            btnRefUpdateAssetCodeTabPanelList.current[i] ||
            createRef<{ btnRefUpdateAssetCodeTabPanel: () => void }>()
        );
    }

    return (
      <>
        <Tabs className="assets-code-tab-custom" items={assetCodeTabRender} />
      </>
    );
  }
);

export default memo(AssetsCodeTab);
