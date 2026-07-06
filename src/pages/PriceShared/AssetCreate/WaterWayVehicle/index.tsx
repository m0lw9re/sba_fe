import { Button, Row, Select, Space, Typography } from 'antd';
import Commant from 'components/Commant';
import {
  AssetLevelThreeType,
  ComparedAssetWaterVehicleType,
} from 'constant/types';
import { setSelectedBeadCrumb } from 'pages/App/store/appSlice';
import StoredAssetWaterVehicleForm from 'pages/PriceShared/AssetCreate/WaterWayVehicle/TableAssetInfo';
import 'pages/PriceShared/AssetCreate/WaterWayVehicle/style.scss';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PRICE_SHARED_WATER_VEHICLE_CREATE_ASSET } from 'routes/route.constant';

// hook
import { useDebounce } from 'hooks/useDebounce';
import ModalChangeAsset from '../ModalChangeAsset';
import { ASSET_LV2, ASSET_LV3 } from 'constant/enums';
import { useAssetLevelThree } from 'utils/request';
import { RootState } from 'configs/configureStore';
import { BUTTON_CODES } from 'constant/common';
import { isNotAllowed } from 'utils/permission';

const WaterWayVehicle = () => {
  const dispatch = useDispatch();
  const { currentPagePermissions } = useSelector(
    (state: RootState) => state.globalSlice,
  );
  const btnSubmitForm = useRef<{
    onSubmit: () => any;
    setValues: (data: ComparedAssetWaterVehicleType[]) => void;
    values: ComparedAssetWaterVehicleType[];
  }>(null);

  const dataAssetLevelThrees = useAssetLevelThree(ASSET_LV2.WATER_VEHICLE);
  const [note, setNote] = useState<string>('');
  const debouncedNote = useDebounce(note, 250);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedAssetLevelThreeId, setSelectedAssetLevelThreeId] =
    useState<number>(ASSET_LV3.SHIP);
  const [tempSelectedValue, setTempValue] = useState<number | null>(null);

  const handleChangeAssetLevelThree = (value: number) => {
    setIsOpenModal(true);
    setTempValue(value);
  };
  const handleSubmit = async () => {
    await btnSubmitForm.current?.onSubmit();
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
  useEffect(() => {
    if (!btnSubmitForm.current?.values) return;
    const compareAssets = [...btnSubmitForm.current?.values] || [];
    btnSubmitForm.current?.setValues(
      compareAssets.map((item: any, index: number) => {
        item.description = note;
        return item;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNote]);

  useEffect(() => {
    let breadCrumb = [
      {
        label: 'Tạo tài sản so sánh',
        path: PRICE_SHARED_WATER_VEHICLE_CREATE_ASSET,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PRICE_SHARED_WATER_VEHICLE_CREATE_ASSET]);

  return (
    <div
      style={{ width: '100%' }}
      className='priced-shared-water-vehicle-create-container'
    >
      <div className='page-container'>
        <div className='header-wrapper'>
          <Space className='title-wrapper' style={{ display: 'flex' }} size={8}>
            <Typography className='title'>
              Tạo tài sản phương tiện đường thủy
            </Typography>
          </Space>
          <Space
            className='actions-wrapper'
            style={{ display: 'flex', justifyContent: 'end' }}
          >
            <Button className='btn-save' onClick={handleSubmit}
                disabled={
                  isNotAllowed(currentPagePermissions, BUTTON_CODES.ptdt_gui_duyet)
                }
            >
              Gửi duyệt
            </Button>
          </Space>
        </div>
        <Row className='select-asset-level-three-container' style={{marginBottom: '20px'}}>
          <Space
            className='title-wrapper'
            style={{ display: 'flex' }}
            size={16}
          >
            <Typography className='title'>Phân loại tài sản cấp 3</Typography>
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
        <Space direction='vertical' size={'small'} style={{ display: 'flex' }}>
          <StoredAssetWaterVehicleForm 
            assetLevelThreeId={selectedAssetLevelThreeId}
            ref={btnSubmitForm} 
            formType='add' 
          />
          <Commant
            value={note}
            onChange={e => {
              setNote(e);
            }}
          />
        </Space>
      </div>
    </div>
  );
};

export default WaterWayVehicle;
