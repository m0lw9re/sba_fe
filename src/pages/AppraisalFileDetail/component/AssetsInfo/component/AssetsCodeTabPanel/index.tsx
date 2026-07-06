import { ReloadOutlined } from "@ant-design/icons";
import { Button, Result, message } from "antd";
import { CollapseCustom } from "components/CollapseCustom";
import { ASSET_LV2 } from "constant/enums";
import { AppraisalFileAssetDetailType } from "constant/types";
import FeatureLand from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/FeatureLand";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getAssetMachineDeviceData,
  getAssetRealEstateData,
  getAssetRoadVehicleData,
  getAssetWaterVehicleData,
  isAssetMovableEstate,
  isAssetRealEstate,
} from "utils/asset";
import Apartment from "./component/Apartment";
import FeatureApartment from "./component/FeatureApartment";
import FeatureTechnique from "./component/FeatureTechnique";
import FeatureTechniqueMachine from "./component/FeatureTechniqueMachine";
import FeatureWaterVehicle from "./component/FeatureWaterVehicle";
import Ground from "./component/Ground";
import LegalInfor from "./component/LegalInfor";
import LegalTransportInfo from "./component/LegalTransportInfo";
import OtherInfo from "./component/OtherInfo";
import OtherInfoTransport from "./component/OtherInfoTransport";
import OtherInfoWaterVehicle from "./component/OtherInfoWaterVehicle";
// import RepairWarrantyInfor from "./component/RepairAndWarrantyInfo";
import FeatureProject from "./component/FeatureProject";
import LegalMachineInfo from "./component/LegalMachineInfo";
import LegalProjectInfo from "./component/LegalProjectInfo";
import OtherInfoProject from "./component/OtherInfoProject";
import TableRiskWarn from "./component/TableRiskWarn";
import TradeInServices from "./component/TradeInServices";

type Props = {
  index: number;
  assetDetail: AppraisalFileAssetDetailType;
};

type RefProps = {
  updateAssetCodeTabPanel: () => void;
};
const { VEHICLE, WATER_VEHICLE, APARTMENT, MACHINE, ESTIMATE, LAND, PROJECT } =
  ASSET_LV2;

const AssetsCodeTabPanel = forwardRef<RefProps, Props>(
  ({ assetDetail, index }, ref) => {
    useImperativeHandle(ref, () => ({
      updateAssetCodeTabPanel: onUpdateAsset,
    }));
    // bất động sản data
    const btnRefLegalInfors = useRef<{ updateLegalInfors: () => void }>(null);
    const btnRefLegalProjectInfors = useRef<{
      updateLegalProjectInfors: () => void;
    }>(null);
    const btnRefFeatureLand = useRef<{ updateFeatureLand: () => void }>(null);
    const btnRefOtherInfoLand = useRef<{ updateOtherInfoLand: () => void }>(
      null
    );
    const btnRefGround = useRef<{ updateGround: () => void }>(null);
    const btnRefTradeInServices = useRef<{
      updateTradeInServices: () => void;
    }>(null);
    const btnRefApartment = useRef<{
      updateApartment: () => void;
    }>(null);

    const btnRefFeatureApartment = useRef<{
      updateFeatureApartment: () => void;
    }>(null);

    const btnRefFeatureProject = useRef<{ updateFeatureProject: () => void }>(
      null
    );

    const btnRefOtherInfoProject = useRef<{
      updateOtherInfoProject: () => void;
    }>(null);
    // ======== END =========

    // động sản data
    const btnRefOtherTransportInfor = useRef<{
      updateOtherInfoLand: () => void;
    }>(null);
    const btnRefOtherWaterVehicleInfor = useRef<{
      updateOtherInfoWaterVehicle: () => void;
    }>(null);
    const btnRefFeatureDeviceMachine = useRef<{
      updateFeatureMachineDeviceinfor: () => void;
    }>(null);
    // Thông số kỹ thuật PTĐB
    const btnRefFeatureVehicleRoad = useRef<{
      updateFeatureVehicleRoad: () => void;
    }>(null);
    // Thông tin pháp lý phương tiện vận tải
    const btnRefLegalTransportInfors = useRef<{
      updateLegalInfors: () => void;
    }>(null);
    const btnRefLegalMachineInfors = useRef<{
      updateLegalMachineInfors: () => void;
    }>(null);
    const btnFeatureTransportWaterInfors = useRef<{
      updateFeatureWaterVehicle: () => void;
    }>(null);
    // ======== END =========

    // default
    const btnRefRisks = useRef<{ updateRisks: () => void }>(null);

    const [isApartment, setIsApartment] = useState<boolean>(false);
    const [isGround, setIsGround] = useState<boolean>(false);
    const [isTradeInServices, setIsTradeInServices] = useState<boolean>(false);

    const onUpdateAsset = async () => {
      const isRealEstate = isAssetRealEstate(assetDetail.assetLevelTwoId);
      const isMovableEstate = isAssetMovableEstate(assetDetail.assetLevelTwoId);

      const _legalInformations = await handleUpdateLegalInfo();
      const errorMessageShowAssetLocate = ` tại tài sản số ${index + 1} (${
        assetDetail.assetCode
      }).`;
      if (
        !_legalInformations ||
        _legalInformations?.legalInformations?.length === 0
      ) {
        message.error(
          `Vui lòng nhập thông tin pháp lý ${errorMessageShowAssetLocate}`
        );
        return;
      }
      let assetLandRealEstateData = {};
      if (isRealEstate || assetDetail.assetLevelTwoId === PROJECT) {
        assetLandRealEstateData = await handleUpdateAssetRealEstate();
        if (!assetLandRealEstateData) return;
      }

      let assetMoveableEstateData = {};
      if (isMovableEstate) {
        assetMoveableEstateData = await handleUpdateAssetMovableEstate();
        if (!assetMoveableEstateData) {
          // MMTB show error message in child component not showing here
          if (assetDetail.assetLevelTwoId !== ASSET_LV2.MACHINE) {
            message.error(
              `Vui lòng kiểm tra lại thông số kỹ thuật ${errorMessageShowAssetLocate}`
            );
          }
          return;
        }
      }

      // thông tin khác
      let otherInfoData = null;
      if (assetDetail.assetLevelTwoId !== ASSET_LV2.MACHINE) {
        otherInfoData = await handleUpdateOtherInfo();
        if (!otherInfoData) {
          message.error(
            `Vui lòng nhập thông tin khác ${errorMessageShowAssetLocate}`
          );
          return;
        }
      }

      // CBRR
      const assetRisks: any = await btnRefRisks.current?.updateRisks();
      if (!assetRisks) return;

      const assetDetailUpdated = {
        ...assetDetail,
        assetObject: {
          // default
          ...assetDetail.assetObject,

          // data for asset real estate
          ...(isRealEstate || assetDetail.assetLevelTwoId === PROJECT
            ? assetLandRealEstateData
            : {}),

          // data for asset movable estate
          ...(isMovableEstate ? assetMoveableEstateData : {}),
          ..._legalInformations,
          ...otherInfoData,
          ...(assetRisks ? { riskDetails: assetRisks } : {}),
        },
      };

      return assetDetailUpdated;
    };

    const handleUpdateAssetRealEstate = async () => {
      const featureLandData: any =
        await btnRefFeatureLand.current?.updateFeatureLand();

      const featureProjectData: any =
        await btnRefFeatureProject.current?.updateFeatureProject();

      // validate thông tin thửa đất, ngoại trừ chcc
      if (
        (assetDetail.assetLevelTwoId === LAND ||
          assetDetail.assetLevelTwoId === ESTIMATE) &&
        !featureLandData?.assetLandInfos
      ) {
        return;
      }

      // validate thông tin thửa đất dự án
      if (
        assetDetail.assetLevelTwoId === PROJECT &&
        !featureProjectData?.assetProjectInfor
      ) {
        return;
      }

      const apartmentData: any =
        await btnRefApartment.current?.updateApartment();
      const GroundData: any = await btnRefGround.current?.updateGround();

      const TradeInServicesData: any =
        await btnRefTradeInServices.current?.updateTradeInServices();

      const featureApartmentData: any =
        await btnRefFeatureApartment.current?.updateFeatureApartment();
      if (
        assetDetail.assetLevelTwoId === APARTMENT &&
        !featureApartmentData?.assetApartmentInfos
      ) {
        return;
      }

      return {
        ...(featureLandData?.assetLandInfos
          ? { assetLandInfors: featureLandData.assetLandInfos }
          : {}),
        ...(featureProjectData?.assetProjectInfor
          ? { assetProjectInfor: featureProjectData.assetProjectInfor }
          : {}),
        ...(featureLandData?.mergeLandData
          ? { ...featureLandData.mergeLandData }
          : {}),
        ...(apartmentData ? { ...apartmentData } : {}),

        ...(featureApartmentData?.assetApartmentInfos
          ? { assetApartmentInfors: featureApartmentData.assetApartmentInfos }
          : {}),
        ...(featureApartmentData?.mergeApartmentData
          ? { ...featureApartmentData.mergeApartmentData }
          : {}),
        ...(GroundData ? { ...GroundData } : {}),
        ...(TradeInServicesData ? { ...TradeInServicesData } : {}),

        exportType:
          featureLandData?.exportType || featureProjectData?.exportType || 0,
        isShowAppendixDetail: featureProjectData?.isShowAppendixDetail || false,
      };
    };
    const handleUpdateAssetMovableEstate = async () => {
      // get data PTDB
      const featureVehicleRoadData: any =
        await btnRefFeatureVehicleRoad.current?.updateFeatureVehicleRoad();

      // check validate Đặc điểm thông số kỹ thuật
      if (!featureVehicleRoadData && assetDetail.assetLevelTwoId === VEHICLE)
        return;

      // get data PTDT
      const featureTransportInforData: any =
        await btnFeatureTransportWaterInfors.current?.updateFeatureWaterVehicle();
      // check validate Đặc điểm thông số kỹ thuật
      if (
        !featureTransportInforData &&
        assetDetail.assetLevelTwoId === WATER_VEHICLE
      ) {
        return;
      }

      // Lấy data các MMTB
      const featureDeviceMachineInforData: any =
        await btnRefFeatureDeviceMachine.current?.updateFeatureMachineDeviceinfor();
      // check validate Đặc điểm thông số kỹ thuật
      if (
        !featureDeviceMachineInforData &&
        assetDetail.assetLevelTwoId === MACHINE
      )
        return;

      return {
        // data ptđb
        ...(featureVehicleRoadData ? { ...featureVehicleRoadData } : {}),

        // data ptđt
        ...(featureTransportInforData ? { ...featureTransportInforData } : {}),

        // data mmtb
        ...(featureDeviceMachineInforData
          ? { ...featureDeviceMachineInforData }
          : {}),
        exportType: 0, //Không có hợp thửa, hợp khối nên để typeExport = 0
      };
    };

    const handleUpdateLegalInfo = async () => {
      let _legalInformations = null;

      const assetLegalInfors: any =
        await btnRefLegalInfors.current?.updateLegalInfors();

      const assetLegalTransportInfors: any =
        await btnRefLegalTransportInfors.current?.updateLegalInfors();

      const assetLegalMachineInfors: any =
        await btnRefLegalMachineInfors.current?.updateLegalMachineInfors();

      const assetLegalProjectInfors: any =
        await btnRefLegalProjectInfors.current?.updateLegalProjectInfors();

      if (isAssetRealEstate(assetDetail.assetLevelTwoId)) {
        _legalInformations = assetLegalInfors;
      } else if (
        assetDetail.assetLevelTwoId === VEHICLE ||
        assetDetail.assetLevelTwoId === WATER_VEHICLE
      ) {
        _legalInformations = assetLegalTransportInfors;
      } else if (assetDetail.assetLevelTwoId === MACHINE) {
        _legalInformations = assetLegalMachineInfors;
      } else if (assetDetail.assetLevelTwoId === PROJECT) {
        _legalInformations = assetLegalProjectInfors;
      }
      return _legalInformations;
    };

    const renderLegalInfo = () => {
      // Thông tin pháp lý
      if (
        assetDetail.assetLevelTwoId === LAND ||
        assetDetail.assetLevelTwoId === ESTIMATE ||
        assetDetail.assetLevelTwoId === APARTMENT
      ) {
        return {
          label: "Thông tin pháp lý",
          children: (
            <LegalInfor
              ref={btnRefLegalInfors}
              assetLevelTwoId={assetDetail.assetLevelTwoId}
              legalInformations={
                assetDetail.assetObject?.legalInformations.sort(
                  (a, b) => (a.orderBy || 0) - (b.orderBy || 0)
                ) || []
              }
              legalInformation_full={
                assetDetail.assetObject?.legalInformation_full
              }
              noteLegalSBA={assetDetail.assetObject?.noteLegalSBA}
            />
          ),
        };
      } else if (
        assetDetail.assetLevelTwoId === VEHICLE ||
        assetDetail.assetLevelTwoId === WATER_VEHICLE
      ) {
        // Phương tiện vận tải (đường thủy + đường bộ)
        return {
          label: "Thông tin pháp lý",
          children: (
            <LegalTransportInfo
              assetLevelTwoId={assetDetail.assetLevelTwoId}
              ref={btnRefLegalTransportInfors}
              legalInformations={
                assetDetail.assetObject?.legalInformations.sort(
                  (a, b) => (a.orderBy || 0) - (b.orderBy || 0)
                ) || []
              }
              legalInformation_full={
                assetDetail.assetObject?.legalInformationFull
              }
              noteSpecifications={assetDetail.assetObject?.noteSpecifications}
              noteLegalSBA={assetDetail.assetObject?.noteLegalSBA}
            />
          ),
        };
      } else if (assetDetail.assetLevelTwoId === MACHINE) {
        // Máy móc thiết bị
        return {
          label: "Thông tin pháp lý",
          children: (
            <LegalMachineInfo
              assetLevelTwoId={assetDetail.assetLevelTwoId}
              ref={btnRefLegalMachineInfors}
              legalInformations={
                assetDetail.assetObject?.legalInformations.sort(
                  (a, b) => (a.orderBy || 0) - (b.orderBy || 0)
                ) || []
              }
              legalInformation_full={
                assetDetail.assetObject?.legalInformationFull
              }
              noteSpecifications={assetDetail.assetObject?.noteSpecifications}
              noteLegalSBA={assetDetail.assetObject?.noteLegalSBA}
            />
          ),
        };
      } else if (assetDetail.assetLevelTwoId === PROJECT) {
        return {
          label: "Thông tin pháp lý",
          children: (
            <LegalProjectInfo
              assetLevelTwoId={assetDetail.assetLevelTwoId}
              ref={btnRefLegalProjectInfors}
              legalInformations={
                assetDetail.assetObject?.legalInformations.sort(
                  (a, b) => (a.orderBy || 0) - (b.orderBy || 0)
                ) || []
              }
              legalInformation_full={
                assetDetail.assetObject?.legalInformation_full
              }
            />
          ),
        };
      }
    };

    const renderFeature = () => {
      // check mã loại tài sản để render ra đặc điểm tương ứng
      if (
        assetDetail.assetLevelTwoId === LAND ||
        assetDetail.assetLevelTwoId === ESTIMATE
      ) {
        const assetObject = getAssetRealEstateData(assetDetail);
        // BĐS
        return {
          label: "Đặc điểm thửa đất",
          forceRender: true,
          children: (
            <FeatureLand
              ref={btnRefFeatureLand}
              assetLandInfos={assetObject?.assetLandInfors || []}
              mergeLandData={{
                facadeLength: assetObject?.facadeLength,
                totalLength: assetObject?.totalLength,
                combinePrivateArea: assetObject?.combinePrivateArea,
                combineCommonArea: assetObject?.combineCommonArea,
                combineAreaWidth: assetObject?.combineAreaWidth,
                combineAreaInPlan: assetObject?.combineAreaInPlan,
                combineAreaUnPlan: assetObject?.combineAreaUnPlan,
                combineNote: assetObject?.combineNote,
                combineAppraisalLocation: assetObject?.combineAppraisalLocation,
                combineLandShape: assetObject?.combineLandShape,
                combineAreaNotConsiderValue:
                  assetObject?.combineAreaNotConsiderValue,
                combineLandAddressDetail: assetObject?.combineLandAddressDetail,
                combineAreaWidthDetail: assetObject?.combineAreaWidthDetail,
              }}
            />
          ),
        };
      } else if (assetDetail.assetLevelTwoId === PROJECT) {
        const assetObject = getAssetRealEstateData(assetDetail);
        return {
          label: "Đặc điểm thửa đất",
          forceRender: true,
          children: (
            <FeatureProject
              ref={btnRefFeatureProject}
              assetProjectInfor={assetObject?.assetProjectInfor || {}}
              isShowAppendixDetail={assetObject?.isShowAppendixDetail || false}
            />
          ),
        };
      } else if (assetDetail.assetLevelTwoId === APARTMENT) {
        const assetObject = getAssetRealEstateData(assetDetail);
        // CHCC
        return {
          label: "Đặc điểm chung",
          forceRender: true,
          children: (
            <FeatureApartment
              ref={btnRefFeatureApartment}
              assetApartmentInfos={assetObject?.assetApartmentInfors || []}
              mergeApartmentData={{
                combinePrivateArea: assetObject?.combinePrivateArea,
                combineNote: assetObject?.combineNote,
                combineAppraisalLocation: assetObject?.combineAppraisalLocation,
              }}
            />
          ),
        };
      } else if (assetDetail.assetLevelTwoId === WATER_VEHICLE) {
        // Phương tiện đường thủy
        const assetObject = getAssetWaterVehicleData(assetDetail);

        return {
          label: "Đặc điểm thông số kỹ thuật",
          forceRender: true,
          children: (
            <FeatureWaterVehicle
              ref={btnFeatureTransportWaterInfors}
              assetWaterVehicleInfor={{
                ...assetObject,
                legalShipType: assetDetail.assetLevelThreeId?.toString(),
                realShipType: assetDetail.assetLevelThreeId?.toString(),
              }}
            />
          ),
        };
      } else if (assetDetail.assetLevelTwoId === VEHICLE) {
        // Phương tiện đường bộ
        const assetObject = getAssetRoadVehicleData(assetDetail);
        return {
          label: "Đặc điểm thông số kỹ thuật",
          forceRender: true,
          children: (
            <FeatureTechnique
              ref={btnRefFeatureVehicleRoad}
              assetVehicleInfos={assetObject}
              assetLevelThreeId={assetDetail.assetLevelThreeId}
            />
          ),
        };
      } else if (assetDetail.assetLevelTwoId === MACHINE) {
        // Máy móc thiết bị
        const assetObject = getAssetMachineDeviceData(assetDetail);
        return {
          label: "Đặc điểm thông số kỹ thuật",
          forceRender: true,
          children: (
            <FeatureTechniqueMachine
              assetId={assetDetail.assetObject.assetId || null}
              productLineName={assetObject.productLineName}
              ref={btnRefFeatureDeviceMachine}
              assetMachineInfos={assetObject.assetMachineInfors || []}
              assetLevelThreeId={assetDetail.assetLevelThreeId}
              assetCode={assetDetail.assetCode}
              index={index}
            />
          ),
        };
      } else {
        return {};
      }
    };

    //render CHCC và đất thuê của loại tài sản dự án
    const renderOtherInfoProject = () => {
      if (assetDetail.assetLevelTwoId === PROJECT) {
        const assetObject = getAssetRealEstateData(assetDetail);

        return [
          {
            label: "Căn hộ chung cư",
            children: (
              <Apartment
                ref={btnRefApartment}
                data={{
                  haveApartment: assetObject?.haveApartment,
                  apartmentNote: assetObject?.apartmentNote,
                }}
                visible={isApartment}
                setVisible={setIsApartment}
              />
            ),
          },
          {
            label: "Đất nền",
            children: (
              <Ground
                ref={btnRefGround}
                data={{
                  haveGround: assetObject?.haveGround,
                  groundNote: assetObject?.groundNote,
                }}
                visible={isGround}
                setVisible={setIsGround}
              />
            ),
          },
          {
            label: "Thương mai dịch vụ",
            children: (
              <TradeInServices
                ref={btnRefTradeInServices}
                data={{
                  haveLandForRent: assetObject?.haveLandForRent,
                  landForRentNote: assetObject?.landForRentNote,
                  typeService: assetObject?.typeService,
                }}
                visible={isTradeInServices}
                setVisible={setIsTradeInServices}
              />
            ),
          },
        ];
      } else return [];
    };

    const otherInfoData = useMemo(() => {
      return {
        businessAdvantage: assetDetail.assetObject?.businessAdvantage,
        liquidity: assetDetail.assetObject?.liquidity,
        currentUseSituation: assetDetail.assetObject?.currentUseSituation,
        disputeInfor: assetDetail.assetObject?.disputeInfor,
        planningInfor: assetDetail.assetObject?.planningInfor,
        note: assetDetail.assetObject?.note,
      };
    }, [assetDetail.assetObject]);
    const handleUpdateOtherInfo = async () => {
      let otherInfoData: any = null;
      if (isAssetRealEstate(assetDetail.assetLevelTwoId)) {
        otherInfoData =
          await btnRefOtherInfoLand.current?.updateOtherInfoLand();
      } else if (assetDetail.assetLevelTwoId === VEHICLE) {
        otherInfoData =
          await btnRefOtherTransportInfor.current?.updateOtherInfoLand();
      } else if (assetDetail.assetLevelTwoId === WATER_VEHICLE) {
        otherInfoData =
          await btnRefOtherWaterVehicleInfor.current?.updateOtherInfoWaterVehicle();
      } else if (assetDetail.assetLevelTwoId === PROJECT) {
        otherInfoData =
          await btnRefOtherInfoProject.current?.updateOtherInfoProject();
      }
      return otherInfoData;
    };
    const renderOtherInfo = () => {
      if (isAssetRealEstate(assetDetail.assetLevelTwoId)) {
        return {
          label: "Thông tin khác",
          forceRender: true,
          children: (
            <OtherInfo
              data={otherInfoData}
              assetlevel2={assetDetail.assetLevelTwoId}
              ref={btnRefOtherInfoLand}
            />
          ),
        };
      } else if (assetDetail.assetLevelTwoId === VEHICLE) {
        // Phương tiện đường bộ
        const assetObject = getAssetRoadVehicleData(assetDetail);
        return {
          label: "Thông tin khác",
          forceRender: true,
          children: (
            <OtherInfoTransport
              ref={btnRefOtherTransportInfor}
              assetlevel2={assetDetail.assetLevelTwoId}
              otherInfor={{
                usingOrigin: assetObject.usingOrigin,
                currentUseSituation: assetObject.currentUseSituation,
                liquidity: assetObject.liquidity,
                remainQuality: assetObject.remainQuality,
                disputeInfor: assetObject.disputeInfor,
                // odo: assetObject.odo,
                numberOfKilometersUsed: assetObject.numberOfKilometersUsed,
                note: assetObject.note,
              }}
            />
          ),
        };
      } else if (assetDetail.assetLevelTwoId === WATER_VEHICLE) {
        // Phương tiện đường thủy
        const assetObject = getAssetWaterVehicleData(assetDetail);

        return {
          label: "Thông tin khác",
          forceRender: true,
          children: (
            <OtherInfoWaterVehicle
              ref={btnRefOtherWaterVehicleInfor}
              assetlevel2={assetDetail.assetLevelTwoId}
              otherInfor={{
                usingOrigin: assetObject.usingOrigin,
                currentUseSituation: assetObject.currentUseSituation,
                liquidity: assetObject.liquidity,
                remainQuality: assetObject.remainQuality,
                disputeInfor: assetObject.disputeInfor,
                numberOfDaysUsed: assetObject.numberOfDaysUsed,
                note: assetObject.note,
              }}
            />
          ),
        };
      } else if (assetDetail.assetLevelTwoId === PROJECT) {
        // Dự án
        return {
          label: "Thông tin khác",
          forceRender: true,
          children: (
            <OtherInfoProject
              ref={btnRefOtherInfoProject}
              data={otherInfoData}
            />
          ),
        };
      } else {
        return {};
      }
    };

    useEffect(() => {
      const assetObjectTemp = getAssetRealEstateData(assetDetail);
      if (assetObjectTemp) {
        setIsApartment(Boolean(assetObjectTemp?.haveApartment));
        setIsGround(Boolean(assetObjectTemp?.haveGround));
        setIsTradeInServices(Boolean(assetObjectTemp?.haveLandForRent));
      }
    }, [JSON.stringify(assetDetail)]);

    if (!assetDetail?.assetObject) {
      return (
        <Result
          status="error"
          title="Không tìm thấy thông tin tài sản."
          extra={
            <Button
              type="primary"
              key="console"
              icon={<ReloadOutlined />}
              onClick={() => window.location.reload()}
            >
              Tải lại
            </Button>
          }
        />
      );
    }

    return (
      <CollapseCustom
        isInner
        itemList={[
          // {
          //   label: "Thông tin chủ sở hữu",
          //   children: <OwnerInfor />,
          // },
          {
            // Thông tin pháp lý
            ...renderLegalInfo(),
          },
          {
            // Đặc điểm
            ...renderFeature(),
          },
          ...renderOtherInfoProject(),

          {
            //  Thông tin khác
            ...renderOtherInfo(),
          },
          {
            label: "Cảnh báo rủi ro",
            forceRender: true,
            children: (
              <TableRiskWarn
                ref={btnRefRisks}
                assetRisk={
                  assetDetail?.assetObject?.riskDetails?.sort(
                    (a, b) => (a.orderBy || 0) - (b.orderBy || 0)
                  ) || []
                }
                assetLevelTwoId={assetDetail?.assetLevelTwoId}
              />
            ),
          },
        ]}
      />
    );
  }
);

export default memo(AssetsCodeTabPanel);
