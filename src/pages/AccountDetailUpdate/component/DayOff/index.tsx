import { Space } from "antd";
import { categoryApi } from "apis/category";
import { CollapseCustom } from "components/CollapseCustom";
import { FC, Fragment, useEffect, useState } from "react";
import DayForm from "./component/DayForm";

const DayOff: FC<any> = () => {
  const [accountDetail, setAccountDetail] = useState(null);

  useEffect(() => {
    handleGetAllDayOffDetail();
  }, []);
  const handleGetAllDayOffDetail = async () => {
    try {
      // const userName =
      //   param.username ||
      //   String(localStorage.getItem(LOCAL_STORAGE_KEY.USERNAME));
      const param = {
        page: 1,
        limit: 10,
        direction: 1,
      };
      const res = await categoryApi.getDayOffsUSer(param);
      setAccountDetail(res.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <CollapseCustom
          itemList={[
            {
              label: "Ngày nghỉ phép",
              children: <DayForm />,
            },
          ]}
        />
      </Space>
    </Fragment>
  );
};

export default DayOff;
