import { Card, Typography, message } from "antd";
import TableCustom from "components/TableCustom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import { useCategoryDepartment } from "utils/request";
import {
  FilterCategoryDepartmentType,
  UpdateCategoryDepartmentType,
  GetAllCommonType,
} from "constant/types";
import CreateCategoryDepartmentModal from "../CreateCategoryDepartmentModal";
import CategoryDepartmentUpdateModal from "../CategoryDepartmentUpdateModal";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { defaultColumns } from "./config";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import ComponentsError from "pages/ComponentsError";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { BUTTON_CODES } from "constant/common";
import { categoryDepartmentApi } from "apis/categoryDepartment";

type Props = {
  filter: FilterCategoryDepartmentType;
  setFilter: (filters: FilterCategoryDepartmentType) => void;
};

const CategoryDepartmentTable: React.FC<Props> = ({ filter, setFilter }) => {
  const [
    isOpenCreateCategoryDepartmentModal,
    setIsOpenCreateCategoryDepartmentModal,
  ] = useState<boolean>(false);

  const [
    isOpenCategoryDepartmentUpdateModal,
    setIsOpenCategoryDepartmentUpdateModal,
  ] = useState<boolean>(false);

  const [editDepartmentSelected, setEditDepartmentSelected] =
    useState<UpdateCategoryDepartmentType>();

  const openCreateCategoryDepartmentModal = () => {
    setIsOpenCreateCategoryDepartmentModal(true);
  };

  const closeCreateCategoryDepartmentModal = () => {
    mutate();
    setIsOpenCreateCategoryDepartmentModal(false);
  };

  const openCategoryDepartmentUpdateModal = (
    record: UpdateCategoryDepartmentType,
  ) => {
    setIsOpenCategoryDepartmentUpdateModal(true);
    setEditDepartmentSelected(record);
  };

  const closeCategoryDepartmentUpdateModal = () => {
    mutate();
    setIsOpenCategoryDepartmentUpdateModal(false);
  };

  const handleRemove = async (departmentId: string) => {
    try {
      const response = await categoryDepartmentApi.delete(departmentId);
      if (response.data.code === 200) {
        message.success("Xoá phòng ban thành công");
        mutate();
      } else message.error("Xoá phòng ban thất bại!");
    } catch {
      message.error("Xoá phòng ban thất bại!");
    }
  };

  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
    status: 1,
  });

  const { data, isLoading, error, mutate } = useCategoryDepartment(
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
                openCategoryDepartmentUpdateModal({
                  departmentId: record.departmentId,
                  departmentCode: record.departmentCode,
                  departmentName: record.departmentName,
                })
              }
              removeFunction={() => handleRemove(record.departmentId)}
              removeButtonCode={BUTTON_CODES.dm_phong_ban_xoa}
              editButtonCode={BUTTON_CODES.dm_phong_ban_sua}
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
        <CardTitleCustomUpdate title="Danh sách phòng ban" />
        <ButtonCustom
          label="Thêm phòng ban"
          type="primary"
          onClick={openCreateCategoryDepartmentModal}
          bgColor="rgba(40, 98, 175, 1)"
          code={BUTTON_CODES.dm_phong_ban_them}
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
      <CreateCategoryDepartmentModal
        isOpenModal={isOpenCreateCategoryDepartmentModal}
        closeModal={closeCreateCategoryDepartmentModal}
      />
      <CategoryDepartmentUpdateModal
        isOpenModal={isOpenCategoryDepartmentUpdateModal}
        closeModal={closeCategoryDepartmentUpdateModal}
        departmentSelected={editDepartmentSelected!}
      />
    </Card>
  );
};

export default CategoryDepartmentTable;
