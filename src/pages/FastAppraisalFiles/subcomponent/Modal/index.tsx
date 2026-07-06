import { Button, Modal, Row, Select, Space, Typography, message } from "antd";
import { assetCommonApi } from "apis/assetCommon";
import { ListSelect } from "constants/types/fastExpertiseAsset";
import "pages/FastAppraisalFiles/subcomponent/Modal/style.scss";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CREATE_FAST_EXPERTISE,
  CREATE_FAST_EXPERTISE_LAND_ESTATE,
} from "routes/route.constant";
interface PropsModal {
  modalAsk: boolean;
  showModal: () => void;
}

const ModalAsk = ({ modalAsk, showModal }: PropsModal) => {
  const [level1Code, setLevel1Code] = useState<number>();
  const [level2Code, setLevel2Code] = useState<number>();
  const [level3Code, setLevel3Code] = useState<number>();
  const [listLv1Asset, setListLv1Asset] = useState<ListSelect[]>();
  const [listLv2Asset, setListLv2Asset] = useState<ListSelect[]>();
  const [listLv3Asset, setListLv3Asset] = useState<ListSelect[]>();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const getAssetLv1 = useCallback(async () => {
    try {
      const res = await assetCommonApi.getAssetLevel1();
      const listData: ListSelect[] = res.data.map((item: any) => {
        return {
          value: item.assetLevelOneId,
          label: item.assetLevelOneName,
        };
      });
      setListLv1Asset(listData);
    } catch (error) {}
  }, []);
  const getAssetLv2 = useCallback(async (id: number) => {
    let lv1Code = id;
    try {
      const res = await assetCommonApi.getAssetLevel2(lv1Code);
      const listData: ListSelect[] = res.data.map((item: any) => {
        return {
          value: item.assetLevelTwoId,
          label: item.assetLevelTwoName,
        };
      });
      setListLv2Asset(listData);
    } catch (error) {}
  }, []);
  const getAssetLv3 = useCallback(async (id: number) => {
    let lv2Code = id;
    try {
      const res = await assetCommonApi.getAssetLevel3(lv2Code);
      const listData: ListSelect[] = res.data.map((item: any) => {
        return {
          value: item.assetLevelThreeId,
          label: item.assetLevelThreeName,
        };
      });
      setListLv3Asset(listData);
    } catch (error) {}
  }, []);
  const error = () => {
    messageApi.open({
      type: "error",
      content: "Vui lòng chọn loại tài sản",
    });
  };
  const onOke = () => {
    let data = level1Code && level2Code && level3Code;
    let listId = {
      lv1Id: level1Code,
      lv2Id: level2Code,
      lv3Id: level3Code,
    };
    if (data) {
      switch (level1Code) {
        case 1:
          switch (level2Code) {
            case 1:
              navigate(CREATE_FAST_EXPERTISE_LAND_ESTATE, {
                state: { listId },
              });
              break;
            case 2:
              navigate(CREATE_FAST_EXPERTISE, { state: { listId } });
              break;
            default:
              navigate(CREATE_FAST_EXPERTISE, { state: { listId } });
              break;
          }
          break;
        case 2:
          switch (level2Code) {
            case 4:
              switch (level3Code) {
                case 10:
                  navigate(CREATE_FAST_EXPERTISE, { state: { listId } });
                  break;
                default:
                  navigate(CREATE_FAST_EXPERTISE, { state: { listId } });
                  break;
              }
              break;
            default:
              navigate(CREATE_FAST_EXPERTISE, { state: { listId } });
              break;
          }
          break;
        default:
          navigate(CREATE_FAST_EXPERTISE, { state: { listId } });
          break;
      }
    } else {
      error();
    }
  };
  const onCancel = () => {
    showModal();
    setLevel1Code(undefined);
    setLevel2Code(undefined);
    setLevel3Code(undefined);
  };
  const onChangeSelect1 = (value: number) => {
    setLevel1Code(value);
    setLevel2Code(undefined);
    setLevel3Code(undefined);
    getAssetLv2(value);
  };
  const onChangeSelect2 = (value: number) => {
    setLevel2Code(value);
    setLevel3Code(undefined);
    getAssetLv3(value);
  };
  const onChangeSelect3 = (value: number) => {
    setLevel3Code(value);
  };

  useEffect(() => {
    getAssetLv1();
  }, [getAssetLv1]);
  return (
    <Modal
      open={modalAsk}
      title="Chọn loại tài sản"
      onCancel={onCancel}
      onOk={onOke}
      footer={[
        <Button key="back" onClick={onCancel}>
          Huỷ bỏ
        </Button>,
        <Button key="link" type="primary" onClick={onOke}>
          Đồng ý
        </Button>,
      ]}
    >
      {contextHolder}
      <Space direction="vertical" size={16} style={{ width: " 100%" }}>
        <Row className="modal-choose-type-item">
          <Space direction="vertical" style={{ width: " 100%" }} size={8}>
            <Typography>Tài sản cấp 1</Typography>
            <Select
              allowClear
              className="ant-select"
              onChange={onChangeSelect1}
              style={{ width: "100%" }}
              placeholder="Chọn loại tài sản"
              value={level1Code}
              options={listLv1Asset}
            />
          </Space>
        </Row>
        <Row className="modal-choose-type-item">
          <Space direction="vertical" style={{ width: " 100%" }} size={8}>
            <Typography>Tài sản cấp 2</Typography>
            <Select
              allowClear
              value={level2Code}
              className="ant-select"
              onChange={onChangeSelect2}
              style={{ width: "100%" }}
              placeholder="Chọn loại tài sản"
              options={listLv2Asset}
            />
          </Space>
        </Row>
        <Row className="modal-choose-type-item">
          <Space direction="vertical" style={{ width: " 100%" }} size={8}>
            <Typography>Tài sản cấp 3</Typography>
            <Select
              allowClear
              className="ant-select"
              value={level3Code}
              onChange={onChangeSelect3}
              placeholder="Chọn loại tài sản"
              style={{ width: "100%" }}
              options={listLv3Asset}
            />
          </Space>
        </Row>
      </Space>
    </Modal>
  );
};

export default ModalAsk;
