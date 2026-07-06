import { TabsCustom } from "components/TabsCustom";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { CATEGORY_COMMIT } from "routes/route.constant";
import NumberCommit from "./NumberCommit";
import AreaSettings from "./AreaSettings";

const CategoryCommit = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [tabIndex, setTabIndex] = useState<string>(
    searchParams.get("tab") || "1"
  );
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh mục",
        path: "",
      },
      {
        label: "Số ngày cam kết",
        path: CATEGORY_COMMIT,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [CATEGORY_COMMIT]);

  return (
    <Fragment>
      <div className="page-container">
        <TabsCustom
          activeKey={tabIndex}
          onChange={(value: string) => setTabIndex(value)}
          className={"tab-assets"}
          items={[
            {
              label: "Số ngày cam kết",
              key: "1",
              forceRender: true,
              children: <NumberCommit />,
            },
            {
              label: "Thiết lập địa bàn",
              key: "2",
              forceRender: true,
              children: <AreaSettings />,
            },
          ]}
        />
      </div>
    </Fragment>
  );
};

export default CategoryCommit;
