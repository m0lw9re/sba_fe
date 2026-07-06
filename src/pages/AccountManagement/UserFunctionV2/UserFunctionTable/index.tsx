import { Card, message, Row, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

import FunctionGroupTable from './FunctionGroupTable';

import { menuApi } from 'apis/menu';
import Icons from 'assets/icons';
import ButtonCustom from 'components/ButtonCustom';
import TableCustom from 'components/TableCustom';
import { Menu } from 'constants/types/menu.type';
import './style.scss';
import CardTitleCustomUpdate from 'components/CardTitleCustomUpdate';

type Props = {
  filters: { roleCode?: string };
};

const UserFunctionTable: React.FC<Props> = ({ filters }) => {
  const [menus, setMenus] = useState<Menu[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [keysNotBelong, setKeysNotBelong] = useState<React.Key[]>([]);
  const [keysBelong, setKeysBelong] = useState<React.Key[]>([]);

  // transform data from api to data for table
  const fetchMenus = async () => {
    try {
      setIsLoading(true);
      const res = await menuApi.getByRoleCode(filters.roleCode || '');
      if (res.data.length > 0) {
        setMenus(getMenuItems(res.data));
      }
    } catch (error) {
      message.error('Lỗi khi lấy dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };
  const getMenuItems = (menus: Menu[]): Menu[] => {
    return (
      menus?.map(item => {
        return {
          ...item,
          key: item.menuId,
          isBelong: Boolean(item.isBelong),
          menuDtos: getMenuItems(item.menuDtos || []),
        };
      }) || []
    );
  };

  // filter menu by isBelong
  const filterMenusByIsBelong = (menus: Menu[], isBeLong: boolean): Menu[] => {
    // Helper function to check if a menu or any of its menuDtos should be included
    function shouldInclude(menu: Menu): boolean {
      if (menu.isBelong === isBeLong) return true;
      if (menu.menuDtos) {
        return menu.menuDtos.some(child => shouldInclude(child));
      }
      return false;
    }

    // Helper function to filter menuDtos recursively
    function filterChildren(menu: Menu): Menu {
      if (!menu.menuDtos) return menu;
      const filteredChildren = menu.menuDtos
        .filter(child => shouldInclude(child))
        .map(filterChildren);
      return { ...menu, menuDtos: filteredChildren };
    }

    // Filter menus and their menuDtos
    return menus.filter(menu => shouldInclude(menu)).map(filterChildren);
  };
  const handleRemoveSubItemFromRole = (menus: Menu[]): Menu[] => {
    return menus.map(item => {
      // If the item's key is not in keysBelong, return it without changes
      const isHaveSubItem = item.menuDtos && item.menuDtos?.length > 0;
      if (!keysBelong.includes(item.key || '') && !isHaveSubItem) {
        return item;
      }

      // If the item has menuDtos, recursively handle them first
      if (isHaveSubItem) {
        const updatedChildren = item.menuDtos
          ? handleRemoveSubItemFromRole(item.menuDtos)
          : [];

        // Determine if any child is not in keysBelong, indicating not all sub-items are removed
        const hasChildrenBelong = updatedChildren.some(
          child => child.isBelong === true,
        );
        // Update the item
        return {
          ...item,
          // Set isBelong to false if all menuDtos are to be removed, true otherwise
          isBelong: hasChildrenBelong,
          // Include the updated menuDtos
          menuDtos: updatedChildren,
        };
      } else {
        // if item has no menuDtos, set isBelong to false
        return { ...item, isBelong: false };
      }
    });
  };
  const handleAddSubItemToRole = (menus: Menu[]): Menu[] => {
    return menus.map(item => {
      // If the item's key is not in keysBelong, return it without changes
      const isHaveSubItem = item.menuDtos && item.menuDtos?.length > 0;

      if (!keysNotBelong.includes(item.key || '') && !isHaveSubItem) {
        return item;
      }

      // If the item has menuDtos, recursively handle them first
      if (isHaveSubItem) {
        const updatedChildren = item.menuDtos
          ? handleAddSubItemToRole(item.menuDtos)
          : [];

        // Determine if any child is not in keysBelong, indicating not all sub-items are removed
        const hasChildrenBelong = updatedChildren.some(
          child => child.isBelong === true,
        );
        // Update the item
        return {
          ...item,
          // Set isBelong to false if all menuDtos are to be removed, true otherwise
          isBelong: hasChildrenBelong,
          // Include the updated menuDtos
          menuDtos: updatedChildren,
        };
      } else {
        // if item has no menuDtos, set isBelong to false
        return { ...item, isBelong: true };
      }
    });
  };
  const removeMenuFromRole = () => {
    // swith isBelong from true -> false any menu item in keysBelong array
    const updatedMenus = handleRemoveSubItemFromRole(menus);
    setKeysBelong([]);
    setMenus(updatedMenus);
  };
  const addSubItemToRole = () => {
    // swith isBelong from false -> true any menu item in keysNotBelong array
    const updatedMenus = handleAddSubItemToRole(menus);
    setKeysNotBelong([]);
    setMenus(updatedMenus);
  };

  const handleSave = async (_updatedMenus?: Menu[]) => {
    const updatedMenus = _updatedMenus || menus;

    if (filters?.roleCode && updatedMenus.length > 0) {
      setIsSaveLoading(true);
      try {
        const res = await menuApi.updateByRoleCode(
          filters?.roleCode,
          updatedMenus,
        );
        if (res.data.code === 200) {
          message.success(res.data.message);
        } else message.error(res.data.message);
      } catch {
        message.error('Cập nhật thất bại');
      } finally {
        setIsSaveLoading(false);
      }
    } else {
      message.error('Vui lòng chọn nhóm tài khoản');
    }
  };

  const columns: ColumnsType<any> = [
    {
      key: 1,
      title: 'Chức năng không thuộc nhóm',
      dataIndex: '',
      width: '47%',
      render: () => (
        <FunctionGroupTable
          roleCode={filters.roleCode}
          menus={filterMenusByIsBelong(menus, false)}
          selectedKeys={keysNotBelong}
          setKeys={setKeysNotBelong}
          setMenus={setMenus}
          onSave={handleSave}
        />
      ),
    },
    {
      key: 2,
      align: 'center',
      title: (
        <Row justify={'center'}>
          <ButtonCustom
            bgColor='#2862AF'
            size={'small'}
            type='primary'
            onClick={fetchMenus}
            icon={<Icons.sync />}
          />
        </Row>
      ),
      dataIndex: '',
      render: () => (
        <Row align={'middle'} justify={'center'}>
          <Space direction='vertical'>
            <ButtonCustom
              bgColor='#17A109'
              size='small'
              shape='circle'
              onClick={addSubItemToRole}
              icon={<Icons.doubleRight style={{ color: '#FFFFFF' }} />}
            />
            <ButtonCustom
              bgColor='#F25B60'
              size='small'
              shape='circle'
              onClick={removeMenuFromRole}
              icon={<Icons.doubleLeft style={{ color: '#FFFFFF' }} />}
            />
          </Space>
        </Row>
      ),
    },
    {
      key: 3,
      title: 'Chức năng thuộc nhóm',
      dataIndex: '',
      width: '47%',
      render: () => (
        <FunctionGroupTable
          roleCode={filters.roleCode}
          menus={filterMenusByIsBelong(menus, true)}
          selectedKeys={keysBelong}
          setKeys={setKeysBelong}
          setMenus={setMenus}
          onSave={handleSave}
        />
      ),
    },
  ];

  useEffect(() => {
    if (filters.roleCode) fetchMenus();
  }, [filters.roleCode]);

  return (
    <div className='user-function-table-container'>
      <Card className='card-container' size='small'>
        <CardTitleCustomUpdate
          title='Phân quyền chức năng'
          saveFunction={() => handleSave(menus)}
          isSaveLoading={isSaveLoading}
          disabledSave={isLoading}
        />
        <div style={{ width: '100' }} className='user-function-table'>
          <TableCustom
            dataSource={[{ key: 1 }]}
            columns={columns}
            bordered={true}
            isLoading={isLoading}
            limit={0}
            total={0}
            onLimitChange={() => {}}
            onPageChange={() => {}}
            page={1}
          />
        </div>
      </Card>
    </div>
  );
};

export default UserFunctionTable;
