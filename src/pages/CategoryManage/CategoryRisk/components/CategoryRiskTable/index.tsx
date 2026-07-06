import { Card, Typography, message } from "antd";
import TableCustom from "components/TableCustom";
import { EditCategoryRisk } from "constants/types/common.type";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import { useCategoryRisk } from "utils/request/useCategoryRisk";
import { FilterCategoryRiskType, GetAllCommonType } from "constant/types";
import CreateCategoryRiskModal from "../CreateCategoryRiskModal";
import EditCategoryRiskModal from "../EditCategoryRiskModal";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { defaultColumns } from "./config";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { riskApi } from "apis/risk";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import ComponentsError from "pages/ComponentsError";
import { BUTTON_CODES } from "constant/common";

type Props = {
  filters: FilterCategoryRiskType;
  setFilters: (filters: FilterCategoryRiskType) => void;
};

const CategoryRiskTable: React.FC<Props> = ({ filters, setFilters }) => {
  const [assetLevelTwo, setAssetLevelTwo] = useState([]);

  const getAssetLevelTwo = async () => {
    try {
      const response = await riskApi.getAssetLevelTwo();
      setAssetLevelTwo(response.data);
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    getAssetLevelTwo();
  }, []);

  const [isOpenCreateCategoryRiskModal, setIsOpenCreateCategoryRiskModal] =
    useState<boolean>(false);

  const [isOpenEditCategoryRiskModal, setIsOpenEditCategoryRiskModal] =
    useState<boolean>(false);

  const openCreateCategoryRiskModal = () => {
    setIsOpenCreateCategoryRiskModal(true);
  };

  const closeCreateCategoryRiskModal = () => {
    mutate();
    setIsOpenCreateCategoryRiskModal(false);
  };

  const openEditCategoryRiskModal = (record: EditCategoryRisk) => {
    setIsOpenEditCategoryRiskModal(true);
    setEditRiskSelected(record);
  };

  const closeEditCategoryRiskModal = () => {
    mutate();
    setIsOpenEditCategoryRiskModal(false);
  };

  const [editRiskSelected, setEditRiskSelected] = useState<EditCategoryRisk>();

  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
    status: 1,
  });

  const handleRemove = async (riskAssetId: string) => {
    try {
      const response = await riskApi.delete(riskAssetId);
      if (response.data.code === 200) {
        message.success("Xoá cảnh báo rủi ro thành công");
        mutate();
        // if (roleCode) {
        //   try {
        //     const reponse = await accountRoleApi.getAccountRole(roleCode);
        //     onChange({ repairHistories: response.data });
        //   } catch {
        //     message.error("Lấy thông tin thất bại!");
        //   }
        // }
      } else message.error("Xoá cảnh báo rủi ro thất bại!");
    } catch {
      message.error("Xoá cảnh báo rủi ro thất bại!");
    }
  };

  const { data, isLoading, error, mutate } = useCategoryRisk(params, filters);

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
              editFunction={() =>
                openEditCategoryRiskModal({
                  riskContent: record.riskContent,
                  riskLevel: record.riskLevel,
                  riskAssetId: record.riskAssetId,
                  assetLevelTwoId: record.assetLevelTwoId,
                  description: record.description,
                })
              }
              removeFunction={() => handleRemove(record.riskAssetId)}
              removeButtonCode={BUTTON_CODES.dm_cbrr_xoa}
              editButtonCode={BUTTON_CODES.dm_cbrr_sua}
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
        <CardTitleCustomUpdate title="Danh sách cảnh báo rủi ro" />
        <ButtonCustom
          label="Thêm cảnh báo rủi ro"
          type="primary"
          onClick={openCreateCategoryRiskModal}
          bgColor="rgba(40, 98, 175, 1)"
          code={BUTTON_CODES.dm_cbrr_them}
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
      <div className="total-Page-Risk">
        <Typography.Text style={{ fontSize: "14px" }} ellipsis={true}>
          Tổng: {data?.total}
        </Typography.Text>
      </div>
      <CreateCategoryRiskModal
        isOpenModal={isOpenCreateCategoryRiskModal}
        closeModal={closeCreateCategoryRiskModal}
        assetLevelTwo={assetLevelTwo}
      />
      <EditCategoryRiskModal
        isOpenModal={isOpenEditCategoryRiskModal}
        closeModal={closeEditCategoryRiskModal}
        riskSelected={editRiskSelected!}
        assetLevelTwo={assetLevelTwo}
      />
    </Card>
  );
};

export default CategoryRiskTable;
