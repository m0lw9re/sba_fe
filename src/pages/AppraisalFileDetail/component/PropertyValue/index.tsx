import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Modal, Row, Space, Typography, message } from "antd";
import { appraisalFilesApi } from "apis/appraisalFiles";
import { CollapseCustom } from "components/CollapseCustom";
import Loading from "components/common/Loading";
import { ASSET_LV2, ASSET_LV3 } from "constant/enums";
import { AssetValuationType } from "constant/types/appraisalFile";
import { sortBy } from "lodash";
import { ExpertiseInfo } from "pages/AppraisalFileDetail/component/PropertyValue/component/ExpertiseInfo";
import LocateTstdAndTsss from "pages/AppraisalFileDetail/component/PropertyValue/component/LocateTstdAndTsss";
import { PermissionUseMachineDevice } from "pages/AppraisalFileDetail/component/PropertyValue/component/PermissionUseMachineDevice";
import { PermissionUseRoadVehicle } from "pages/AppraisalFileDetail/component/PropertyValue/component/PermissionUseRoadVehicle";
import { PermissionUseWaterVehicle } from "pages/AppraisalFileDetail/component/PropertyValue/component/PermissionUseWaterVehicle";
import { PermissionUseApartment } from "pages/AppraisalFileDetail/component/PropertyValue/component/PermisstionUseApartment";
import { PermissionUseLand } from "pages/AppraisalFileDetail/component/PropertyValue/component/PermisstionUseLand";
import { ResultExpertise } from "pages/AppraisalFileDetail/component/PropertyValue/component/ResultExpertise";
import ComponentsError from "pages/ComponentsError";
import ApprovalHistoryModal from "pages/ReportViewManagement/ReportViewLevelOne/component/ApprovalHistoryModal";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { isAssetMovableEstate, isAssetRealEstate } from "utils/asset";
import {
  useAccounts,
  useAppraisalFileDetail,
  useAssetsValuation,
} from "utils/request";
import { useApproval } from "utils/request/useApproval";
import { OtherNote } from "./component/OtherNote";
import { PermissionUseProject } from "./component/PermissionUseProject";
import UploadImages from "./component/UploadImages";
import ImageDiagram from "../PositonAndImg/component/ImagePanelTab/components/ImageDiagram";
import { APPRAISAL_IMAGE_UPLOAD_TYPE } from "constant/common";

type Props = {
  appraisalFileId: string;
  assetLevelTwoId: number;
  fileStatus: number;
};

type RefProps = {
  updatePropertyValue: () => void;
};

const PropertyValue = forwardRef<RefProps, Props>(
  ({ appraisalFileId, assetLevelTwoId, fileStatus }, ref) => {
    const {
      data,
      isLoading,
      error,
      mutate,
    }: {
      data: AssetValuationType;
      isLoading: boolean;
      error: any;
      mutate: () => void;
    } = useAssetsValuation(appraisalFileId, assetLevelTwoId);

    const { data: appraisalFileData } = useAppraisalFileDetail(appraisalFileId);

    const { data: approvalInfo } = useApproval(appraisalFileId || null);
    const { data: staffs } = useAccounts({
      page: 1,
      limit: 9000,
    });

    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [openMapModal, setOpenMapModal] = useState<boolean>(false);
    const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);

    const [noteValue, setNoteValue] = useState<string>("");
    const btnRefPermissionUseLand = useRef<{
      updatePermissionUseLand: () => void;
    }>(null);
    const btnRefPermissionUseMoveableAsset = useRef<{
      onUpdate: () => void;
    }>(null);
    const btnRefImagePropertyValue = useRef<{ updateImageDiagram: () => void }>(
      null
    );
    useImperativeHandle(ref, () => ({
      updatePropertyValue: onUpdatePropertyValue,
    }));

    const getPropertyValueRealEstate = async () => {
      const tablePP =
        await btnRefPermissionUseLand.current?.updatePermissionUseLand();
      const assetImagesData: any =
        await btnRefImagePropertyValue.current?.updateImageDiagram();

      const assetImagesPropertyValue = assetImagesData
        ? [...assetImagesData.images]
        : [...(data?.assetImages || [])];

      if (assetImagesData?.isUploadFailed) {
        message.error("Upload ảnh lưu ý khác không thành công");
      }

      const dataUpdate = {
        ...data,
        ...(tablePP ? { tablePP: tablePP } : {}),
        ...(typeof noteValue === "string"
          ? {
              tableTong: {
                ...data?.tableTong,
                note: noteValue,
              },
            }
          : {}),
        assetImages: assetImagesPropertyValue,
      };
      return dataUpdate;
    };
    const getPropertyValueMovableEstate = async () => {
      const tablePP =
        await btnRefPermissionUseMoveableAsset.current?.onUpdate();

      const dataUpdate = {
        ...data,
        ...(tablePP ? { tablePP: tablePP } : {}),
        ...(typeof noteValue === "string"
          ? {
              tableTong: {
                ...data?.tableTong,
                note: noteValue,
              },
            }
          : {}),
      };
      return dataUpdate;
    };
    const getDataUpdateController = async () => {
      let result: AssetValuationType | null = null;

      if (isAssetRealEstate(assetLevelTwoId)) {
        // BĐS
        result = await getPropertyValueRealEstate();
      } else if (isAssetMovableEstate(assetLevelTwoId)) {
        // Động sản
        result = await getPropertyValueMovableEstate();
      } else if (assetLevelTwoId === ASSET_LV2.PROJECT) {
        // Động sản
        result = await getPropertyValueRealEstate();
      } else {
        // Khác
      }
      return result;
    };
    const onUpdatePropertyValue = async () => {
      try {
        const dataUpdate = await getDataUpdateController();
        if (!dataUpdate) {
          throw new Error();
        }

        const res = await appraisalFilesApi.updateAssetsValuation(
          appraisalFileId,
          assetLevelTwoId,
          dataUpdate
        );
        if (res.data.body.code === 200) {
          mutate();
          message.success("Cập nhật giá trị tài sản thành công.");
        } else {
          throw new Error();
        }
      } catch (error) {
        console.log(error);
        message.error("Cập nhật giá trị tài sản không thành công.");
      }
    };

    const renderPermissionUse = () => {
      const _tablePP = sortBy(data?.tablePP || [], ["orderBy"]);
      const _tableKQDat = sortBy(data?.tableKQDat || [], ["orderBy"]);
      const _tableKQ = sortBy(data?.tableKQ || [], ["orderBy"]);

      switch (assetLevelTwoId) {
        case ASSET_LV2.LAND:
          return {
            label: "Quyền sử dụng đất/Lợi thế thương mại",
            children: (
              <PermissionUseLand
                ref={btnRefPermissionUseLand}
                tablePP={_tablePP || []}
                tableKQDat={data.tableKQDat || []}
                tableKQCTXD={data.tableKQCTXD || []}
                assetLevelTwoId={assetLevelTwoId}
                fileStatus={fileStatus}
              />
            ),
          };
        case ASSET_LV2.ESTIMATE:
          return {
            label: "Quyền sử dụng đất/Lợi thế thương mại",
            children: (
              <PermissionUseLand
                ref={btnRefPermissionUseLand}
                tablePP={_tablePP || []}
                tableKQDat={data.tableKQDat || []}
                tableKQCTXD={data.tableKQCTXD || []}
                tableTong={data?.tableTong}
                assetLevelTwoId={assetLevelTwoId}
                fileStatus={fileStatus}
              />
            ),
          };
        case ASSET_LV2.APARTMENT:
          return {
            label: "Quyền sử dụng đất/Lợi thế thương mại",
            children: (
              <PermissionUseApartment
                ref={btnRefPermissionUseLand}
                tablePP={_tablePP || []}
                tableKQ={data.tableKQ || []}
              />
            ),
          };
        case ASSET_LV2.PROJECT:
          return {
            label: "Quyền sử dụng đất/Lợi thế thương mại",
            children: (
              <PermissionUseProject
                ref={btnRefPermissionUseLand}
                tablePP={_tablePP || []}
                tableKQDat={data.tableKQDat || []}
                tableKQCTXD={data.tableKQCTXD || []}
                assetLevelTwoId={assetLevelTwoId}
              />
            ),
          };
        case ASSET_LV2.VEHICLE:
          return {
            label: "Phương tiện vận tải đường bộ",
            children: (
              <PermissionUseRoadVehicle
                ref={btnRefPermissionUseMoveableAsset}
                tablePP={_tablePP}
                tableKQDat={_tableKQDat}
              />
            ),
          };
        case ASSET_LV2.WATER_VEHICLE:
          return {
            label: "Phương tiện vận tải đường thuỷ",
            children: (
              <PermissionUseWaterVehicle
                ref={btnRefPermissionUseMoveableAsset}
                tablePP={_tablePP}
                tableKQDat={_tableKQDat}
              />
            ),
          };
        case ASSET_LV2.MACHINE:
          return {
            // 41 => MMTB; 42 => Dây chuyền
            label:
              data.assetLevelThreeIds?.[0] === ASSET_LV3.PRODUCTION_LINE
                ? "Dây chuyền"
                : "Máy móc thiết bị",
            children: (
              <PermissionUseMachineDevice
                ref={btnRefPermissionUseMoveableAsset}
                tablePP={_tablePP}
                tableKQ={_tableKQ}
                assetLevelThreeId={
                  data.assetLevelThreeIds?.[0] || ASSET_LV3.MACHINE
                }
              />
            ),
          };

        default:
          return {};
      }
    };
    useEffect(() => {
      if (data?.tableTong?.note || !noteValue) {
        setNoteValue(data?.tableTong?.note || "");
      }
    }, [data?.tableTong?.note]);

    if (!data && isLoading) return <Loading />;

    if (error) return <ComponentsError />;

    return (
      <Space direction="vertical" size="small" style={{ display: "flex" }}>
        <CollapseCustom
          defaultActiveKey={["1", "2"]}
          itemList={[
            {
              label: "Thông tin thẩm định",
              children: <ExpertiseInfo appraisalFileId={appraisalFileId} />,
            },
            {
              ...renderPermissionUse(),
            },
          ]}
        />
        <ResultExpertise
          tableTong={data?.tableTong}
          assetLevelTwoId={assetLevelTwoId}
        />
        <OtherNote noteValue={noteValue} setNoteValue={setNoteValue} />
        {assetLevelTwoId === ASSET_LV2.PROJECT ||
        assetLevelTwoId === ASSET_LV2.LAND ||
        assetLevelTwoId === ASSET_LV2.ESTIMATE ? (
          <ImageDiagram
            type={APPRAISAL_IMAGE_UPLOAD_TYPE.PROPERTY_VALUE_ASSET_IMAGE}
            ref={btnRefImagePropertyValue}
            assetImages={data?.assetImages || []}
            proposalCode={""}
            isRotating={false}
          />
        ) : null}

        <Row justify={"space-between"}>
          <Typography.Link
            className="commant-footer"
            underline
            onClick={() => setIsOpenModal(true)}
          >
            Lịch sử phê duyệt tờ trình
          </Typography.Link>
          {/* <Button type="link" onClick={() => setOpenMapModal(true)}>
            Xem bản đồ TSTĐ và các TSSS
          </Button> */}
          <Dropdown.Button
            menu={{
              items: [
                {
                  key: "1",
                  label: "Upload ảnh chụp bản đồ",
                  onClick: () => setOpenUploadModal(true),
                },
              ],
            }}
            trigger={["click"]}
            icon={<DownOutlined />}
            style={{
              width: "fit-content",
            }}
            onClick={() => setOpenMapModal(true)}
          >
            Xem bản đồ TSTĐ và các TSSS
          </Dropdown.Button>
        </Row>
        <ApprovalHistoryModal
          assetLevelTwoId={assetLevelTwoId}
          isOpen={isOpenModal}
          closeModal={() => setIsOpenModal(false)}
          staffs={staffs?.data || []}
          historyApproval={approvalInfo?.approvalHistoryDtos || []}
          signatureDate={appraisalFileData.signatureDate}
        />
        <Modal
          width={1200}
          footer={null}
          open={openMapModal}
          onCancel={() => setOpenMapModal(false)}
        >
          <LocateTstdAndTsss tablePP={data?.tablePP || []} />
        </Modal>

        <UploadImages
          appraisalFileId={appraisalFileId}
          proposalCode={appraisalFileData?.proposalCode || ""}
          reportCode={appraisalFileData?.reportCode || ""}
          openUploadModal={openUploadModal}
          setOpenUploadModal={setOpenUploadModal}
        />
      </Space>
    );
  }
);

export default memo(PropertyValue);
