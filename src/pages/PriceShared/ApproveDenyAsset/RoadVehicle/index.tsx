import { Button, Row, Space, Typography, message } from "antd";
import { compareAssetsAPI } from "apis/compareAssets";
import { ASSET_PRICES_SHARED_TYPE, BUTTON_CODES } from "constant/common";
import { ASSET_LV3, LOCAL_STORAGE_KEY } from "constant/enums";
import { ComparedAssetRoadVehicleCreateType } from "constant/types";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import ConfirmApproveModal from "pages/PriceShared/ApproveDenyAsset/subcomponents/ConfirmApproveModal";
import "./style.scss";
import StoredAssetRoadVehicleForm from "pages/PriceShared/AssetCreate/RoadVehicle/TableAssetInfo";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  PRICE_SHARED_APPROVE_ROADVEHICLE,
  PRICE_SHARED_DENY,
  PRICE_SHARED_PENDIND,
} from "routes/route.constant";
import { useAssetStoredDetail } from "utils/request";
import { getRoleAccount } from "utils/common";
import { RootState } from "configs/configureStore";
import { isNotAllowed } from "utils/permission";

const RoadVehicle = () => {
  let { id }: { id?: string } = useParams();
  const { data: assetInfor, mutate } = useAssetStoredDetail(
    ASSET_PRICES_SHARED_TYPE.ROAD_VEHICLE,
    id || ""
  );
  const { currentPagePermissions } = useSelector(
    (state: RootState) => state.globalSlice,
  );
  const [formType, setFormType] = useState<"add" | "edit" | "view">("view");
  const [noteApprove, setNoteApprove] = useState<string>("");
  const [typeAction, setTypeAction] = useState<any>(null);

  const [roles, setRoles] = useState<Array<string>>();

  const [modalParams, setModalParams] = useState<{
    isOpen: boolean;
    type: "approve" | "deny";
  }>({
    isOpen: false,
    type: "approve",
  });

  useEffect(() => {
    if (assetInfor?.data) setNoteApprove(assetInfor?.data.description);
    setRoles(
      getRoleAccount(localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)) || []
    );
  }, [assetInfor]);

  const btnSubmitForm = useRef<{
    onSubmit: () => any;
    setValues: (data: ComparedAssetRoadVehicleCreateType[]) => void;
    values: ComparedAssetRoadVehicleCreateType[];
  }>(null);

  useEffect(() => {
    if (btnSubmitForm.current?.values && assetInfor?.data) {
      const assetInfo = assetInfor?.data;
      btnSubmitForm.current?.setValues([
        {
          ...assetInfo,
          remainQuality: assetInfo.remainQuality * 100,
          addressProvince:
            assetInfo?.provinces?.code || assetInfo?.addressProvince,
          addressDistrict:
            assetInfo?.districts?.code || assetInfo?.addressDistrict,
          addressWard: assetInfo?.wards?.code || assetInfo?.addressWard,
        },
      ]);
      setTypeAction(assetInfo.approved === false);
    }
  }, [JSON.stringify(assetInfor?.data)]);

  useEffect(() => {
    if (assetInfor?.data) setNoteApprove(assetInfor?.data.description);
  }, [assetInfor]);

  const handleCloseModal = () => {
    setModalParams({ ...modalParams, isOpen: false });
  };

  const handleOpenModal = (type: "approve" | "deny") => {
    if (type === "approve") {
      setModalParams({ type: "approve", isOpen: true });
    } else setModalParams({ type: "deny", isOpen: true });
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let breadCrumb = [
      typeAction
        ? {
            label: "Danh sách từ chối",
            path: PRICE_SHARED_DENY,
          }
        : {
            label: "Danh sách chờ phê duyệt",
            path: PRICE_SHARED_PENDIND,
          },
      {
        label: typeAction ? "Tài sản từ chối" : "Phê duyệt tài sản",
        path: PRICE_SHARED_APPROVE_ROADVEHICLE.replace(":id", id || ""),
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [PRICE_SHARED_APPROVE_ROADVEHICLE, typeAction]);

  const handleApproveOrDeny = async () => {
    if (assetInfor?.data?.assetId) {
      try {
        const response = await compareAssetsAPI.updateStoredAsset(
          {
            ...assetInfor?.data,
            assetId: assetInfor.data.assetId,
            approved: modalParams.type === "approve" ? true : false,
            description: noteApprove,
          },
          ASSET_PRICES_SHARED_TYPE.ROAD_VEHICLE
        );
        if (response?.data?.code === 200) {
          modalParams.type === "approve"
            ? message.success(`Phê duyệt ${response.data.message}`)
            : message.success(`Từ chối ${response.data.message}`);
        } else {
          modalParams.type === "approve"
            ? message.success(`Phê duyệt ${response.data.message}`)
            : message.success(`Từ chối ${response.data.message}`);
        }
      } catch {
        modalParams.type === "approve"
          ? message.error(`Phê duyệt thất bại`)
          : message.error(`Từ chối thất bại`);
      }
      handleCloseModal();
      mutate();
    }
  };

  const handleSubmit = async () => {
    const response = await btnSubmitForm.current?.onSubmit();
    if (response) {
      navigate(PRICE_SHARED_DENY);
    }
  };

  return (
    <div
      style={{ width: "100%" }}
      className="approve-deny-asset-land-using-container"
    >
      <ConfirmApproveModal
        closeModal={handleCloseModal}
        handleConfirm={handleApproveOrDeny}
        isOpen={modalParams.isOpen}
        type={modalParams.type}
      />
      <div className="page-container">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row justify={"space-between"}>
            <Typography className="title">
              {typeAction
                ? "Tài sản PT đường bộ"
                : "Phê duyệt tài sản PT đường bộ"}
            </Typography>
            {roles?.includes("ROLE_CVTD") && (
              <Space>
                <Button
                  className="btn-bottom"
                  style={{ backgroundColor: "#F25B60" }}
                  onClick={
                    typeAction
                      ? () =>
                          setFormType((prev) =>
                            prev === "edit" ? "view" : "edit"
                          )
                      : () => handleOpenModal("deny")
                  }
                  // disabled={(assetInfor?.data && assetInfor?.data.approved) !== null && true}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  className="btn-bottom"
                  style={{ backgroundColor: "#2862AF" }}
                  onClick={
                    typeAction ? handleSubmit : () => handleOpenModal("approve")
                  }
                  // disabled={(assetInfor?.data && assetInfor?.data.approved) !== null && true}
                >
                  Gửi duyệt lại
                </Button>
              </Space>
            )}
            {(roles?.includes("ROLE_ADMIN") ||
              roles?.includes("ROLE_PTGĐ") ||
              roles?.includes("ROLE_TGĐ") ||
              roles?.includes("ROLE_GĐCN") ||
              roles?.includes("ROLE_TPTĐG") ||
              roles?.includes("ROLE_TPTGĐ") ||
              roles?.includes("ROLE_PPTĐG") ||
              roles?.includes("ROLE_TPCNHN") ||
              roles?.includes("ROLE_TBP") ||
              roles?.includes("ROLE_PGĐCN")) && (
              <Space className="approve-true">
                <Button
                  disabled={
                    ((assetInfor?.data && assetInfor?.data.approved) !== null) || isNotAllowed(currentPagePermissions, BUTTON_CODES.ct_tsss_tu_choi)
                  }
                  className="btn-bottom"
                  style={{ backgroundColor: "#F25B60" }}
                  onClick={() => handleOpenModal("deny")}
                >
                  Từ chối
                </Button>
                <Button
                  disabled={
                    (assetInfor?.data &&
                    assetInfor?.data.approved !== null)  || isNotAllowed(currentPagePermissions, BUTTON_CODES.ct_tsss_phe_duyet)
                  }
                  className="btn-bottom"
                  style={{ backgroundColor: "#2862AF" }}
                  onClick={() => handleOpenModal("approve")}
                >
                  Phê duyệt
                </Button>
              </Space>
            )}
          </Row>
          <StoredAssetRoadVehicleForm
            ref={btnSubmitForm}
            formType={formType}
            assetLevelThreeId={assetInfor?.data?.type || ASSET_LV3.CAR}
          />
        </Space>
      </div>
    </div>
  );
};

export default RoadVehicle;
