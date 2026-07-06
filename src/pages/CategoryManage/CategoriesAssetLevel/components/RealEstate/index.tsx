import "./style.scss";
import RealEstateTable from "./subcomponents/RealEstateComponent";
import ApartmentTable from "./subcomponents/ApartmentComponent";
import { CollapseCustom } from "components/CollapseCustom";
import ProjectTable from "./subcomponents/ProjectComponent";
import EstimatesTable from "./subcomponents/EstimatesComponent";

const RealEstateInfo = () => {
  return (
    <CollapseCustom
      itemList={[
        {
          label: "Bất động sản",
          children: <RealEstateTable />,
        },
        {
          label: "Căn hộ chung cư",
          children: <ApartmentTable />,
        },
        {
          label: "Dự án",
          children: <ProjectTable />,
        },
        {
          label: "Dự toán",
          children: <EstimatesTable />,
        },
      ]}
    />
    // <Card className="card-container" size="small">
    //   <div style={{ width: "100%" }}>
    //     <div style={{ marginBottom: "8px" }}>

    //     </div>
    //     <div style={{ marginBottom: "8px" }}>
    //       <CollapseCustom
    //         itemList={[
    //           {
    //             label: "Bất động sản",
    //             children: <ApartmentTable />,
    //           },
    //         ]}
    //       />
    //     </div>
    //     <div style={{ marginBottom: "8px" }}>
    //       <ProjectTable />
    //     </div>
    //     <div style={{ marginBottom: "8px" }}>
    //       <EstimatesTable />
    //     </div>
    //   </div>
    // </Card>
  );
};

export default RealEstateInfo;
