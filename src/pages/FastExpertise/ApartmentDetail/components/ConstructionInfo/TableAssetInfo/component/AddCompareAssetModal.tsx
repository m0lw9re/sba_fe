import { CloseOutlined } from "@ant-design/icons";
import { Button, Modal, Row, Space } from "antd";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { useEffect, useState } from "react";
import CompareAssetModalTable from "./CompareAssetModalTable";
import CreateCompareAssetForm from "./CreateCompareAssetForm";
import "./style.scss";
import { TabsCustom } from "components/TabsCustom";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  onSave: (data: any) => void;
  defaultSelectedTSSS: any[];
};

const AddCompareAssetModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  onSave,
  defaultSelectedTSSS,
}) => {
  const [selectedTSSS, setSelectedTSSS] = useState<any[]>([]);

  const [tabIndex, setTabIndex] = useState<string>("1");

  // if (error) return <div><ComponentsError />liệu</div>;
  const handleSaveTSSS = () => {
    onSave(selectedTSSS);
    closeModal();
  };

  const handleAddTSSS = (assetId: string) => {
    const _tmpArr = [...selectedTSSS, assetId];
    onSave(_tmpArr);
    closeModal();
  };

  useEffect(() => {
    if (defaultSelectedTSSS) {
      setSelectedTSSS(defaultSelectedTSSS);
    }
  }, [defaultSelectedTSSS]);

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
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
            shape='circle'
            icon={<CloseOutlined />}
            onClick={closeModal}
            size='small'
          />
        </Row>
        <TabsCustom
          activeKey={tabIndex}
          onChange={(value: string) => setTabIndex(value)}
          style={{ padding: "0 4px" }}
          className={"tab-assets"}
          items={[
            {
              label: "Tài sản so sánh hiện có",
              key: "1",
              forceRender: true,
              children: (
                <CompareAssetModalTable
                  selectedTSSS={selectedTSSS}
                  setSelectedTSSS={setSelectedTSSS}
                />
              ),
            },
            {
              label: "Thêm mới tài sản so sánh",
              key: "2",
              forceRender: true,
              children: (
                <CreateCompareAssetForm
                  handleAddTSSS={handleAddTSSS}
                  closeModal={closeModal}
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
            label='Lưu'
            type='primary'
            htmlType='submit'
            bgColor='rgba(40, 98, 175, 1)'
            onClick={handleSaveTSSS}
          />
        </div>
      </Space>
    </Modal>
  );
};
export default AddCompareAssetModal;
