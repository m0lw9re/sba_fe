import { Space } from 'antd';
import ButtonCustom from 'components/ButtonCustom';
import { FC, useRef } from 'react';

interface EditFormProps {
  ref: React.RefObject<{
    onCreateAsset: () => any;
  }>;
  assetType: number;
  data: any;
  dataEdit?: any;
  formType?: 'add' | 'edit';
  assetLevelThreeId?: number;
}

type Props = {
  handleAddTSSS: (assetIds: string[]) => void;
  closeModal: () => void;
  createForm: FC<EditFormProps>;
  assetType: number;
  dataEdit?: any;
  assetLevelThreeId?: number;
};

const EditCompareAssetForm: FC<Props> = ({
  handleAddTSSS,
  closeModal,
  createForm: EditForm,
  assetType,
  dataEdit,
  assetLevelThreeId
}) => {
  const btnCreateAssetRef = useRef<{
    onCreateAsset: () => any;
  }>(null);
  const handleSave = async () => {
    const data = await btnCreateAssetRef.current?.onCreateAsset();
    if (data && data?.length > 0) {
      handleAddTSSS([...data]);
      closeModal();
    }
  };
  return (
    <Space direction='vertical' style={{ padding: '8px', width: '100%' }}>
      <EditForm
        ref={btnCreateAssetRef}
        assetType={assetType}
        data={dataEdit}
        formType={'edit'}
        assetLevelThreeId={assetLevelThreeId}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'right',
          gap: '8px',
        }}
      >
        <ButtonCustom label='Hủy bỏ' onClick={closeModal} />
        <ButtonCustom
          label='Lưu'
          type='primary'
          bgColor='rgba(40, 98, 175, 1)'
          onClick={handleSave}
          htmlType='submit'
        />
      </div>
    </Space>
  );
};

export default EditCompareAssetForm;
