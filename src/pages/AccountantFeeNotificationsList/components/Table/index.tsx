import React, { useEffect, useState } from "react";
import { defaultColumns } from "./config";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { Card } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import ButtonCustom from "components/ButtonCustom";
import Create from "../Modal";
import {
  FilterAccountantFeeNotificationsUpdate,
  EditAccountantFeeNotificationsUpdate,
} from "constant/types";
import { GetAllCommonType } from "constant/types";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { randomId } from "utils";
import "./style.scss";

type Props = {
  filters: FilterAccountantFeeNotificationsUpdate;
  setFilter: (filters: FilterAccountantFeeNotificationsUpdate) => void;
};

const Table: React.FC<Props> = ({ filters, setFilter }) => {
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);

  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);

  const openCreate = () => {
    setIsOpenCreate(true);
  };

  const closeCreate = () => {
    setIsOpenCreate(false);
  };

  const openEdit = (record: EditAccountantFeeNotificationsUpdate) => {
    setIsOpenEdit(true);
  };

  const closeEdit = () => {
    setIsOpenEdit(false);
  };

  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
    status: 1,
  });

  useEffect(() => {
    setParams({ ...params, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const data = [
    {
      soTB: "PT/00001",
      ngayTB: "26/08/2022",
      nguoiLap: "Admin",
      soBT: "12983781923",
      trangThai: "Bình thường",
    },
    {
      soTB: "PT/00002",
      ngayTB: "27/08/2022",
      nguoiLap: "User",
      soBT: "239487523",
      trangThai: "Đang xử lý",
    },
    {
      soTB: "PT/00003",
      ngayTB: "28/08/2022",
      nguoiLap: "Manager",
      soBT: "9823479823",
      trangThai: "Hoàn thành",
    },
  ];

  const dataTable = data
    ? data.map((item: any) => {
        return {
          ...item,
          key: randomId(),
        };
      })
    : [];

  const columns = defaultColumns.map((item) => {
    if (item.key === 1) {
      return {
        ...item,
        render: (_: any, record: any, index: number) => {
          return (Number(params.page) - 1) * Number(params.limit) + index + 1;
        },
      };
    } else if (item.key === 7) {
      return {
        ...item,
        render: (_: any, record: any) => (
          <>
            <ListButtonActionUpdate
              editFunction={openEdit}
              removeFunction={() => {}}
              viewFunction={() => {}}
            />
          </>
        ),
      };
    } else
      return {
        ...item,
      };
  });

  return (
    <div className="user-list-table-container">
      <Card className="card-container" size="small">
        <div
          className="btn-group"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <CardTitleCustomUpdate title="Danh sách thông báo phí" />
          <ButtonCustom
            label="Tạo mới"
            type="primary"
            onClick={openCreate}
            bgColor="rgba(40, 98, 175, 1)"
            className="btn-create"
          />
        </div>
        <TableCustom
          dataSource={dataTable}
          columns={columns}
          bordered={true}
          //isLoading={!data && isLoading}
          isLoading={false}
          limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
          //total={data ? data.total : 0}
          total={7}
          onLimitChange={(limit) => {
            setParams({ ...params, limit });
          }}
          onPageChange={(page) => {
            setParams({ ...params, page });
          }}
          page={params.page || 1}
          scroll={{ x: 1366 }}
        />
      </Card>
      <Create isOpen={isOpenCreate} closeModal={closeCreate} />
      {/* <Edit isOpen={isOpenEdit} closeModal={closeEdit} /> */}
    </div>
  );
};

export default Table;
