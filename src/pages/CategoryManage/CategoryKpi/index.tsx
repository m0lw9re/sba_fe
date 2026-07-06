import { TabsCustom } from 'components/TabsCustom';
import { useDispatch } from 'react-redux';
import { Fragment, useEffect, useState } from 'react';
import { setSelectedBeadCrumb } from 'pages/App/store/appSlice';
import { CATEGORY_KPI } from 'routes/route.constant';
import { useSearchParams } from 'react-router-dom';
import TableConvertIndex from 'pages/CategoryManage/CategoryKpi/components/ConvertIndex';
import TableKPIsInGroup from 'pages/CategoryManage/CategoryKpi/components/KPIsByGroup';
import TableStaffInGroup from 'pages/CategoryManage/CategoryKpi/components/StaffByGroup';

const CategoryKpi = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [tabIndex, setTabIndex] = useState<string>(
    searchParams.get("tab") || "1"
  );
  useEffect(() => {
    let breadCrumb = [
      {
        label: 'KPI',
        path: CATEGORY_KPI,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [CATEGORY_KPI]);

  return (
    <Fragment>
      <div className="page-container">
        <TabsCustom
          activeKey={tabIndex}
          onChange={(value: string) => setTabIndex(value)}
          className={"tab-assets"}
          items={[
            {
              label: "Danh sách nhóm KPIs",
              key: "1",
              forceRender: true,
              children: <TableKPIsInGroup />
            },
            {
              label: "Danh sách nhân viên thuộc nhóm KPIs",
              key: "2",
              forceRender: true,
              children: <TableStaffInGroup />
            },
            {
              label: "Quy đổi hệ số hồ sơ",
              key: "3",
              forceRender: true,
              children: <TableConvertIndex />
            },
          ]}
        />
      </div>
    </Fragment>
  );
};

export default CategoryKpi;
