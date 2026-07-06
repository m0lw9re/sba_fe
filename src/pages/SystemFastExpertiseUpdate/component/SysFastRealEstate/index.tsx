import { Space, message } from "antd";
import SysFastRealPositionTable from "./SysFastRealPositionTable";
import SysFastRealPurposeTable from "./SysFastRealPurposeTable";
import FormItem from "components/InputFields/FormItem";
import { TYPE_FIELD } from "constants/enums";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { useEffect, useState } from "react";
import { useSystemFast } from "utils/request/useSystemFastRealEstate";
import ButtonCustom from "components/ButtonCustom";
import { systemApi } from "apis/system";
const { INPUT_NUMBER } = TYPE_FIELD;

const SystemFastRealEstate = () => {
  const { data, isLoading, mutate } = useSystemFast(
    { page: 1, limit: 100 },
    { type: 2 }
  );
  const [timeConfig, setTimeConfig] = useState<any>(null);
  const [editable, setEditable] = useState<boolean>(false);

  const handleSaveEdit = async () => {
    const timeConfigUpdate = {
      ...data?.data[0],
      rateId: timeConfig,
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
    setTimeConfig(data?.data.length > 0 ? data?.data[0].rateId : null);
  };
  useEffect(() => {
    setTimeConfig(data?.data.length > 0 ? data?.data[0].rateId : null);
  }, [data]);
  return (
    <div style={{ width: "100%" }} className="system-fast-wrapper">
      <SysFastRealPositionTable />
      <div style={{ marginBottom: "10px" }}></div>
      <SysFastRealPurposeTable />
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
    </div>
  );
};

export default SystemFastRealEstate;
