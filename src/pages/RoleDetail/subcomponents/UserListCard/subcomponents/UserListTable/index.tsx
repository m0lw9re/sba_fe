import React, { useState } from "react";
import "./style.scss";
import { Card, Col, Row } from "antd";
import type { ColumnsType } from "antd/es/table";
import StatusAccount from "components/StatusAccount";
import TableCustom from "components/TableCustom";
import { UserListFilter } from "../UserListFilter";
import { FilterRoleType } from "constant/types";
import ButtonCustom from "components/ButtonCustom";
import Icons from "assets/icons";

type dataTableItem = {
  key: number;
  index: string;
  id: string;
  name: string;
  date: string;
  status: number;
};

const data: Array<dataTableItem> = [
  {
    key: 1,
    index: "112",
    id: "ID01923",
    name: "Nguyễn Văn A",
    date: '26/04/2023',
    status: 1,
  },
  {
    key: 2,
    index: "112",
    id: "ID01923",
    name: "Nguyễn Văn A",
    date: '26/04/2023',
    status: 1,
  },
  {
    key: 3,
    index: "112",
    id: "ID01923",
    name: "Nguyễn Văn A",
    date: '26/04/2023',
    status: 1,
  },
  {
    key: 4,
    index: "112",
    id: "ID01923",
    name: "Nguyễn Văn A",
    date: '26/04/2023',
    status: 1,
  },
  {
    key: 5,
    index: "112",
    id: "ID01923",
    name: "Nguyễn Văn A",
    date: '26/04/2023',
    status: 1,
  },
];

const UserListTable = () => {
  // const [params, setParams] = useState<GetAllCommonType>({
  //   limit: 10,
  //   page: 1,
  // });
  const [filter, setFilter] = useState<FilterRoleType>({
    keyword: "",
    status: -1,
    start: undefined,
    end: undefined,
  });
  const columns: ColumnsType<any> =
    [
      {
        key: 1,
        title: "STT",
        dataIndex: "index",
      },
      {
        key: 2,
        title: "Tên tài khoản",
        dataIndex: "name",
      },
      {
        key: 3,
        title: "Ngày gán",
        dataIndex: "date",
      },
      {
        key: 4,
        title: "Status",
        dataIndex: "status",
        render: (status) => (
          <><StatusAccount status={status} /></>
        )
      },
    ]
  return (
    <Card size="small">
      <Row justify={"space-between"} gutter={[24, 4]} style={{ marginBottom: "10px" }}>
        <Col>
          <UserListFilter
            filter={filter}
            onFilter={(filterData: any) => setFilter({ ...filter, ...filterData })}
          />
        </Col>
        <Col>
            <ButtonCustom
              label="Thêm mới"
              icon={<Icons.add />}
              bgColor="#0048D3"
              onClick={() => { }}
              type="primary"
            />
        </Col>
      </Row>
      <TableCustom
        size="small"
        bordered={true}
        columns={columns}
        dataSource={data}
        //isLoading={!data && isLoading}
        limit={10}
        page={1}
        total={data?.length}
        onLimitChange={() => { }}
        onPageChange={() => { }}
        isLoading={false}
      />
    </Card>
  );
}
export default UserListTable;
