import { CloseOutlined } from '@ant-design/icons';
import { Button, Modal, Row, Space } from 'antd';
import CardTitleCustomUpdate from 'components/CardTitleCustomUpdate';
import React, { FC } from 'react';
import EditCompareAssetForm from './EditCompareAssetForm';
import './style.scss';

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  onSave: (data: any) => void;
  defaultSelectedTSSS: any[];
  createForm: FC<any>;
  assetType: number;
  dataEdit: any;
  assetLevelThreeId?: number;
};

const EditTSSSModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  onSave,
  defaultSelectedTSSS,
  createForm,
  assetType,
  dataEdit,
  assetLevelThreeId,
}) => {

  const handleEditTSSS = (assetIds: string[]) => {
    const _tmpArr = [...assetIds];
    onSave(_tmpArr);
  };

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      maskClosable={false}
      footer={null}
      onCancel={closeModal}
      className='modalAddCompareAsset'
    >
      <Space
        direction='vertical'
        align='center'
        size={'small'}
        style={{ width: '100%' }}
      >
        {/* heading */}
        <Row
          justify={'space-between'}
          align={'middle'}
          style={{ padding: '4px 4px 0 4px', marginBottom: '-6px' }}
        >
          <CardTitleCustomUpdate title='Chỉnh sửa tài sản so sánh' />
          <Button
            shape='circle'
            icon={<CloseOutlined />}
            onClick={closeModal}
          />
        </Row>
        <Row>
          <EditCompareAssetForm
            handleAddTSSS={handleEditTSSS}
            closeModal={closeModal}
            createForm={createForm}
            assetType={assetType}
            dataEdit={dataEdit}
            assetLevelThreeId={assetLevelThreeId}
          />
        </Row>
      </Space>
    </Modal>
  );
};
export default EditTSSSModal;
