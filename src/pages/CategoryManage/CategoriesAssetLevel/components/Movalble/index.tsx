import "./style.scss";
import RoadVehiclesTable from "./subcomponents/RoadVehiclesComponent";
import WaterwayVehiclesTable from "./subcomponents/WaterwayVehiclesComponent";
import OthersVehiclesTable from "./subcomponents/OtherVehiclesComponent";
import { CollapseCustom } from "components/CollapseCustom";

const RoadVehiclesInfo = () => {
  return (
    <CollapseCustom
      itemList={[
        {
          label: "Phương tiện đường bộ",
          children: <RoadVehiclesTable />,
        },
        {
          label: "Phương tiện đường thuỷ",
          children: <WaterwayVehiclesTable />,
        },
        {
          label: "Máy móc thiết bị",
          children: <OthersVehiclesTable />,
        },
      ]}
    />
  );
};

export default RoadVehiclesInfo;
