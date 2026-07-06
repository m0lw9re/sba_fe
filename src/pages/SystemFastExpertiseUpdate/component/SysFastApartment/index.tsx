import { Space, message } from "antd";
import SysFastRealPurposeTable from "./SysFastRealPurposeTable";
import SysUtilitiesTable from "./SysUtilitiesTable";
import FormItem from "components/InputFields/FormItem";
import { TYPE_FIELD } from "constants/enums";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { useEffect, useState } from "react";
import { useSystemFast } from "utils/request/useSystemFastRealEstate";
import ButtonCustom from "components/ButtonCustom";
import { systemApi } from "apis/system";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
const { INPUT_NUMBER } = TYPE_FIELD;

const SystemFastRealEstate = () => {
  const { data, isLoading, mutate } = useSystemFast(
    { page: 1, limit: 100 },
    { type: 2, assetType: ASSET_PRICES_SHARED_TYPE.APARTMENT }
  );
  const [timeConfig, setTimeConfig] = useState<any>(null);
  const [tienIchConfig, setTienIchConfig] = useState<any>(null);
  const [matThoangConfig, setMatThoangConfig] = useState<any>(null);
  const [nhomTangConfig, setNhomTangConfig] = useState<any>(null);
  const [tienIchObject, setTienIchObject] = useState<any>(null);
  const [matThoangObject, setMatThoangObject] = useState<any>(null);
  const [nhomTangObject, setNhomTangObject] = useState<any>(null);
  const [editable, setEditable] = useState<boolean>(false);
  const [editableTienIch, setEditableTienIch] = useState<boolean>(false);
  const [editableMatThoang, setEditableMatThoang] = useState<boolean>(false);
  const [editableNhomTang, setEditableNhomTang] = useState<boolean>(false);

  const handleSaveEdit = async () => {
    const timeConfigUpdate = {
      ...data?.data?.[0],
      rateId: timeConfig,
      assetType: ASSET_PRICES_SHARED_TYPE.APARTMENT,
    };
    try {
      const res = await systemApi.updateFastExpRealEstate(timeConfigUpdate);
      if (res.data.code === 200) {
        message.success("Cập nhật thành công");
        mutate();
        setEditable(false);
      } else message.error("Cập nhật thất bại");
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };
  const handleCancel = () => {
    setEditable(false);
    setTimeConfig(data?.data?.[0]?.rateId);
  };
  const handleCancelType = (type: any, reset = true) => {
    if (type == 0) {
      setEditableTienIch(false);
      if (reset) {
        setTienIchConfig(tienIchObject?.ratePerMain);
      }
    }
    if (type == 1) {
      setEditableMatThoang(false);
      if (reset) {
        setMatThoangConfig(matThoangObject?.ratePerMain);
      }
    }
    if (type == 3) {
      setEditableNhomTang(false);
      if (reset) {
        setNhomTangConfig(nhomTangObject?.ratePerMain);
      }
    }
  };
  useEffect(() => {
    setTimeConfig(data?.data?.[0]?.rateId);
  }, [data]);
  const getObjectType = async (type: any) => {
    try {
      const res: any = await systemApi.getFastExpRealEstate({
        page: 1,
        limit: 10,
        type: type,
        assetType: ASSET_PRICES_SHARED_TYPE.APARTMENT,
      });
      if (type == 0) {
        const tienIchObject = res?.data?.data?.[0];
        setTienIchObject(tienIchObject);
        setTienIchConfig(tienIchObject?.ratePerMain);
      }
      if (type == 1) {
        const matThoangObject = res?.data?.data?.[0];
        setMatThoangObject(matThoangObject);
        setMatThoangConfig(matThoangObject?.ratePerMain);
      }
      if (type == 3) {
        const nhomTangObject = res?.data?.data?.[0];
        setNhomTangObject(nhomTangObject);
        setNhomTangConfig(nhomTangObject?.ratePerMain);
      }
    } catch (error) {
      if (type == 0) {
        setTienIchObject(null);
        setTienIchConfig(null);
      }
      if (type == 1) {
        setMatThoangObject(null);
        setMatThoangConfig(null);
      }
      if (type == 3) {
        setNhomTangObject(null);
        setNhomTangConfig(null);
      }
    }
  };
  const updateConfig = async (object: any, value: any) => {
    try {
      const data = {
        ...object,
        ratePerMain: value,
        assetType: ASSET_PRICES_SHARED_TYPE.APARTMENT,
      };

      const res = await systemApi.updateFastExpRealEstate(data);
      if (res.data.code === 200) {
        message.success("Cập nhật thành công");

        getObjectType(object?.type);
        handleCancelType(object?.type, false);
      } else message.error("Cập nhật thất bại");
    } catch (error) {}
  };
  useEffect(() => {
    getObjectType(0);
    getObjectType(1);
    getObjectType(3);
  }, []);
  return (
    <div style={{ width: "100%" }} className="system-fast-wrapper">
      <div style={{ marginBottom: "10px" }}></div>
      <SysFastRealPurposeTable />
      <br />
      <SysUtilitiesTable />

      <div style={{ width: 700 }}>
        <Space align="center" style={{ justifyContent: "space-between" }}>
          <FormItem
            label={"Cấu hình tham số hiệu lực cho tài sản so sánh"}
            type={INPUT_NUMBER}
            addonAfter="Tháng"
            disable={!editable}
            value={timeConfig}
            onChange={(e: any) => setTimeConfig(e)}
          />
          {editable ? (
            <Space>
              <ButtonCustom label="Hủy bỏ" onClick={handleCancel} />
              <ButtonCustom
                loading={isLoading}
                label="Lưu lại"
                type="primary"
                onClick={handleSaveEdit}
                bgColor="rgba(40, 98, 175, 1)"
              />
            </Space>
          ) : (
            <ListButtonActionUpdate editFunction={() => setEditable(true)} />
          )}
        </Space>
        {/* <Space align="center" style={{ justifyContent: "space-between" }}>
          <FormItem
            label={"Cấu hình tiện ích"}
            type={INPUT_NUMBER}
            addonAfter="%"
            disable={!editableTienIch}
            value={tienIchConfig}
            onChange={(e: any) => setTienIchConfig(e)}
          />
          {editableTienIch ? (
            <Space>
              <ButtonCustom
                label="Hủy bỏ"
                onClick={() => {
                  handleCancelType(0);
                }}
              />
              <ButtonCustom
                loading={isLoading}
                label="Lưu lại"
                type="primary"
                onClick={() => {
                  updateConfig(tienIchObject, tienIchConfig);
                }}
                bgColor="rgba(40, 98, 175, 1)"
              />
            </Space>
          ) : (
            <ListButtonActionUpdate
              editFunction={() => setEditableTienIch(true)}
            />
          )}
        </Space> */}
        <Space align="center" style={{ justifyContent: "space-between" }}>
          <FormItem
            label={"Cấu hình mặt thoáng"}
            type={INPUT_NUMBER}
            addonAfter="%"
            disable={!editableMatThoang}
            value={matThoangConfig}
            onChange={(e: any) => setMatThoangConfig(e)}
          />
          {editableMatThoang ? (
            <Space>
              <ButtonCustom
                label="Hủy bỏ"
                onClick={() => {
                  handleCancelType(1);
                }}
              />
              <ButtonCustom
                loading={isLoading}
                label="Lưu lại"
                type="primary"
                onClick={() => {
                  updateConfig(matThoangObject, matThoangConfig);
                }}
                bgColor="rgba(40, 98, 175, 1)"
              />
            </Space>
          ) : (
            <ListButtonActionUpdate
              editFunction={() => setEditableMatThoang(true)}
            />
          )}
        </Space>
        <Space align="center" style={{ justifyContent: "space-between" }}>
          <FormItem
            label={"Cấu hình nhóm tầng"}
            type={INPUT_NUMBER}
            addonAfter="%"
            disable={!editableNhomTang}
            value={nhomTangConfig}
            onChange={(e: any) => setNhomTangConfig(e)}
          />
          {editableNhomTang ? (
            <Space>
              <ButtonCustom
                label="Hủy bỏ"
                onClick={() => {
                  handleCancelType(3);
                }}
              />
              <ButtonCustom
                loading={isLoading}
                label="Lưu lại"
                type="primary"
                onClick={() => {
                  updateConfig(nhomTangObject, nhomTangConfig);
                }}
                bgColor="rgba(40, 98, 175, 1)"
              />
            </Space>
          ) : (
            <ListButtonActionUpdate
              editFunction={() => setEditableNhomTang(true)}
            />
          )}
        </Space>
      </div>
    </div>
  );
};

export default SystemFastRealEstate;
