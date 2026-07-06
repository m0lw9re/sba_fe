import React from "react";
import "./style.scss";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { LISTFUNCTION } from "routes/route.constant";
import ListFunctionTable from "./components/ListFunctionTable/ListFunctionTable";

const ListFunction = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh sách chức năng",
        path: LISTFUNCTION,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [LISTFUNCTION]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <ListFunctionTable />
      </div>
    </div>
  );
};

export default ListFunction;
