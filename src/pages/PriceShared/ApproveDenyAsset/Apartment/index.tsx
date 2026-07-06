import { Button, Row, Space, Typography, message } from "antd";
import Commant from "components/Commant";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import "pages/PriceShared/ApproveDenyAsset/Apartment/style.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  PRICE_SHARED_PENDIND,
  PRICE_SHARED_APPROVE_APPARTMENT,
} from "routes/route.constant";
import { useAssetStoredDetail } from "utils/request";
import TableAssetInfo from "pages/PriceShared/ApproveDenyAsset/Apartment/TableAssetInfo";
import { randomId } from "utils";
import { compareAssetsAPI } from "apis/compareAssets";
import ConfirmApproveModal from "pages/PriceShared/ApproveDenyAsset/subcomponents/ConfirmApproveModal";
import { ASSET_PRICES_SHARED_TYPE, BUTTON_CODES } from "constant/common";
import { isNotAllowed } from "utils/permission";
import { RootState } from "configs/configureStore";

const Apartment = () => {
  let { id }: { id?: string } = useParams();
  const { data: assetInfor, mutate } = useAssetStoredDetail(ASSET_PRICES_SHARED_TYPE.APARTMENT, id || "");
  const { currentPagePermissions } = useSelector(
    (state: RootState) => state.globalSlice,
  );
  const [noteApprove, setNoteApprove] = useState<string>('');

  useEffect(() => {
    if (assetInfor?.data) 
      setNoteApprove(assetInfor?.data.sentiment);
  }, [assetInfor]);

  const handleChangeNoteApprove = (value: string) => {
    setNoteApprove(value);
  };

  const [modalParams, setModalParams] = useState<{
    isOpen: boolean;
    type: "approve" | "deny";
  }>({
    isOpen: false,
    type: "approve",
  });

  const handleCloseModal = () => {
    setModalParams({ ...modalParams, isOpen: false });
  };
  
  const handleOpenModal = (type: "approve" | "deny") => {
    if (type === "approve") {
      setModalParams({ type: "approve", isOpen: true });
    } else setModalParams({ type: "deny", isOpen: true });
  };

  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh sách chờ phê duyệt",
        path: PRICE_SHARED_PENDIND,
      },
      {
        label: "Phê duyệt tài sản",
        path: PRICE_SHARED_APPROVE_APPARTMENT.replace(":id", id || ""),
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PRICE_SHARED_APPROVE_APPARTMENT]);

  
  const handleApproveOrDeny = async () => {
    if (assetInfor?.data?.assetId) {
      try {
        const response = await compareAssetsAPI.updateStoredAsset(
          {
            ...assetInfor?.data,
            assetId: assetInfor.data.assetId,
            approved: modalParams.type === "approve" ? true : false,
            sentimentApproved: noteApprove,
          },
          ASSET_PRICES_SHARED_TYPE.APARTMENT
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
            <Typography className="title">Phê duyệt tài sản Căn hộ chung cư</Typography>
            <Space>
              <Button disabled={(assetInfor?.data && assetInfor?.data.approved) !== null || isNotAllowed(currentPagePermissions, BUTTON_CODES.ct_tsss_tu_choi)}
                className="btn-bottom"
                style={{ backgroundColor: "#F25B60" }}
                onClick={() => handleOpenModal("deny")}

              >
                Từ chối
              </Button>
              <Button  disabled={(assetInfor?.data && assetInfor?.data.approved !== null) || isNotAllowed(currentPagePermissions, BUTTON_CODES.ct_tsss_phe_duyet)}
                className="btn-bottom"
                style={{ backgroundColor: "#2862AF" }}
                onClick={() => handleOpenModal("approve")}
              >
                Phê duyệt
              </Button>
            </Space>
          </Row>
          <Space direction="vertical" size={"small"} style={{ width: "100%" }}>
            <TableAssetInfo
              compareAssets={[{ ...assetInfor?.data, key: randomId() }]}
            />
            <Commant value={noteApprove} onChange={handleChangeNoteApprove} />
          </Space>
        </Space>
      </div>
    </div>
  );
};

export default Apartment;
