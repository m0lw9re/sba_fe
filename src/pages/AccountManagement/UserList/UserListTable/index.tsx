import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { defaultColumns } from "./config";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { Card, Typography } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import ButtonCustom from "components/ButtonCustom";
import UserCreate from "pages/AccountManagement/UserList/UserCreate";
import UserEdit from "pages/AccountManagement/UserList/UserEdit";
import { FilterStaffType, StaffEditType, StaffType } from "constant/types";
import { useStaffs } from "utils/request/useStaffs";
import { GetAllCommonType } from "constant/types";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { randomId } from "utils";
import "./style.scss";
import ComponentsError from "pages/ComponentsError";
import { BUTTON_CODES } from "constant/common";

type Props = {
  filters: FilterStaffType;
  setFilter: (filters: FilterStaffType) => void;
};

const UserListTable: React.FC<Props> = ({ filters, setFilter }) => {
  const [isOpenModal, setIsOpenModal] = useState({
    openCreateModal: false,
    openEditModal: false,
  });

  const [staffEdit, setStaffEdit] = useState<StaffEditType>();

  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const { data, isLoading, error, mutate } = useStaffs(params, filters);

  const prevParamsRef = useRef<any>(params);

  useEffect(() => {
    if (filters.isFiltering) {
      setParams({ ...params, page: 1 });
      setFilter({
        ...filters,
        isFiltering: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

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
    const storedParams = localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_PARAMS);
    if (storedParams && storedParams !== "{}") {
      try {
        const parsedParams = JSON.parse(storedParams);
        setParams({
          ...params,
          limit: parsedParams.limit,
          page: parsedParams.page,
        });
        localStorage.removeItem(LOCAL_STORAGE_KEY.PAGE_PARAMS);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, [params]);

  const dataTable = data
    ? data.data.map((item: StaffType) => {
        return {
          ...item,
          key: randomId(),
        };
      })
    : [];

  const handleEdit = (record: any) => {
    setStaffEdit({ ...record });
    openModalEdit();
  };

  const openModalCreate = useCallback(() => {
    setIsOpenModal({
      ...isOpenModal,
      openCreateModal: true,
    });
  }, [setIsOpenModal]);

  const openModalEdit = useCallback(() => {
    setIsOpenModal({
      ...isOpenModal,
      openEditModal: true,
    });
  }, [setIsOpenModal]);

  const closeModalCreate = useCallback(() => {
    setIsOpenModal({
      ...isOpenModal,
      openCreateModal: false,
    });
    mutate();
  }, [setIsOpenModal]);

  const closeModalEdit = useCallback(() => {
    setIsOpenModal({
      ...isOpenModal,
      openEditModal: false,
    });
    mutate();
  }, [setIsOpenModal]);

  const columns = defaultColumns.map((item) => {
    if (item.key === 1) {
      return {
        ...item,
        render: (_: any, record: any, index: number) => {
          return (Number(params.page) - 1) * Number(params.limit) + index + 1;
        },
      };
    } else if (item.key === "actions") {
      return {
        ...item,
        render: (_: any, record: any) => (
          <>
            <ListButtonActionUpdate
              editFunction={() => {
                handleEdit(record);
              }}
              editButtonCode={BUTTON_CODES.dstk_sua}
            />
          </>
        ),
      };
    } else
      return {
        ...item,
      };
  });

  if (error) return <ComponentsError />;
  return (
    <div className="user-list-table-container">
      <UserCreate
        isOpen={isOpenModal.openCreateModal}
        closeModal={closeModalCreate}
      />
      <UserEdit
        isOpen={isOpenModal.openEditModal}
        closeModal={closeModalEdit}
        staffEdit={staffEdit}
      />
      <Card className="card-container" size="small">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <CardTitleCustomUpdate title="Danh sách tài khoản" />
          <ButtonCustom
            label="Tạo mới"
            type="primary"
            onClick={openModalCreate}
            bgColor="rgba(40, 98, 175, 1)"
            code={BUTTON_CODES.dm_snck_them}
          />
        </div>
        <TableCustom
          dataSource={dataTable}
          columns={columns}
          bordered={true}
          isLoading={!data && isLoading}
          limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
          total={data ? data.total : 0}
          onLimitChange={(limit) => {
            setParams({ ...params, limit });
          }}
          onPageChange={(page) => {
            setParams({ ...params, page });
          }}
          scroll={{ x: 1336 }}
          page={params.page || 1}
        />
        <div className="total-Page-DSTK">
          <Typography.Text style={{ fontSize: "14px" }} ellipsis={true}>
            Tổng: {data?.total}
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
};

export default UserListTable;
