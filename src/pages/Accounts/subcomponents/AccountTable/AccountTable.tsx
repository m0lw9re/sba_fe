import { Card, Col, Row, Space } from "antd";
import TableCustom from "components/TableCustom";
import { CommonGetAllParams } from "constants/types/common.type";
import { useState } from "react";
import { AccountFilter } from "../AccountFilter/AccountFilter";
import ButtonCustom from "components/ButtonCustom";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { useAccounts } from "utils/request";
import { ACCOUNT_DETAIL } from "routes/route.constant";
import { FilterAccountType } from "constant/types";
import CreateAccountModal from "../CreateAccountModal";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { defaultColumns } from "./config";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import ComponentsError from "pages/ComponentsError";

export const AccountTable = () => {
  const navigate = useNavigate();

  const [isOpenCreateAccountModal, setIsOpenCreateAccountModal] =
    useState<boolean>(false);
  const openCreateAccountModal = () => {
    setIsOpenCreateAccountModal(true);
  };

  const closeCreateAccountModal = () => {
    mutate();
    setIsOpenCreateAccountModal(false);
  };
  const [params, setParams] = useState<CommonGetAllParams>({
    limit: 10,
    page: 1,
  });

  const [filter, setFilter] = useState<FilterAccountType>({
    keyword: "",
    status: undefined,
    start: undefined,
    end: undefined,
  });

  const { data, isLoading, error, mutate } = useAccounts(params, filter);
  const columns = defaultColumns.map((item) => {
    if (item.key === 7) {
      return {
        ...item,
        render: (_: any, record: any) => (
          <>
            <ListButtonActionUpdate
              editFunction={() =>
                navigate(ACCOUNT_DETAIL.replace(":username", record.username))
              }
              viewFunction={() => {}}
            />
          </>
        ),
      };
    } else return { ...item };
  });
  if (error) return <ComponentsError />;

  return (
    <Card className="account-card" style={{ padding: "8px" }}>
      <CardTitleCustomUpdate title="Danh sách nhân viên" />
      <Row justify={"space-between"}>
        <Col>
          <AccountFilter
            filter={filter}
            onFilter={(filterData: any) =>
              setFilter({ ...filter, ...filterData })
            }
          />
        </Col>
        <Col>
          <Space>
            <ButtonCustom
              label="Tạo mới"
              bgColor="#0048D3"
              onClick={openCreateAccountModal}
              type="primary"
              size="small"
            />
          </Space>
        </Col>
      </Row>

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
      <CreateAccountModal
        isOpenModal={isOpenCreateAccountModal}
        closeModal={closeCreateAccountModal}
      />
    </Card>
  );
};
