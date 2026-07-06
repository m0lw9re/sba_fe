import { Card, Typography } from "antd";
import TableCustom from "components/TableCustom";
import { CommonGetAllParams } from "constants/types/common.type";
import "./style.scss";
import { defaultColumns } from "./config";
// import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { useState } from "react";
import { useAssetLevelThree } from "utils/request";
import { randomId } from "utils";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import ButtonCustom from "components/ButtonCustom";
import ModalCreateUpdateAssetsLevelThree from "pages/CategoryManage/CategoriesAssetLevel/components/CreateUpdateModal";

const Vehicle = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const columns = defaultColumns.map((item) => {
    if (item.key === 4) {
      return {
        ...item,
        render: (_: any, record: any) => (
          <>
            <ListButtonActionUpdate
              editFunction={() => {
                setSelectedRecord(record);
                setIsOpenModal(true);
              }}
            />
          </>
        ),
      };
    } else return { ...item };
  });

  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const { data, error, isLoading, mutate } = useAssetLevelThree(13, "false");

  const dataTable =
    data?.map((item: any) => {
      return {
        ...item,
        key: randomId(),
      };
    }) || [];

  if (error) return <>Đã có lỗi xảy ra</>;

  return (
    <Card className="card-container" size="small">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "4px",
        }}
      >
        <ButtonCustom
          label="Thêm mới"
          type="primary"
          bgColor="rgba(40, 98, 175, 1)"
          onClick={() => {
            setSelectedRecord(null);
            setIsOpenModal(true);
          }}
        />
      </div>

      <TableCustom
        bordered={true}
        dataSource={dataTable}
        columns={columns}
        isLoading={!data && isLoading}
        limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
        total={data ? data.total : 0}
        page={params.page || 1}
        onLimitChange={(limit) => {
          setParams({ ...params, limit });
        }}
        onPageChange={(page) => {
          setParams({ ...params, page });
        }}
      />
      <div className="total-Page-MMTB">
        <Typography.Text style={{ fontSize: "14px" }} ellipsis={true}>
          Tổng: {data?.length}
        </Typography.Text>
      </div>
      <ModalCreateUpdateAssetsLevelThree
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        mutate={mutate}
        record={selectedRecord}
        assetLevelTwoId={1}
      />
    </Card>
  );
};

export default Vehicle;
