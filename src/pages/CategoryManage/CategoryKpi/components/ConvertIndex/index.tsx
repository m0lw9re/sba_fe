import "./style.scss";
import ConvertIndex from "pages/CategoryManage/CategoryKpi/components/ConvertIndex/Table";
import TableKPIBonus from "pages/CategoryManage/CategoryKpi/components/ConvertIndex/TableKPIBonus";

const TableConvertIndex = () => {
  return (
    <div style={{ width: "100%" }}>
      <div className="table-convert">
        <TableKPIBonus />
        <br />
        <ConvertIndex />
      </div>
    </div>
  );
};

export default TableConvertIndex;
