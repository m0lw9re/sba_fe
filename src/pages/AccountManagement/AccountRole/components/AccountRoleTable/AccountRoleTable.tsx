import { Card, Col, Row, Space, Typography, message } from "antd";
import TableCustom from "components/TableCustom";
import {
  CommonGetAllParams,
  UpdateAccountRoleData,
} from "constants/types/common.type";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import { useAccountRole } from "utils/request";
import { FilterAccountRoleType, GetAllCommonType } from "constant/types";
import CreateAccountRoleModal from "../CreateAccountRoleModal";
import AccoutRoleUpdateModal from "../AccountRoleUpdateModal";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { defaultColumns } from "./config";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { accountRoleApi } from "apis/accountrole";
import ComponentsError from "pages/ComponentsError";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { BUTTON_CODES } from "constant/common";

type Props = {
  filter: FilterAccountRoleType;
  setFilter: (filters: FilterAccountRoleType) => void;
};

const AccountRoleTable: React.FC<Props> = ({ filter, setFilter }) => {
  const [isOpenCreateAccountRoleModal, setIsOpenCreateAccountRoleModal] =
    useState<boolean>(false);

  const [isOpenAccountRoleUpdateModal, setIsOpenAccountRoleUpdateModal] =
    useState<boolean>(false);

  const [editRoleSelected, setEditRoleSelected] =
    useState<UpdateAccountRoleData>();

  const openCreateAccountRoleModal = () => {
    setIsOpenCreateAccountRoleModal(true);
  };

  const closeCreateAccountRoleModal = () => {
    mutate();
    setIsOpenCreateAccountRoleModal(false);
  };

  const openAccountRoleUpdateModal = (record: UpdateAccountRoleData) => {
    setIsOpenAccountRoleUpdateModal(true);
    setEditRoleSelected(record);
  };

  const closeAccountRoleUpdateModal = () => {
    mutate();
    setIsOpenAccountRoleUpdateModal(false);
  };

  const handleRemove = async (roleCode: string) => {
    try {
      const response = await accountRoleApi.delete(roleCode);
      if (response.data.code === 200) {
        message.success("Xoá nhóm quyền thành công");
        mutate();
      } else message.error("Xoá nhóm quyền thất bại!");
    } catch {
      message.error("Xoá nhóm quyền thất bại!");
    }
  };

  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
    status: 1,
  });

  const { data, isLoading, error, mutate } = useAccountRole(params, filter);

  const prevParamsRef = useRef<any>(params);
  useEffect(() => {
    setParams({ ...params, page: 1 });
    setFilter({
      ...filter,
      isFiltering: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filter)]);

  useLayoutEffect(() => {
    if (
      params?.page !== undefined &&
      params?.page > 1 &&
      params?.limit !== undefined &&
      params?.limit >= 5 &&
      params.limit !== prevParamsRef.current.limit
    ) {
      setParams({
        ...params,
        limit: params.limit,
        page: 1,
      });
    }
  }, [params]);

  useEffect(() => {
    prevParamsRef.current = params;
  }, [params]);

  const columns = defaultColumns.map((item) => {
    if (item.key === 1) {
      return {
        ...item,
        width: "5%",
        render: (_: any, record: any, index: any) => {
          return (Number(params.page) - 1) * Number(params.limit) + index + 1;
        },
      };
    }
    if (item.key === 7) {
      return {
        ...item,
        render: (_: any, record: any) => (
          <>
            <ListButtonActionUpdate
              editFunction={() =>
                openAccountRoleUpdateModal({
                  roleCode: record.roleCode,
                  roleName: record.roleName,
                })
              }
              removeFunction={() => handleRemove(record.roleCode)}
              removeButtonCode={BUTTON_CODES.nqtk_xoa}
              editButtonCode={BUTTON_CODES.nqtk_sua}
            />
          </>
        ),
      };
    }
    return { ...item };
  });
  if (error) return <ComponentsError />;

  return (
    <Card className="card-container" size="small">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <CardTitleCustomUpdate title="Danh sách nhóm quyền tài khoản" />
        <ButtonCustom
          label="Thêm nhóm quyền tài khoản"
          type="primary"
          onClick={openCreateAccountRoleModal}
          bgColor="rgba(40, 98, 175, 1)"
          code={BUTTON_CODES.nqtk_them}
        />
      </div>

      <TableCustom
        bordered={true}
        columns={columns}
        dataSource={data ? data.data : []}
        isLoading={!data && isLoading}
        limit={data?.limit}
        page={data?.page}
        total={data?.total}
        onLimitChange={(limit) => {
          setParams({ ...params, limit });
        }}
        onPageChange={(page) => {
          setParams({ ...params, page });
        }}
      />
      <div className="total-Page-NQTK">
        <Typography.Text style={{ fontSize: "14px" }} ellipsis={true}>
          Tổng: {data?.total}
        </Typography.Text>
      </div>
      <CreateAccountRoleModal
        isOpenModal={isOpenCreateAccountRoleModal}
        closeModal={closeCreateAccountRoleModal}
      />
      <AccoutRoleUpdateModal
        isOpenModal={isOpenAccountRoleUpdateModal}
        closeModal={closeAccountRoleUpdateModal}
        roleSelected={editRoleSelected!}
      />
    </Card>
  );
};

export default AccountRoleTable;
