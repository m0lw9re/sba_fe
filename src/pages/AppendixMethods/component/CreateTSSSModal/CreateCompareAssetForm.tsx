import { Space } from "antd";
import ButtonCustom from "components/ButtonCustom";
import { FC, useRef } from "react";

interface CreateFormProps {
  ref: React.RefObject<{
    onCreateAsset: () => any;
  }>;
  assetType: number;
  formType?: "add" | "edit";
  assetLevelThreeId?: number;
  initAsset?: any;
}

type Props = {
  handleAddTSSS: (assetIds: string[]) => void;
  closeModal: () => void;
  createForm: FC<CreateFormProps>;
  assetType: number;
  assetLevelThreeId?: number;
  initAsset?: any;
};

const CompareAssetForm: FC<Props> = ({
  handleAddTSSS,
  closeModal,
  createForm: CreateForm,
  assetType,
  assetLevelThreeId,
  initAsset,
}) => {
  const btnCreateAssetRef = useRef<{
    onCreateAsset: () => any;
  }>(null);
  const handleSave = async () => {
    const data = await btnCreateAssetRef.current?.onCreateAsset();
    if (!Array.isArray(data) || data?.length === 0) {
      return;
    }
    const ids = data.filter((item: string | null) => item !== null) as string[];
    if (ids.length === 0) {
      return;
    }
    handleAddTSSS(ids);
  };
  return (
    <Space direction="vertical" style={{ padding: "8px", width: "100%" }}>
      <CreateForm
        ref={btnCreateAssetRef}
        assetType={assetType}
        formType={"add"}
        assetLevelThreeId={assetLevelThreeId}
        initAsset={initAsset}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "right",
          gap: "8px",
        }}
      >
        <ButtonCustom label="Hủy bỏ" onClick={closeModal} />
        <ButtonCustom
          label="Lưu"
          type="primary"
          bgColor="rgba(40, 98, 175, 1)"
          onClick={handleSave}
          htmlType="submit"
        />
      </div>
    </Space>
  );
};

export default CompareAssetForm;
