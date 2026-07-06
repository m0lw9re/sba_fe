import { Button, message, Row, Select, Space, Typography } from "antd";
import Commant from "components/Commant";
import { ASSET_LV2, ASSET_LV3 } from "constant/enums";
import {
  AssetLevelThreeType,
  ComparedAssetRoadVehicleCreateType,
} from "constant/types";
import { useDebounce } from "hooks/useDebounce";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import StoredAssetRoadVehicleForm from "pages/PriceShared/AssetCreate/RoadVehicle/TableAssetInfo";
import "pages/PriceShared/AssetCreate/RoadVehicle/style.scss";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PRICE_SHARED_ROAD_VEHICLE_CREATE_ASSET } from "routes/route.constant";
import { useAssetLevelThree } from "utils/request";
import ModalChangeAsset from "../ModalChangeAsset";
import { RootState } from "configs/configureStore";
import { isNotAllowed } from "utils/permission";
import { BUTTON_CODES } from "constant/common";

const RoadVehicle = () => {
  const dispatch = useDispatch();
  const { currentPagePermissions } = useSelector(
    (state: RootState) => state.globalSlice,
  );
  const btnSubmitForm = useRef<{
    onSubmit: () => any;
    setValues: (data: ComparedAssetRoadVehicleCreateType[]) => void;
    values: ComparedAssetRoadVehicleCreateType[];
  }>(null);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [note, setNote] = useState<string>("");
  const debouncedNote = useDebounce(note, 250);
  const [selectedAssetLevelThreeId, setSelectedAssetLevelThreeId] =
    useState<number>(ASSET_LV3.CAR);

  const [tempSelectedValue, setTempValue] = useState<number | null>(null);

  const handleChangeAssetLevelThree = (value: number) => {
    setIsOpenModal(true);
    setTempValue(value);
  };

  const handleConfirm = () => {
    if (tempSelectedValue === null) {
      return;
    }
    setSelectedAssetLevelThreeId(tempSelectedValue);

    setTempValue(null);

    setIsOpenModal(false);
  };

  const handleCloseModal = () => {
    setTempValue(null);
    setIsOpenModal(false);
  };

  // Lấy danh sách tài sản level3
  const dataAssetLevelThrees = useAssetLevelThree(ASSET_LV2.VEHICLE);

  const handleSubmit = () => {
    btnSubmitForm.current?.onSubmit();
  };

  // update note to every asset
  useEffect(() => {
    if (!btnSubmitForm.current?.values) return;
    const compareAssets = [...btnSubmitForm.current?.values] || [];
    btnSubmitForm.current?.setValues(
      compareAssets.map((item: any, index: number) => {
        item.description = note;
        return item;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNote]);

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Tạo tài sản so sánh",
        path: PRICE_SHARED_ROAD_VEHICLE_CREATE_ASSET,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PRICE_SHARED_ROAD_VEHICLE_CREATE_ASSET]);

  return (
    <div
      style={{ width: "100%" }}
      className="priced-shared-road-vehicle-create-container"
    >
      <div className="page-container">
        <div className="header-wrapper">
          <Space className="title-wrapper" style={{ display: "flex" }} size={8}>
            <Typography className="title">
              Tạo tài sản phương tiện đường bộ
            </Typography>
          </Space>
          <Space
            className="actions-wrapper"
            style={{ display: "flex", justifyContent: "end" }}
          >
            <Button className="btn-save" onClick={handleSubmit}
                disabled={
                  isNotAllowed(currentPagePermissions, BUTTON_CODES.ptdb_gui_duyet)
                }
            >
              Gửi duyệt
            </Button>
          </Space>
        </div>
        <Row className="select-asset-level-three-container">
          <Space
            className="title-wrapper"
            style={{ display: "flex" }}
            size={16}
          >
            <Typography className="title">Phân loại tài sản cấp 3</Typography>
            <Select
              value={selectedAssetLevelThreeId}
              style={{ width: 300 }}
              onChange={handleChangeAssetLevelThree}
              options={
                dataAssetLevelThrees?.data?.map((item: AssetLevelThreeType) => {
                  return {
                    label: item.assetLevelThreeName,
                    value: item.assetLevelThreeId,
                  };
                }) || []
              }
            />
          </Space>
          <ModalChangeAsset
            isOpenModal={isOpenModal}
            closeModal={handleCloseModal}
            handleConfirm={handleConfirm}
          />
        </Row>
        <Space direction="vertical" size={"small"} style={{ display: "flex" }}>
          <StoredAssetRoadVehicleForm
            assetLevelThreeId={selectedAssetLevelThreeId}
            ref={btnSubmitForm}
            formType="add"
          />
          <Commant
            value={note}
            onChange={(e) => {
              setNote(e);
            }}
          />
        </Space>
      </div>
    </div>
  );
};

export default RoadVehicle;
