import { Card, Typography, message } from "antd";
import TableCustom from "components/TableCustom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import {
  EditCategoryRegionsType,
  FilterCategoryRegionsType,
} from "constant/types/categoryregions";
import CreateCategoryRegionsModal from "../CreateCategoryRegionsModal";
import EditCategoryRegionsModal from "../EditCategoryRegionsModal";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { defaultColumns } from "./config";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { regionsApi } from "apis/regions";
import { GetAllCommonType } from "constant/types";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { useCategoryBranch } from "utils/request";
import ComponentsError from "pages/ComponentsError";
import { BUTTON_CODES } from "constant/common";

type Props = {
  filters: FilterCategoryRegionsType;
  setFilters: (filters: FilterCategoryRegionsType) => void;
};

const CategoryRegionsTable: React.FC<Props> = ({ filters, setFilters }) => {
  const [
    isOpenCreateCategoryRegionsModal,
    setIsOpenCreateCategoryRegionsModal,
  ] = useState<boolean>(false);

  const [isOpenEditCategoryRegionsModal, setIsOpenEditCategoryRegionsModal] =
    useState<boolean>(false);

  const [editRegionSelected, setEditRegionSelected] =
    useState<EditCategoryRegionsType>();

  const openCreateCategoryRegionsModal = () => {
    setIsOpenCreateCategoryRegionsModal(true);
  };

  const closeCreateCategoryRegionsModal = () => {
    mutate();
    setIsOpenCreateCategoryRegionsModal(false);
  };

  const openEditCategoryRegionsModal = (record: EditCategoryRegionsType) => {
    setIsOpenEditCategoryRegionsModal(true);
    setEditRegionSelected(record);
    mutate();
  };

  const closeEditCategoryRegionsModal = () => {
    mutate();
    setIsOpenEditCategoryRegionsModal(false);
  };

  const handleRemove = async (companyBranchId: string) => {
    try {
      const response = await regionsApi.delete(companyBranchId);
      if (response.data.code === 200) {
        message.success("Xoá chi nhánh thành công");
        mutate();
      } else message.error("Xoá chi nhánh thất bại!");
    } catch {
      message.error("Xoá chi nhánh thất bại!");
    }
  };

  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
    status: 1,
  });

  const { data, isLoading, error, mutate } = useCategoryBranch(params, filters);

  const prevParamsRef = useRef<any>(params);

  useEffect(() => {
    setParams({ ...params, page: 1 });
    setFilters({
      ...filters,
      isFiltering: false,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

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
              editFunction={() => {
                openEditCategoryRegionsModal({
                  addressProvince: record.addressProvince,
                  addressDistrict: record.addressDistrict,
                  addressWard: record.addressWard,
                  addressStreet: record.addressStreet,
                  addressDetail: record.addressDetail,
                  companyBranchName: record.companyBranchName,
                  code: record.code,
                  companyBranchId: record.companyBranchId,
                });
              }}
              removeFunction={() => handleRemove(record.companyBranchId)}
              disable={record.code === "SG" || record.code === "HN"}
              removeButtonCode={BUTTON_CODES.dm_chi_nhanh_xoa}
              editButtonCode={BUTTON_CODES.dm_chi_nhanh_sua}
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
        <CardTitleCustomUpdate title="Danh sách chi nhánh" />
        <ButtonCustom
          label="Thêm chi nhánh"
          type="primary"
          onClick={openCreateCategoryRegionsModal}
          bgColor="rgba(40, 98, 175, 1)"
          code={BUTTON_CODES.dm_chi_nhanh_them}
        />
      </div>

      <TableCustom
        bordered={true}
        columns={columns}
        dataSource={data?.data || []}
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
        <div className="total-Page-Regions">
          <Typography.Text style={{ fontSize: "14px" }} ellipsis={true}>
            Tổng: {data?.total}
          </Typography.Text>
        </div>
      <CreateCategoryRegionsModal
        isOpenModal={isOpenCreateCategoryRegionsModal}
        closeModal={closeCreateCategoryRegionsModal}
      />
      <EditCategoryRegionsModal
        isOpenModal={isOpenEditCategoryRegionsModal}
        closeModal={closeEditCategoryRegionsModal}
        regionSelected={editRegionSelected!}
      />
    </Card>
  );
};

export default CategoryRegionsTable;
