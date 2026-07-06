import { CloseOutlined } from "@ant-design/icons";
import { Button, Modal, Row, Space } from "antd";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { TabsCustom } from "components/TabsCustom";
import React, { FC, useEffect, useState } from "react";
import CompareAssetModalTable from "pages/AppendixMethods/component/CreateTSSSModal/CompareAssetModalTable";
import CompareAssetModalRoadVehicleTable from "pages/AppendixMethods/component/CreateTSSSModal/RoadVehicle/CompareAssetModalTable";
import CompareAssetModalMachineTable from "pages/AppendixMethods/component/CreateTSSSModal/Machine/CompareAssetModalTable";
import CompareAssetForm from "pages/AppendixMethods/component/CreateTSSSModal/CreateCompareAssetForm";
import "./style.scss";
import { FilterSpecificPricesType } from "constant/types";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
import { randomId } from "utils";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  onSave: (data: any) => void;
  defaultSelectedTSSS: any[];
  createForm: FC<any>;
  assetType: number;
  assetLevelThreeId?: number;
};

const AddCompareAssetModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  onSave,
  defaultSelectedTSSS,
  createForm,
  assetType,
  assetLevelThreeId,
}) => {
  const [selectedTSSS, setSelectedTSSS] = useState<any[]>([]);

  const [tabIndex, setTabIndex] = useState<string>("1");

  const [assetForCopy, setAssetForCopy] = useState<any>(null);

  // if (error) return <div><ComponentsError />liệu</div>;
  const handleSaveTSSS = () => {
    onSave(selectedTSSS);
    closeModal();
  };

  const handleAddTSSS = (assetIds: string[]) => {
    const _tmpArr = [...selectedTSSS, ...assetIds];
    onSave(_tmpArr);
    setTabIndex("1");
  };

  const [filter, setFilter] = useState<FilterSpecificPricesType>({
    dateFrom: null,
    dateTo: null,
  });

  useEffect(() => {
    if (defaultSelectedTSSS) {
      setSelectedTSSS(defaultSelectedTSSS);
    }
  }, [JSON.stringify(defaultSelectedTSSS)]);

  const handleResolvedAssetCopy = (data: any) => {
    if (!data) return;
    setAssetForCopy({ ...data, approved: null, key: randomId() });
    setTabIndex("2");
  };

  const renderCompareAssetModalTable = () => {
    switch (assetType) {
      // Phương tiện đường bộ
      case ASSET_PRICES_SHARED_TYPE.ROAD_VEHICLE:
        return {
          label: "Tài sản so sánh hiện có",
          key: "1",
          forceRender: true,
          children: (
            <CompareAssetModalRoadVehicleTable
              selectedTSSS={selectedTSSS}
              setSelectedTSSS={setSelectedTSSS}
              tabIndex={tabIndex}
              assetType={assetType}
              assetLevelThreeId={assetLevelThreeId}
              setAssetForCopy={handleResolvedAssetCopy}
            />
          ),
        };
      case ASSET_PRICES_SHARED_TYPE.WATERWAY_VEHICLE:
        return {
          label: "Tài sản so sánh hiện có",
          key: "1",
          forceRender: true,
          children: (
            <CompareAssetModalRoadVehicleTable
              selectedTSSS={selectedTSSS}
              setSelectedTSSS={setSelectedTSSS}
              tabIndex={tabIndex}
              assetType={assetType}
              assetLevelThreeId={assetLevelThreeId}
              setAssetForCopy={handleResolvedAssetCopy}
            />
          ),
        };
      case ASSET_PRICES_SHARED_TYPE.DEVICE:
        return {
          label: "Tài sản so sánh hiện có",
          key: "1",
          forceRender: true,
          children: (
            <CompareAssetModalMachineTable
              selectedTSSS={selectedTSSS}
              setSelectedTSSS={setSelectedTSSS}
              tabIndex={tabIndex}
              assetType={assetType}
              setAssetForCopy={handleResolvedAssetCopy}
            />
          ),
        };
      default:
        return {
          label: "Tài sản so sánh hiện có",
          key: "1",
          forceRender: true,
          children: (
            <CompareAssetModalTable
              selectedTSSS={selectedTSSS}
              setSelectedTSSS={setSelectedTSSS}
              tabIndex={tabIndex}
              assetType={assetType}
              filters={filter}
              setFilters={setFilter}
              setAssetForCopy={handleResolvedAssetCopy}
            />
          ),
        };
    }
  };

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      maskClosable={false}
      onCancel={closeModal}
      className="modalAddCompareAsset"
    >
      <Space
        direction="vertical"
        align="center"
        size={"small"}
        style={{ width: "100%" }}
      >
        {/* heading */}
        <Row
          justify={"space-between"}
          align={"middle"}
          style={{ padding: "4px 4px 0 4px", marginBottom: "-6px" }}
        >
          <CardTitleCustomUpdate title="Thêm tài sản so sánh" />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={closeModal}
            size="small"
          />
        </Row>
        <TabsCustom
          activeKey={tabIndex}
          onChange={(value: string) => setTabIndex(value)}
          style={{ padding: "0 4px" }}
          className={"tab-assets"}
          items={[
            {
              ...renderCompareAssetModalTable(),
            },
            {
              label: "Thêm mới tài sản so sánh",
              key: "2",
              children: (
                <CompareAssetForm
                  handleAddTSSS={handleAddTSSS}
                  closeModal={closeModal}
                  createForm={createForm}
                  assetType={assetType}
                  assetLevelThreeId={assetLevelThreeId}
                  initAsset={assetForCopy}
                />
              ),
            },
          ]}
        />

        {/* footer */}
        <div
          style={{
            display: tabIndex === "2" ? "none" : "flex",
            justifyContent: "right",
            gap: "8px",
            padding: "8px",
          }}
        >
          <ButtonCustom label="Hủy bỏ" onClick={closeModal} />

          <ButtonCustom
            label="Lưu"
            type="primary"
            htmlType="submit"
            bgColor="rgba(40, 98, 175, 1)"
            onClick={handleSaveTSSS}
          />
        </div>
      </Space>
    </Modal>
  );
};
export default AddCompareAssetModal;
