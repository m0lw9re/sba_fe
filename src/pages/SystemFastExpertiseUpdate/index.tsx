import {setSelectedBeadCrumb} from "pages/App/store/appSlice";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {SYSTEM_FAST_EXPERTISE} from "routes/route.constant";
import {CollapseCustom} from "components/CollapseCustom";
import SystemFastRealEstate from "./component/SysFastRealEstate";
import SystemFastApartment from "./component/SysFastApartment";
import SystemFastCar from "./component/SysFastApartment";

const SystemFastExpertiseUpdate = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Hệ thống",
        path: "",
      },
      {
        label: "Định giá nhanh",
        path: SYSTEM_FAST_EXPERTISE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [SYSTEM_FAST_EXPERTISE]);
  return (
    <div className="page-container">
      <CollapseCustom
        defaultActiveKey={["1", "2"]}
        isInner
        itemList={[
          {
            label: "Nhà đất",
            children: <SystemFastRealEstate />,
          },
          {
            label: "Căn hộ chung cư",
            children: <SystemFastApartment />,
          },
          {
            label: "Xe",
            children: <SystemFastCar />,
          },
        ]}
      />
    </div>
  );
};

export default SystemFastExpertiseUpdate;
