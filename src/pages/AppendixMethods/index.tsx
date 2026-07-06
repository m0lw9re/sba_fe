import {
  Button,
  Modal,
  Result,
  Row,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import { appraisalFilesApi } from "apis/appraisalFiles";
import { CollapseCustom } from "components/CollapseCustom";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { APPRAISAL_FILES, APPRAISAL_FILE_DETAIL } from "routes/route.constant";
import { randomId } from "utils";
import { useAssetLevelThreeAll, useAssetsValuationDetail } from "utils/request";
import "./style.scss";

import { ASSET_PRICES_SHARED_TYPE, BUTTON_CODES } from "constant/common";

import Comment from "./component/Commant";
import CtxdInfo from "./component/CtxdInfo/CtxdInfo";
import UploadAppendixFile from "./component/UploadAppendixFile";

import PricingLand from "pages/AppendixMethods/component/Land/PricingLand";
import PricingLandNotConsiderValue from "pages/AppendixMethods/component/Land/PricingLandNotConsiderValue";
import GrowthTable from "pages/AppendixMethods/component/Land/RentalCashFlow/GrowthTable";
import RentalCashFlow from "pages/AppendixMethods/component/Land/RentalCashFlow/RentalCashFlow";
import TableAdjustInfoLand from "pages/AppendixMethods/component/Land/TableAdjustInfoLand";
import TableAssetInfoLand from "pages/AppendixMethods/component/Land/TableAssetInfoLand";

import PricingApartment from "pages/AppendixMethods/component/Apartment/PricingApartment";
import TableAdjustInfoApartment from "pages/AppendixMethods/component/Apartment/TableAdjustInfoApartment";
import TableAssetInfoApartment from "pages/AppendixMethods/component/Apartment/TableAssetInfoApartment";

import TableAdjustInfoMachine from "pages/AppendixMethods/component/Machine/TableAdjustInfoMachine";
import TableAssetInfoMachine from "pages/AppendixMethods/component/Machine/TableAssetInfoMachine";

import { ASSET_LV2 } from "constant/enums";
import { AssetLanUsingPurposeType } from "constant/types/appraisalFile";
import useAppraisalFileFunction from "hooks/useAppraisalFileFunction";
import { isEqual, isNumber, sortBy } from "lodash";
import PricingMachine from "pages/AppendixMethods/component/Machine/PricingMachine";
import PricingRoadVehicle from "pages/AppendixMethods/component/RoadVehicle/PricingRoadVehicle";
import TableAdjustInforRoadVehicle from "pages/AppendixMethods/component/RoadVehicle/TableAdjustInforRoadVehicle";
import TableAssetInfoRoadVehicle from "pages/AppendixMethods/component/RoadVehicle/TableAssetInfoRoadVehicle";
import ComponentsError from "pages/ComponentsError";
import { Link } from "react-router-dom";
import { isAssetMovableEstate } from "utils/asset";
import QssdValue from "./component/QssdValue";
import PricingWaterVehicle from "./component/WaterVehicle/PricingWaterVehicle";
import TableAdjustInforWaterVehicle from "./component/WaterVehicle/TableAdjustInforWaterVehicle";
import TableAssetInfoWaterVehicle from "./component/WaterVehicle/TableAssetInfoWaterVehicle";
import { RootState } from "configs/configureStore";
import { isNotAllowed } from "utils/permission";

const CreatePriceShared = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!location?.state?.appraisalFileId) {
    navigate(APPRAISAL_FILES);
  }

  const { data, isLoading, error, mutate } = useAssetsValuationDetail({
    ...location.state,
  });
  // MMTB -> assetNote, other asset -> note
  const savedNote = data?.prices?.note || data?.prices?.assetNote;
  // const {
  //   data: appraisalFileDetail,
  // }: {
  //   data: AppraisalFileType;
  // } = useAppraisalFileDetail(location?.state?.appraisalFileId || "");
  const startProcessReportDate = location.state?.startProcessReportDate;
  const assetLevelTwoId = location.state?.assetLevelTwoId;
  const assetGrandChildId = location.state?.assetGrandChildId || 0;
  const { currentPagePermissions } = useSelector(
    (state: RootState) => state.globalSlice
  );
  const isHaveRealAreaUnPlan = Boolean(data?.assetLandInfor?.realAreaUnPlan);
  const notUpdateAble =
    useAppraisalFileFunction({
      appraisalId: location.state?.appraisalFileId,
    }).isUserCanNotUpdate() ||
    isNotAllowed(currentPagePermissions, BUTTON_CODES.pl_luu);
  const { data: assetLevelThrees } = useAssetLevelThreeAll();

  const [constructions, setConstructions] = useState<any[]>([]);
  const [tableKQDat, setTableKQDat] = useState<any[]>([]);
  const [adjustTable, setAdjustTable] = useState<any[]>([]);
  const [storedAssets, setStoredAssets] = useState<any[]>([]);
  const [exportToReport, setExportToReport] = useState<boolean>(true);
  const [assetLandRentFlowDto, setAssetLandRentFlowDto] = useState<any>({});
  const [validModal, setValidModal] = useState<boolean>(false);

  const [isBtnLoading, setIsBtnLoading] = useState<boolean>(false);

  const btnRefPricing = useRef<{ updatePricing: () => void }>(null);
  const btnRefNote = useRef<{ updateNote: () => void }>(null);
  const btnRefUpload = useRef<{
    uploadFile: () => void;
  }>(null);
  const btnRefQssdValue = useRef<{ updateQssdValue: () => void }>(null);

  const btnRefAssetLandRentFlowDto = useRef<{
    updateData: () => [any, boolean];
  }>(null);

  useEffect(() => {
    const shouldReload = localStorage.getItem("RELOAD");

    if (shouldReload) {
      localStorage.setItem("RELOAD", "");
      window.location.reload();
    }
  }, []);

  const handleGetAddressInfo = (data: any) => {
    if (!data?.assetDto || !data?.storedAssets) return data.storedAssets || [];
    const assetLevelThreeName = assetLevelThrees?.find(
      (el: any) => el.assetLevelThreeId == location?.state?.assetLevelThreeId
    )?.assetLevelThreeName;

    return data.storedAssets.map((item: any, index: number) => {
      if (index === 0) {
        return {
          ...item,
          addressDetail: data.assetDto.addressDetail,
          addressDistrictName: data.assetDto.addressDistrictName,
          addressProvinceName: data.assetDto.addressProvinceName,
          addressWardName: data.assetDto.addressWardName,
          assetLevelThreeName: assetLevelThreeName || "-",
        };
      }
      return item;
    });
  };
  const handleGetShipTypeName = (data: any) => {
    if (!data?.storedAssets) return data.storedAssets || [];

    return data.storedAssets.map((item: any, index: number) => {
      return {
        ...item,
        assetLevelThreeName:
          assetLevelThrees?.find(
            (el: any) => el.assetLevelThreeId == item.shipType
          )?.assetLevelThreeName || "-",
      };
    });
  };
  useEffect(() => {
    if (data?.constructions) {
      const constructionsTemp = data?.constructions.map((item: any) => ({
        ...item,
        key: randomId(),
      }));
      setConstructions(constructionsTemp || []);
    }
    if (data?.adjustTable) {
      setAdjustTable(
        data?.adjustTable.sort((a: any, b: any) => {
          const _a = a.orderBy || 0;
          const _b = b.orderBy || 0;
          return _a - _b;
        })
      );
    }
    if (data?.storedAssets) {
      let storedAssets = data?.storedAssets;
      if (assetLevelTwoId === ASSET_LV2.MACHINE) {
        storedAssets = handleGetAddressInfo(data);
      } else if (assetLevelTwoId === ASSET_LV2.WATER_VEHICLE) {
        storedAssets = handleGetShipTypeName(data);
      }

      setStoredAssets(
        storedAssets.sort((a: any, b: any) => {
          const _a = a.orderBy || 0;
          const _b = b.orderBy || 0;
          return _a - _b;
        })
      );
    }
    if (data?.assetLandRentFlowDto) {
      setAssetLandRentFlowDto(data?.assetLandRentFlowDto);
    }
    if (data?.assetLandInfor || data?.assetApartmentInfor) handleCheckIsValid();
    setExportToReport(
      data?.prices?.isExportToReport
        ? true
        : data?.prices?.isExportToReport === null
    );
    if (data?.tableKQDat) {
      setTableKQDat(
        data?.tableKQDat
          .map((item: any) => ({ ...item, key: randomId() }))
          .sort((a: any, b: any) => {
            const _a = a.valuationResultLandEstateId || 0;
            const _b = b.valuationResultLandEstateId || 0;
            return _a - _b;
          })
      );
    }
  }, [data]);

  const handleUpdatePriceCTXD = (key: string, value: number) => {
    const tmp: any[] = [...constructions];
    const foundIndex = tmp.findIndex((el: any) => el.key === key);

    if (foundIndex !== -1) {
      console.log(tmp[foundIndex]);
      if (
        location.state?.fileStatus > 14 &&
        location.state?.fileStatus !== 17
      ) {
        tmp[foundIndex].unitPriceApprovaled = value;
        if (
          isNumber(tmp[foundIndex]?.remainingQualityApprovaled) &&
          isNumber(tmp[foundIndex]?.mdhtApprovaled)
        ) {
          tmp[foundIndex].totalValueApprovaled = Math.round(
            value * (tmp[foundIndex]?.constructionAreaApprovaled || 0)
          );
        } else if (
          isNumber(tmp[foundIndex]?.remainingQualityApprovaled) &&
          !isNumber(tmp[foundIndex]?.mdhtApprovaled)
        ) {
          tmp[foundIndex].totalValueApprovaled = Math.round(
            (value *
              (tmp[foundIndex]?.constructionAreaApprovaled || 0) *
              (tmp[foundIndex]?.remainingQualityApprovaled || 0)) /
              100
          );
        }
      } else {
        tmp[foundIndex].unitPrice = value;
      }
      if (
        isNumber(tmp[foundIndex]?.remainingQuality) &&
        isNumber(tmp[foundIndex]?.mdht)
      ) {
        tmp[foundIndex].totalValue = Math.round(
          value * (tmp[foundIndex]?.constructionArea || 0)
        );
      } else if (
        isNumber(tmp[foundIndex]?.remainingQuality) &&
        !isNumber(tmp[foundIndex]?.mdht)
      ) {
        tmp[foundIndex].totalValue = Math.round(
          (value *
            (tmp[foundIndex]?.constructionArea || 0) *
            (tmp[foundIndex]?.remainingQuality || 0)) /
            100
        );
      }
    }

    setConstructions(tmp);
  };

  const handleUpdateAdjustTable = (data: any[]) => {
    setAdjustTable(data);
  };

  const handleUpdateStoredAssets = (data: any[]) => {
    setStoredAssets(data);
  };
  const handleChangeExportToReport = (data: boolean) => {
    setExportToReport(data);
  };

  const handleSaveInBackground = async (dataChanged: any) => {
    try {
      if (notUpdateAble) return;

      const priceData: any = await btnRefPricing.current?.updatePricing();

      const noteData: any = btnRefNote.current?.updateNote();
      const btnUploadFile: any = await btnRefUpload.current?.uploadFile();
      let assetLandRentFlowDtoData = {};
      if (btnRefAssetLandRentFlowDto.current) {
        const [assetLandRentFlowDto, isValid]: [any, boolean] =
          await btnRefAssetLandRentFlowDto.current.updateData();
        assetLandRentFlowDtoData = assetLandRentFlowDto;
        if (!isValid) {
          setIsBtnLoading(false);
          return;
        }
      }

      let _price = {
        ...(priceData ? { ...priceData } : {}),
        ...(noteData ? { ...noteData } : {}),
      };
      if (assetLevelTwoId === ASSET_LV2.MACHINE) {
        delete _price.note;
        _price = {
          ..._price,
          ...(noteData
            ? {
                assetNote: noteData.note,
              }
            : {}),
        };
      }

      const dataUpdate = {
        ...data,
        storedAssets: storedAssets.map((el, index) => ({
          ...el,
          orderBy: index,
          distanceToAsset:
            distanceToAssets.find((item) => item.assetsId === el.assetId)
              ?.distance || null,
        })),
        constructions,
        adjustTable: adjustTable.map((el, index) => ({
          ...el,
          orderBy: index,
        })),
        appendices: btnUploadFile,
        assetLandRentFlowDto:
          Object.keys(assetLandRentFlowDtoData).length > 0
            ? assetLandRentFlowDtoData
            : data.assetLandRentFlowDto,
        prices: {
          ...data.prices,
          ..._price,
          isExportToReport: exportToReport,
        },
        ...dataChanged,
      };

      const res = await appraisalFilesApi.updateAssetsValuationDetail(
        {
          appraisalFileId: location.state?.appraisalFileId,
          assetLevelTwoId: assetLevelTwoId,
          valuationMethodDetailId: location.state?.valuationMethodDetailId,
          valuationMethodId: location.state?.valuationMethodId,
        },
        dataUpdate
      );

      if (res?.data?.code === 200) {
        // mutate();
      } else {
        throw new Error("sss");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra, Vui lòng thử lại.");
    }
  };

  const { distanceToAssets } = useSelector(
    (state: RootState) => state.appendixMethodsSlice
  );

  const handleSave = async () => {
    // if (!exportToReport && !isHaveExportToReport) {
    if (!exportToReport) {
      message.info("Bạn chưa chọn phụ lục để xuất vào tờ trình");
    }
    try {
      setIsBtnLoading(true);
      const priceData: any = await btnRefPricing.current?.updatePricing();
      if (!priceData) return;

      const noteData: any = btnRefNote.current?.updateNote();
      const btnUploadFile: any = await btnRefUpload.current?.uploadFile();

      let assetLandRentFlowDtoData = {};
      if (btnRefAssetLandRentFlowDto.current) {
        const [assetLandRentFlowDto, isValid]: [any, boolean] =
          await btnRefAssetLandRentFlowDto.current.updateData();
        assetLandRentFlowDtoData = assetLandRentFlowDto;
        if (!isValid) {
          setIsBtnLoading(false);
          return;
        }
      }

      let _price = {
        ...(priceData ? { ...priceData } : {}),
        ...(noteData ? { ...noteData } : {}),
      };
      if (assetLevelTwoId === ASSET_LV2.MACHINE) {
        delete _price.note;
        _price = {
          ..._price,
          ...(noteData
            ? {
                assetNote: noteData.note,
              }
            : {}),
        };
      }

      const dataUpdate = {
        ...data,
        storedAssets: storedAssets.map((el, index) => ({
          ...el,
          orderBy: index,
          distanceToAsset:
            distanceToAssets.find((item) => item.assetsId === el.assetId)
              ?.distance || null,
        })),
        constructions,
        adjustTable: adjustTable.map((el, index) => ({
          ...el,
          orderBy: index,
        })),
        appendices: btnUploadFile,
        assetLandRentFlowDto:
          Object.keys(assetLandRentFlowDtoData).length > 0
            ? assetLandRentFlowDtoData
            : data.assetLandRentFlowDto,
        prices: {
          ...data.prices,
          ..._price,
          isExportToReport: exportToReport,
        },
      };

      const res = await appraisalFilesApi.updateAssetsValuationDetail(
        {
          appraisalFileId: location.state?.appraisalFileId,
          assetLevelTwoId: assetLevelTwoId,
          valuationMethodDetailId: location.state?.valuationMethodDetailId,
          valuationMethodId: location.state?.valuationMethodId,
        },
        dataUpdate
      );
      if (res?.data?.code === 200) {
        message.success(res?.data?.message || "Cập nhật phụ lục thành công");
        mutate();
      } else {
        message.error(
          res?.data?.message || "Cập nhật phụ lục không thành công."
        );
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật phụ lục");
    } finally {
      setIsBtnLoading(false);
    }
  };

  const handleSaveProject = async () => {
    try {
      setIsBtnLoading(true);

      const noteData: any = btnRefNote.current?.updateNote();
      const [btnQssdValue, isQssdValid]: any =
        await btnRefQssdValue.current?.updateQssdValue();
      const btnUploadFile: any = await btnRefUpload.current?.uploadFile();

      if (!isQssdValid) {
        message.error("Vui lòng nhập giá trị quyền sử dụng đất");
        return;
      }

      let assetLandRentFlowDtoData = {};
      if (btnRefAssetLandRentFlowDto.current) {
        const [assetLandRentFlowDto, isValid]: [any, boolean] =
          await btnRefAssetLandRentFlowDto.current.updateData();
        assetLandRentFlowDtoData = assetLandRentFlowDto;
        if (!isValid) {
          setIsBtnLoading(false);
          return;
        }
      }

      const _price = {
        ...(noteData ? { ...noteData } : {}),
      };

      const dataUpdate = {
        ...data,
        storedAssets,
        constructions,
        tableKQDat: btnQssdValue,
        appendices: btnUploadFile,
        assetLandRentFlowDto:
          Object.keys(assetLandRentFlowDtoData).length > 0
            ? assetLandRentFlowDtoData
            : data.assetLandRentFlowDto,
        prices: {
          ...data.prices,
          ..._price,
        },
      };

      const res = await appraisalFilesApi.updateAssetsValuationDetail(
        {
          appraisalFileId: location.state?.appraisalFileId,
          assetLevelTwoId: assetLevelTwoId,
          valuationMethodDetailId: location.state?.valuationMethodDetailId,
          valuationMethodId: location.state?.valuationMethodId,
        },
        dataUpdate
      );
      if (res?.data?.code === 200) {
        message.success(res?.data?.message || "Cập nhật phụ lục thành công");
        mutate();
      } else {
        message.error(
          res?.data?.message || "Cập nhật phụ lục không thành công."
        );
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật phụ lục");
    } finally {
      setIsBtnLoading(false);
    }
  };

  const handleCheckIsValid = () => {
    // check đã nhập thông tin diện tích tại mđsd hay chưa cho BĐS, dự toán, dự án
    if (
      assetLevelTwoId === 1 ||
      assetLevelTwoId === 8 ||
      assetLevelTwoId === 9
    ) {
      const assetLandUsingPurposes =
        data?.assetLandInfor?.assetLandUsingPurposes.filter(
          (item: AssetLanUsingPurposeType) =>
            !item?.isConsolidationPurposeParent
        ) as AssetLanUsingPurposeType[];

      const isValid = assetLandUsingPurposes.every(
        (item: AssetLanUsingPurposeType) => {
          return (
            isNumber(item?.realAreaInPlan) &&
            isNumber(item?.realAreaUnPlan) &&
            isNumber(item?.realAreaWidth)
          );
        }
      );
      setValidModal(!isValid);
    } else if (assetLevelTwoId === 2) {
      // check đã nhập diện tích sử dụng riêng hay chưa
      const isValid = isNumber(data?.assetApartmentInfor?.realPrivateUseArea);
      setValidModal(!isValid);
    }
  };

  const handleSortStoredAssetsByAdjustTableOrder = () => {
    const _storedAssets: any[] = [];
    adjustTable.forEach((item) => {
      const index = storedAssets.findIndex(
        (el) => el.assetId === item.storedAssetId
      );
      if (index !== -1) {
        _storedAssets.push(storedAssets[index]);
      }
    });

    // add default tstd to list storedAssets
    if (storedAssets.length > 0) _storedAssets.unshift(storedAssets[0]);

    return _storedAssets;
  };
  const renderTableAssetInfo = () => {
    switch (assetLevelTwoId) {
      case 1:
        if (assetGrandChildId < 0) return; // nếu là phụ lục của diện tích không xem xét giá trị
        return {
          label: "Thông tin chung",
          children: (
            <TableAssetInfoLand
              storedAssets={storedAssets}
              assetLevelTwoId={assetLevelTwoId}
              adjustTable={adjustTable}
              handleUpdateAdjustTable={handleUpdateAdjustTable}
              handleUpdateStoredAssets={handleUpdateStoredAssets}
              assetType={ASSET_PRICES_SHARED_TYPE.PLAN_USING}
              exportToReport={exportToReport}
              onChangeExportToReport={handleChangeExportToReport}
              isPPTN={location.state?.valuationMethodId === 2}
              handleSaveInBackground={handleSaveInBackground}
              disabledActions={notUpdateAble}
            />
          ),
        };
      case 2:
        return {
          label: "Thông tin chung",
          children: (
            <TableAssetInfoApartment
              storedAssets={storedAssets}
              assetLevelTwoId={assetLevelTwoId}
              adjustTable={adjustTable}
              handleUpdateAdjustTable={handleUpdateAdjustTable}
              handleUpdateStoredAssets={handleUpdateStoredAssets}
              assetType={ASSET_PRICES_SHARED_TYPE.APARTMENT}
              exportToReport={exportToReport}
              onChangeExportToReport={handleChangeExportToReport}
              handleSaveInBackground={handleSaveInBackground}
              disabledActions={notUpdateAble}
            />
          ),
        };
      // Phương tiện đường bộ
      case 3:
        return {
          label: "Thông tin chung",
          children: (
            <TableAssetInfoRoadVehicle
              storedAssets={storedAssets}
              assetLevelTwoId={assetLevelTwoId}
              adjustTable={adjustTable}
              handleUpdateAdjustTable={handleUpdateAdjustTable}
              handleUpdateStoredAssets={handleUpdateStoredAssets}
              assetType={ASSET_PRICES_SHARED_TYPE.ROAD_VEHICLE}
              exportToReport={exportToReport}
              onChangeExportToReport={handleChangeExportToReport}
              disabledActions={notUpdateAble}
            />
          ),
        };
      // Phương tiện đường thủy
      case 4:
        return {
          label: "Thông tin chung",
          children: (
            <TableAssetInfoWaterVehicle
              storedAssets={handleSortStoredAssetsByAdjustTableOrder()}
              assetLevelTwoId={assetLevelTwoId}
              adjustTable={adjustTable}
              assetLevelThreeId={data?.assetLevelThreeId}
              handleUpdateAdjustTable={handleUpdateAdjustTable}
              handleUpdateStoredAssets={handleUpdateStoredAssets}
              assetType={ASSET_PRICES_SHARED_TYPE.WATERWAY_VEHICLE}
              exportToReport={exportToReport}
              onChangeExportToReport={handleChangeExportToReport}
              disabledActions={notUpdateAble}
            />
          ),
        };
      // máy móc thiết bị
      case 5:
        return {
          label: "Thông tin chung",
          children: (
            <TableAssetInfoMachine
              storedAssets={storedAssets}
              assetLevelTwoId={assetLevelTwoId}
              adjustTable={adjustTable}
              assetType={ASSET_PRICES_SHARED_TYPE.DEVICE}
              handleUpdateAdjustTable={handleUpdateAdjustTable}
              handleUpdateStoredAssets={handleUpdateStoredAssets}
              exportToReport={exportToReport}
              onChangeExportToReport={handleChangeExportToReport}
              disabledActions={notUpdateAble}
            />
          ),
        };
      case 8:
        return;
      case 9:
        if (assetGrandChildId < 0) return;
        return {
          label: "Thông tin chung",
          children: (
            <TableAssetInfoLand
              storedAssets={storedAssets}
              assetLevelTwoId={assetLevelTwoId}
              adjustTable={adjustTable}
              handleUpdateAdjustTable={handleUpdateAdjustTable}
              handleUpdateStoredAssets={handleUpdateStoredAssets}
              assetType={ASSET_PRICES_SHARED_TYPE.ESTIMATE}
              exportToReport={exportToReport}
              onChangeExportToReport={handleChangeExportToReport}
              isPPTN={location.state?.valuationMethodId === 2}
              handleSaveInBackground={handleSaveInBackground}
              disabledActions={notUpdateAble}
            />
          ),
        };
      default:
        return { label: "Thông tin chung", children: <></> };
    }
  };

  const renderTableAdjustInfo = () => {
    switch (assetLevelTwoId) {
      case 1:
        if (assetGrandChildId < 0) return;
        return {
          label: "Bảng điều chỉnh",
          children: (
            <TableAdjustInfoLand
              adjustTable={adjustTable}
              storedAssets={storedAssets}
              handleUpdateAdjustTable={handleUpdateAdjustTable}
              disabledActions={notUpdateAble}
            />
          ),
        };
      case 2:
        return {
          label: "Bảng điều chỉnh",
          children: (
            <TableAdjustInfoApartment
              adjustTable={adjustTable}
              storedAssets={storedAssets}
              handleUpdateAdjustTable={handleUpdateAdjustTable}
              disabledActions={notUpdateAble}
            />
          ),
        };
      //Phương tiện đường bộ
      case 3:
        return {
          label: "Bảng điều chỉnh",
          children: (
            <TableAdjustInforRoadVehicle
              adjustTable={adjustTable}
              storedAssets={storedAssets}
              handleUpdateAdjustTable={handleUpdateAdjustTable}
              disabledActions={notUpdateAble}
            />
          ),
        };
      //Phương tiện đường thủy
      case 4:
        return {
          label: "Bảng điều chỉnh",
          children: (
            <TableAdjustInforWaterVehicle
              adjustTable={adjustTable}
              storedAssets={storedAssets}
              handleUpdateAdjustTable={handleUpdateAdjustTable}
              disabledActions={notUpdateAble}
            />
          ),
        };
      // máy móc thiết bị
      case 5:
        return {
          label: "Bảng điều chỉnh",
          children: (
            <TableAdjustInfoMachine
              adjustTable={adjustTable}
              storedAssets={storedAssets}
              handleUpdateAdjustTable={handleUpdateAdjustTable}
              disabledActions={notUpdateAble}
            />
          ),
        };
      case 8:
        return;
      case 9:
        if (assetGrandChildId < 0) return;
        return {
          label: "Bảng điều chỉnh",
          children: (
            <TableAdjustInfoLand
              adjustTable={adjustTable}
              storedAssets={storedAssets}
              handleUpdateAdjustTable={handleUpdateAdjustTable}
              disabledActions={notUpdateAble}
            />
          ),
        };
      default:
        return { label: "Bảng điều chỉnh", children: <></> };
    }
  };

  const renderPricing = () => {
    if (!data) return { label: "Đơn giá", children: <></> };
    switch (assetLevelTwoId) {
      case 1:
        return {
          label: "Đơn giá",
          children:
            assetGrandChildId >= 0 ? (
              <PricingLand
                ref={btnRefPricing}
                prices={data.prices}
                adjustTable={adjustTable}
                storedAssets={storedAssets}
                assetLevelTwoId={assetLevelTwoId}
                isHaveRealAreaUnPlan={isHaveRealAreaUnPlan}
                assetLandRentFlowDto={
                  location.state?.valuationMethodId === 2
                    ? assetLandRentFlowDto
                    : null
                }
              />
            ) : (
              <PricingLandNotConsiderValue
                ref={btnRefPricing}
                prices={data.prices}
              />
            ),
        };
      case 2:
        return {
          label: "Đơn giá",
          children: (
            <PricingApartment
              ref={btnRefPricing}
              prices={data.prices}
              adjustTable={adjustTable}
              storedAssets={storedAssets}
              assetLevelTwoId={assetLevelTwoId}
              assetLandRentFlowDto={
                location.state?.valuationMethodId === 2
                  ? assetLandRentFlowDto
                  : null
              }
            />
          ),
        };
      // Phương tiện đường bộ
      case 3:
        return {
          label: "Đơn giá",
          children: (
            <PricingRoadVehicle
              ref={btnRefPricing}
              prices={data?.prices || null}
            />
          ),
        };
      // Phương tiện đường thủy
      case 4:
        return {
          label: "Đơn giá",
          children: (
            <PricingWaterVehicle
              ref={btnRefPricing}
              prices={data?.prices || null}
            />
          ),
        };
      // MMTB
      case 5:
        return {
          label: "Đơn giá",
          children: (
            <PricingMachine ref={btnRefPricing} prices={data.prices || null} />
          ),
        };
      case 8:
        return;
      case 9:
        return {
          label: "Đơn giá",
          children:
            assetGrandChildId >= 0 ? (
              <PricingLand
                ref={btnRefPricing}
                prices={data.prices}
                adjustTable={adjustTable}
                storedAssets={storedAssets}
                assetLevelTwoId={assetLevelTwoId}
                isHaveRealAreaUnPlan={isHaveRealAreaUnPlan}
                assetLandRentFlowDto={
                  location.state?.valuationMethodId === 2
                    ? assetLandRentFlowDto
                    : null
                }
              />
            ) : (
              <PricingLandNotConsiderValue
                ref={btnRefPricing}
                prices={data.prices}
              />
            ),
        };
      default:
        return { label: "Đơn giá", children: <></> };
    }
  };

  const renderCashFlowTable = () => {
    switch (assetLevelTwoId) {
      case 1:
        if (location.state?.valuationMethodId === 2)
          return {
            label: "Bảng tính dòng tiền cho thuê nhà",
            children: (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "8px",
                }}
              >
                <RentalCashFlow
                  ref={btnRefAssetLandRentFlowDto}
                  data={assetLandRentFlowDto}
                  adjustTable={adjustTable}
                  storedAssets={storedAssets}
                  handleUpdateAssetLandRentFlowDto={(data) =>
                    setAssetLandRentFlowDto(data)
                  }
                />
                <GrowthTable data={assetLandRentFlowDto} />
              </div>
            ),
          };
        return {};
      default:
        return {};
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có muốn thoát mà không lưu thay đổi?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        navigate(
          `${APPRAISAL_FILE_DETAIL.replace(
            ":id",
            location.state?.appraisalFileId
          )}?tab=4`
        );
      },
    });
  };

  const handleGetOriginData = async () => {
    const originData = {
      ...data,
      storedAssets: sortBy(
        data?.storedAssets.map((item: any) => item?.assetId),
        ["assetId"]
      ),
      appendices: sortBy(data?.appendices, ["appendixAssetValueId"]),
      prices: {
        ...data?.prices,
        isExportToReport: data?.prices?.isExportToReport || false,
        // totalValueContructionFuture: null,
        unitPriceInPlan: data?.prices?.unitPriceInPlanApproved || 0,
        unitPriceUnPlan: data?.prices?.unitPriceUnPlanApproved || 0,
      },
    };
    return originData;
  };
  const handleGetEditedData = async () => {
    const priceData: any = await btnRefPricing.current?.updatePricing();
    const noteData: any = btnRefNote.current?.updateNote();
    const btnUploadFile: any = await btnRefUpload.current?.uploadFile();
    let assetLandRentFlowDtoData = {};

    if (btnRefAssetLandRentFlowDto.current) {
      const [assetLandRentFlowDto]: [any, boolean] =
        await btnRefAssetLandRentFlowDto.current.updateData();
      assetLandRentFlowDtoData = assetLandRentFlowDto;
    }
    let _price = {
      ...(priceData ? { ...priceData } : {}),
      ...(noteData?.note ? { ...noteData } : { note: savedNote }),
    };
    if (assetLevelTwoId === ASSET_LV2.MACHINE) {
      delete _price.note;
      _price = {
        ..._price,
        ...(noteData
          ? {
              assetNote: noteData.note,
            }
          : {}),
      };
    }

    const updateData = {
      ...data,
      storedAssets: sortBy(
        data?.storedAssets.map((item: any) => item?.assetId),
        ["assetId"]
      ),
      constructions:
        constructions.map((item: any) => {
          const data = { ...item };
          delete data.key;
          return data;
        }) || [],
      adjustTable,
      appendices: sortBy(
        btnUploadFile?.map((item: any) => {
          const data = { ...item };
          delete data.key;
          delete data.name;
          delete data.status;
          delete data.uid;

          return data;
        }),
        ["appendixAssetValueId"]
      ),
      assetLandRentFlowDto:
        Object.keys(assetLandRentFlowDtoData).length > 0
          ? assetLandRentFlowDtoData
          : data.assetLandRentFlowDto,
      prices: {
        ...data.prices,
        ..._price,
        isExportToReport: exportToReport,
      },
    };
    return updateData;
  };
  const handleTranformDataByAssetLevelTwoId = async () => {
    const originData = await handleGetOriginData();
    const editedData = await handleGetEditedData();
    if (!originData || !editedData) return { editedData: {}, originData: {} };

    // remove tstd assets because it never change
    editedData.storedAssets.splice(0, 1);
    originData.storedAssets.splice(0, 1);

    //PTĐB not constructions && unitPriceInPlan && unitPriceUnPlan
    const isMovableAsset = isAssetMovableEstate(assetLevelTwoId);

    if (assetLevelTwoId === ASSET_LV2.APARTMENT) {
      delete editedData.constructions;
      delete editedData.assetLandRentFlowDto;
      delete editedData.prices.totalValueContructionFuture;

      delete originData.prices.unitPriceInPlan;
      delete originData.prices.unitPriceUnPlan;
      originData.prices.unitPrice =
        originData?.prices?.unitPriceApproved || originData.prices.unitPrice;
    } else if (assetLevelTwoId === ASSET_LV2.LAND) {
      // bds không có công trình hình thành trong tương lai
      delete originData.prices.totalValueContructionFuture;
      delete originData.prices.totalValueContructionFutureApproved;

      delete editedData.prices.totalValueContructionFuture;
      delete editedData.prices.totalValueContructionFutureApproved;
    }

    if (isMovableAsset) {
      delete editedData.constructions;
      delete editedData.assetLandRentFlowDto;
      delete originData.prices.unitPriceInPlan;
      delete originData.prices.unitPriceUnPlan;

      if (originData.prices.note == null) {
        originData.prices.note = "";
      }
      if (editedData.prices.note == null) {
        editedData.prices.note = "";
      }
    }
    if (assetLevelTwoId === ASSET_LV2.MACHINE) {
      if (originData.prices.assetNote == null) {
        originData.prices.assetNote = "";
      }
      if (editedData.prices.assetNote == null) {
        editedData.prices.assetNote = "";
      }
    }

    return { editedData, originData };
  };

  const handleCheckIsNotSaveChanged = async () => {
    return false;
    if (validModal || notUpdateAble) return false;

    try {
      const { editedData, originData } =
        await handleTranformDataByAssetLevelTwoId();
      // console log format json file
      const result = !isEqual(originData, editedData);
      return result;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (!data) return;
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      const isUnsafeTabClose = await handleCheckIsNotSaveChanged();
      if (isUnsafeTabClose) {
        event.preventDefault();
        return (event.returnValue = "Bạn có muốn rời khỏi trang này không?");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    btnRefPricing,
    btnRefNote,
    btnRefUpload,
    btnRefAssetLandRentFlowDto,
    storedAssets,
    constructions,
    adjustTable,
    exportToReport,
  ]);

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Thông tin hồ sơ",
        path: `${APPRAISAL_FILE_DETAIL.replace(
          ":id",
          location.state?.appraisalFileId
        )}?tab=4`,
        onClick: async (e: any) => {
          e.preventDefault();
          const isUnsafeTabClose = await handleCheckIsNotSaveChanged();
          if (!isUnsafeTabClose) {
            navigate(
              `${APPRAISAL_FILE_DETAIL.replace(
                ":id",
                location.state?.appraisalFileId
              )}?tab=4`
            );
          } else {
            showConfirm();
          }
        },
      },
      {
        label:
          location.state?.valuationMethodId === 1
            ? "Phụ lục PPSS"
            : "Phụ lục PPTN",
        path: "",
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    btnRefPricing,
    btnRefNote,
    btnRefUpload,
    btnRefAssetLandRentFlowDto,
    storedAssets,
    constructions,
    adjustTable,
    exportToReport,
  ]);

  if (!data && isLoading)
    return (
      <Row justify={"center"} style={{ width: "100%", marginTop: "2rem" }}>
        <Spin />
      </Row>
    );
  if (validModal)
    return (
      <Row justify={"center"} style={{ width: "100%" }}>
        <Result
          status="warning"
          title="Vui lòng nhập đủ thông tin diện tích thực tế tại mục đích sử dụng đất."
          extra={
            <Link
              to={`${APPRAISAL_FILE_DETAIL.replace(
                ":id",
                location.state?.appraisalFileId
              )}?tab=2`}
            >
              <Button type="primary" key="console">
                Quay lại tab thông tin tài sản
              </Button>
            </Link>
          }
        />
      </Row>
    );

  if (error) return <ComponentsError />;

  return (
    <div style={{ width: "100%" }}>
      <div
        className="page-container"
        style={{ padding: 0, paddingBottom: "8px" }}
      >
        <Space className="title-wrapper-appendixmethods">
          <Typography className="title">
            {location.state?.valuationMethodId === 1
              ? "Phụ lục phương pháp so sánh"
              : "Phụ lục phương pháp thu nhập"}
          </Typography>
          <Space className="action-wrapper" size="small" style={{ gap: "2px" }}>
            {!startProcessReportDate ? (
              <span style={{ color: "red" }}>
                *Hãy ấn nút "Lập tờ trình" trước khi thực hiện hồ sơ
              </span>
            ) : (
              <Button
                loading={isBtnLoading}
                className="btn-save"
                onClick={() => {
                  assetLevelTwoId === 8 ? handleSaveProject() : handleSave();
                }}
                disabled={notUpdateAble}
              >
                Lưu
              </Button>
            )}
          </Space>
        </Space>
        <Space
          direction="vertical"
          size="small"
          style={{ display: "flex", padding: "0 8px" }}
        >
          <CollapseCustom
            defaultActiveKey={["1", "2", "3"]}
            isInner
            itemList={[
              {
                ...renderTableAssetInfo(),
              },
              {
                ...renderTableAdjustInfo(),
              },
              {
                ...renderCashFlowTable(),
              },
            ]}
          />
          <Comment ref={btnRefNote} note={savedNote || ""} />
          <UploadAppendixFile
            ref={btnRefUpload}
            data={data?.appendices || []}
          />
          <CollapseCustom
            isInner
            itemList={[
              { ...renderPricing() },
              {
                ...(assetLevelTwoId === 8 && {
                  label: "Giá trị QSDĐ",
                  children: (
                    <QssdValue
                      ref={btnRefQssdValue}
                      assetId={location.state?.assetId}
                      appraisalFileId={location.state?.appraisalFileId}
                      assetChildId={location.state?.assetChildId}
                      data={tableKQDat}
                    />
                  ),
                }),
              },
              {
                ...((assetLevelTwoId === 1 ||
                  assetLevelTwoId === 8 ||
                  assetLevelTwoId === 9) &&
                  assetGrandChildId >= 0 && {
                    label: "Thông tin CTXD (theo GCN)",
                    children: (
                      <CtxdInfo
                        constructions={sortBy(
                          constructions.filter(
                            (el: any) => el.constructionLegalTypeId === 1
                          ),
                          ["assetLandInforId", "orderBy"]
                        )}
                        updatePrice={handleUpdatePriceCTXD}
                        fileStatus={location.state?.fileStatus}
                      />
                    ),
                  }),
              },
              {
                ...((assetLevelTwoId === 1 ||
                  assetLevelTwoId === 8 ||
                  assetLevelTwoId === 9) &&
                  assetGrandChildId >= 0 && {
                    label: "Thông tin CTXD (tham khảo)",
                    children: (
                      <CtxdInfo
                        constructions={sortBy(
                          constructions.filter(
                            (el: any) => el.constructionLegalTypeId === 2
                          ),
                          ["assetLandInforId", "orderBy"]
                        )}
                        updatePrice={handleUpdatePriceCTXD}
                        fileStatus={location.state?.fileStatus}
                      />
                    ),
                  }),
              },
            ]}
          />
        </Space>
      </div>
    </div>
  );
};

export default memo(CreatePriceShared);
