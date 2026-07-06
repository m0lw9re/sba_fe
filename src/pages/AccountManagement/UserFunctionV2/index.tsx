import { setSelectedBeadCrumb } from 'pages/App/store/appSlice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { USER_FUNCTION } from 'routes/route.constant';

import UserFunctionFilter from './UserFunctionFilter';
import UserFunctionTable from './UserFunctionTable';

const UserFunctionV2 = () => {
  const [filters, setFilters] = useState<{ roleCode?: string }>({});

  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: 'Phân quyền chức năng',
        path: USER_FUNCTION,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [USER_FUNCTION]);
  return (
    <>
      <div style={{ width: '100%' }}>
        <div className='page-container'>
          <div style={{ marginBottom: '8px' }}>
            <UserFunctionFilter filters={filters} setFilter={setFilters} />
          </div>
          <div style={{ marginBottom: '8px' }}>
            <UserFunctionTable filters={filters} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserFunctionV2;
