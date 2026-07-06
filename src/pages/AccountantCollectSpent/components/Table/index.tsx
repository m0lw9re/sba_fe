import React, { useEffect, useState } from "react";
import { defaultColumns } from "./config";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { Card } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import InputCustom from "components/InputCustom";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import Create from "../Modal";
import Edit from "../ModalEdit";
import {
  FilterAccountantCollectSpent,
  EditAccountantCollectSpent,
} from "constant/types";
import { GetAllCommonType } from "constant/types";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { randomId } from "utils";
import "./style.scss";

type Props = {
  filters: FilterAccountantCollectSpent;
  setFilter: (filters: FilterAccountantCollectSpent) => void;
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

  const openEdit = (record: EditAccountantCollectSpent) => {
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
      expentId: "01",
      expentName: "Thu phí đợt 1",
      type: "Phiếu thu",
      description: "",
    },
    {
      expentId: "01",
      expentName: "Chi đợt 1",
      type: "Phiếu chi",
      description: "",
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
    } else if (item.key === 6) {
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
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <CardTitleCustomUpdate title="Danh sách các khoản thu chi" />
          <ButtonCustom
            label="Tạo mới"
            type="primary"
            onClick={openCreate}
            bgColor="rgba(40, 98, 175, 1)"
          />
        </div>
        <TableCustom
          // dataSource={dataTable}
          dataSource={[]}
          columns={columns}
          bordered={true}
          //isLoading={!data && isLoading}
          isLoading={false}
          limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
          //total={data ? data.total : 0}
          total={5}
          onLimitChange={(limit) => {
            setParams({ ...params, limit });
          }}
          onPageChange={(page) => {
            setParams({ ...params, page });
          }}
          page={params.page || 1}
        />
      </Card>
      <Create isOpen={isOpenCreate} closeModal={closeCreate} />
      <Edit isOpen={isOpenEdit} closeModal={closeEdit} />
    </div>
  );
};

export default Table;
