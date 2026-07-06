import { Card, Typography } from "antd";
import TableCustom from "components/TableCustom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import { useCategoryStaffPosition } from "utils/request";
import {
  FilterCategoryStaffPositionType,
  UpdateCategoryStaffPositionType,
  GetAllCommonType,
} from "constant/types";
import CreateCategoryStaffPositionModal from "../CreateCategoryStaffPositionModal";
import CategoryStaffPositionUpdateModal from "../CategoryStaffPositionUpdateModal";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { defaultColumns } from "./config";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import ComponentsError from "pages/ComponentsError";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { BUTTON_CODES } from "constant/common";

type Props = {
  filter: FilterCategoryStaffPositionType;
  setFilter: (filters: FilterCategoryStaffPositionType) => void;
};

const CategoryStaffPositionTable: React.FC<Props> = ({ filter, setFilter }) => {
  const [
    isOpenCreateCategoryStaffPositionModal,
    setIsOpenCreateCategoryStaffPositionModal,
  ] = useState<boolean>(false);

  const [
    isOpenCategoryStaffPositionUpdateModal,
    setIsOpenCategoryStaffPositionUpdateModal,
  ] = useState<boolean>(false);

  const [editStaffPositionSelected, setEditStaffPositionSelected] =
    useState<UpdateCategoryStaffPositionType>();

  const openCreateCategoryStaffPositionModal = () => {
    setIsOpenCreateCategoryStaffPositionModal(true);
  };

  const closeCreateCategoryStaffPositionModal = () => {
    mutate();
    setIsOpenCreateCategoryStaffPositionModal(false);
  };

  const openCategoryStaffPositionUpdateModal = (
    record: UpdateCategoryStaffPositionType,
  ) => {
    setIsOpenCategoryStaffPositionUpdateModal(true);
    setEditStaffPositionSelected(record);
  };

  const closeCategoryStaffPositionUpdateModal = () => {
    mutate();
    setIsOpenCategoryStaffPositionUpdateModal(false);
  };

  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
    status: 1,
  });

  const { data, isLoading, error, mutate } = useCategoryStaffPosition(
    params,
    filter,
  );

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
                openCategoryStaffPositionUpdateModal({
                  positionId: record.positionId,
                  term: record.term,
                  positionName: record.positionName,
                })
              }
              editButtonCode={BUTTON_CODES.dm_vi_tri_sua}
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
        <CardTitleCustomUpdate title="Danh sách vị trí" />
        <ButtonCustom
          label="Thêm vị trí"
          type="primary"
          onClick={openCreateCategoryStaffPositionModal}
          bgColor="rgba(40, 98, 175, 1)"
          code={BUTTON_CODES.dm_vi_tri_them}
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
      <CreateCategoryStaffPositionModal
        isOpenModal={isOpenCreateCategoryStaffPositionModal}
        closeModal={closeCreateCategoryStaffPositionModal}
      />
      <CategoryStaffPositionUpdateModal
        isOpenModal={isOpenCategoryStaffPositionUpdateModal}
        closeModal={closeCategoryStaffPositionUpdateModal}
        staffPositionSelected={editStaffPositionSelected!}
      />
    </Card>
  );
};

export default CategoryStaffPositionTable;
