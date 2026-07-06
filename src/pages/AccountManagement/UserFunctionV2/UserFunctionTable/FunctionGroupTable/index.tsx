import { Checkbox, Modal, Table } from 'antd';
import { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import ButtonCustom from 'components/ButtonCustom';
import {
  ButtonPermissionType,
  Menu,
  MenuItemPermission,
} from 'constants/types/menu.type';
import React, { Fragment, useEffect, useState } from 'react';
import { getButtonsPermissionInPage } from 'utils/permission';
import './style.scss';
import { renderButtonName } from 'constant/common';
import { title } from 'process';

type Props = {
  roleCode: string | undefined;
  menus: Menu[];
  setKeys: (keys: Array<React.Key>) => void;
  selectedKeys: Array<React.Key>;
  setMenus: (menus: any) => void;
  onSave: (menus?: any) => void;
};
const FunctionGroupTable: React.FC<Props> = ({
  menus,
  roleCode,
  selectedKeys,
  setKeys,
  setMenus,
  onSave,
}) => {
  const [detailModal, setDetailModal] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  console.log('selectedMenu:', selectedMenu)
  const [selectedMenuButtonPermission, setSelectedMenuButtonPermission] =
    useState<MenuItemPermission[]>([]);

  const handleTransformData = (data: Menu[]): any[] => {
    return data.map(item => {
      return {
        buttonCodes: item.buttonCodes,
        permissions: item.permissions,
        description: item.description,
        displayIcon: item.displayIcon,
        displayName: item.displayName,
        isBelong: item.isBelong,
        isShow: item.isShow,
        key: item.key,
        menuId: item.menuId,
        menuLevel: item.menuLevel,
        parentMenu: item.parentMenu,
        path: item.path,
        roleIds: item.roleIds,
        sequence: item.sequence,
        children:
          item.menuDtos.length > 0 ? handleTransformData(item.menuDtos) : [],
      };
    });
  };
  const dataSource = handleTransformData(menus);

  const handleShowDetailModal = (record: Menu) => {
    setDetailModal(true);
    setSelectedMenu(record);
  };
  const handleSave = () => {
    // update menu
    // recursive find and update menu
    const updateMenu = (menu: Menu): Menu => {
      if (menu.key === selectedMenu?.key) {
        return {
          ...menu,
          permissions: selectedMenuButtonPermission
            .map(item => {
              return `${item.roleCode}:${item.permissions
                .map(i => {
                  return `${i.code}-${i.value}`;
                })
                .join(',')}`;
            })
            .join(';'),
        };
      }
      if (menu.menuDtos.length > 0) {
        return {
          ...menu,
          menuDtos: menu.menuDtos.map(updateMenu),
        };
      }
      return menu;
    };
    const updatedMenu: Menu[] = []
    setMenus((prev: Menu[]) => {
      const result = prev.map(updateMenu);
      updatedMenu.push(...result);
      return result;
    });
    onSave(updatedMenu);
    
    setTimeout(() => {
      setDetailModal(false);
      setSelectedMenu(null);
      setSelectedMenuButtonPermission([]);
    }, 500);
  };

  const handleRenderPermissionsList = (
    selectedMenuButtonPermission: MenuItemPermission[],
  ) => {
    const permissionByRole = selectedMenuButtonPermission.find(
      item => item.roleCode === roleCode,
    );
    const result = selectedMenu?.buttonCodes.split(',').map(item => {
      return {
        code: item,
        label: renderButtonName(item),
        value:
          permissionByRole?.permissions.find(i => i.code === item)?.value ||
          false,
      };
    });
    return result;
  };

  const columns: ColumnsType<any> = [
    {
      key: 1,
      dataIndex: 'path',
      title: 'Mã chức năng',
    },
    {
      key: 2,
      dataIndex: 'displayName',
      title: 'Tên chức năng',
    },
    {
      key: 3,
      dataIndex: 'action',
      align: 'center',
      render: (text: any, record: Menu) => {
        if (!record.buttonCodes) return null;
        return (
          <div>
            <ButtonCustom
              type='default'
              size='small'
              onClick={() => handleShowDetailModal(record)}
            >
              Phân quyền chi tiết
            </ButtonCustom>
          </div>
        );
      },
    },
  ];
  const columnsDetail: ColumnsType<any> = [
    {
      key: 2,
      dataIndex: 'label',
      title: 'Tên chức năng',
      align: 'left',
    },
    // checkbox
    {
      key: 3,
      dataIndex: 'value',
      title: 'Mở',
      align: 'center',
      render: (text: any, record: any) => {
        return (
          <Checkbox
            type='checkbox'
            checked={record.value}
            onChange={e => {
              setSelectedMenuButtonPermission(prev => {
                const temp = prev.map(item => {
                  if (item.roleCode === roleCode) {
                    return {
                      ...item,
                      permissions: item.permissions.map(i => {
                        if (i.code === record.code) {
                          return {
                            ...i,
                            value: e.target.checked,
                          };
                        }
                        return i;
                      }),
                    };
                  }
                  return item;
                });
                if (!temp.find(item => item.roleCode === roleCode)) {
                  temp.push({
                    roleCode: roleCode || '-',
                    permissions: selectedMenu?.buttonCodes
                      .split(',')
                      .map(item => {
                        if (item === record.code) {
                          return {
                            code: item,
                            label: renderButtonName(item),
                            value: e.target.checked,
                          };
                        }
                        return {
                          code: item,
                          label: renderButtonName(item),
                          value: false,
                        };
                      }) as ButtonPermissionType[],
                  });
                }
                return temp;
              });
            }}
          />
        );
      },
    },
  ];
  const rowSelection: TableRowSelection<Menu> = {
    selectedRowKeys: selectedKeys,
    onChange: selectedRowKeys => {
      setKeys(selectedRowKeys);
    },
  };

  useEffect(() => {
    if (selectedMenu && roleCode) {
      setSelectedMenuButtonPermission(
        getButtonsPermissionInPage(
          selectedMenu.permissions,
          selectedMenu.buttonCodes.split(','),
        ),
      );
    }
  }, [selectedMenu, roleCode]);

  return (
    <Fragment>
      <Table
        className='user-group-table-container'
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
          checkStrictly: false,
        }}
        columns={columns}
        dataSource={dataSource}
        bordered={true}
        pagination={false}
      />
      <Modal
        title={`Phân quyền chi tiết ${selectedMenu?.displayName}`}
        visible={detailModal}
        onCancel={() => setDetailModal(false)}
        cancelText='Hủy'
        okText='Lưu'
        onOk={handleSave}
      >
        <Table
          dataSource={handleRenderPermissionsList(selectedMenuButtonPermission)}
          columns={columnsDetail}
          pagination={false}
          bordered={true}
        />
      </Modal>
    </Fragment>
  );
};

export default FunctionGroupTable;
