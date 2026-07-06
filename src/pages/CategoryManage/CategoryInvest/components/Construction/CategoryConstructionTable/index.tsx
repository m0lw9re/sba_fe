import { Card, Typography } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import "pages/AppraisalFiles/subcomponent/AppraisalFilesTable/style.scss";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CommonGetAllParams } from "constants/types/common.type";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { FilterCategoryConstruction } from "constant/types/categoryinvest";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import ComponentsError from "pages/ComponentsError";
import CreateCategoryConstructionModal from "../ModalCreate";
import { EditCategoryInvest } from "constant/types";
import EditCategoryConstructionModal from "../ModalEdit";
import { defaultColumns } from "./config";
import { BUTTON_CODES } from "constant/common";
import { useCategoryConstructionType } from "utils/request";

type Props = {
  filter: FilterCategoryConstruction;
  setFilter: (filter: FilterCategoryConstruction) => void;
};
const CategoryConstructionTable: FC<Props> = ({ filter, setFilter }) => {
  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const [
    isOpenCreateCategoryConstructionModal,
    setIsOpenCategoryConstructionModal,
  ] = useState<boolean>(false);

  const openCreateCategoryConstructionModal = () => {
    setIsOpenCategoryConstructionModal(true);
  };

  const closeCreateCategoryConstructionModal = () => {
    mutate();
    setIsOpenCategoryConstructionModal(false);
  };

  const [
    isOpenEditCategoryConstructionModal,
    setIsEditCategoryConstructionModal,
  ] = useState<boolean>(false);

  const openEditCategoryConstructionModal = (record: EditCategoryInvest) => {
    setIsEditCategoryConstructionModal(true);
    setEditConstructionSelected(record);
  };

  const closeEditCategoryConstructionModal = () => {
    mutate();
    setIsEditCategoryConstructionModal(false);
  };

  const { data, isLoading, error, mutate } = useCategoryConstructionType(
    params,
    { ...filter }
  );

  const [editConstructionSelected, setEditConstructionSelected] =
    useState<EditCategoryInvest>({});

  const prevParamsRef = useRef<any>(params);

  useEffect(() => {
    setParams({ ...params, page: 1 });
    setFilter({
      ...filter,
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
    if (item.key === 5) {
      return {
        ...item,
        render: (_: any, record: any) => (
          <>
            <ListButtonActionUpdate
              editFunction={() =>
                openEditCategoryConstructionModal({
                  constructionTypeId: record.constructionTypeId,
                  constructionTypeName: record.constructionTypeName,
                  constructionName: record.constructionName,
                  constructionNameId: record.constructionNameId,
                  lowPrice: record.lowPrice,
                  highPrice: record.highPrice,
                })
              }
              editButtonCode={BUTTON_CODES.dm_ctxd_sua}
              // removeButtonCode={BUTTON_CODES.dm_kgxvdt_xoa}
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
        <CardTitleCustomUpdate title="Danh sách công trình xây dựng" />
        <ButtonCustom
          label="Thêm công trình xây dựng"
          type="primary"
          onClick={openCreateCategoryConstructionModal}
          bgColor="rgba(40, 98, 175, 1)"
          code={BUTTON_CODES.dm_ctxd_them}
        />
      </div>
      <TableCustom
        dataSource={data ? data.data : []}
        columns={columns}
        bordered={true}
        isLoading={!data?.data && isLoading}
        limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
        total={data ? data.total : 0}
        onLimitChange={(limit) => {
          setParams({ ...params, limit });
        }}
        onPageChange={(page) => {
          setParams({ ...params, page });
        }}
        page={params.page || 1}
      />
      <div className="total-Page-Invest">
        <Typography.Text style={{ fontSize: "14px" }} ellipsis={true}>
          Tổng: {data?.total}
        </Typography.Text>
      </div>
      <CreateCategoryConstructionModal
        isOpenModal={isOpenCreateCategoryConstructionModal}
        closeModal={closeCreateCategoryConstructionModal}
      />
      <EditCategoryConstructionModal
        isOpenModal={isOpenEditCategoryConstructionModal}
        closeModal={closeEditCategoryConstructionModal}
        constructionSelected={editConstructionSelected!}
      />
    </Card>
  );
};

export default CategoryConstructionTable;
