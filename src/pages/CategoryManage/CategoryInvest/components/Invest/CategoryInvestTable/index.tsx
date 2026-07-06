import { Card, Typography } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import "pages/AppraisalFiles/subcomponent/AppraisalFilesTable/style.scss";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CommonGetAllParams } from "constants/types/common.type";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { FilterCategoriesBussinessFeeType } from "constant/types/categories";
import ButtonCustom from "components/ButtonCustom";
import { useCategoryInvest } from "utils/request/useCategoryInvest";
import { categoryApi } from "apis/category";
import "./style.scss";
import ComponentsError from "pages/ComponentsError";
import CreateCategoryInvestModal from "../ModalCreate";
import { EditCategoryInvest } from "constant/types";
import EditCategoryInvestModal from "../ModalEdit";
import { defaultColumns } from "./config";
import { BUTTON_CODES } from "constant/common";

type Props = {
  filter: FilterCategoriesBussinessFeeType;
  setFilter: (filter: FilterCategoriesBussinessFeeType) => void;
};
const CategoryInvestTable: FC<Props> = ({ filter, setFilter }) => {
  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const [constructionType, setConstructionType] = useState([]);

  const getConstructionType = async () => {
    try {
      const reponse = await categoryApi.getContructionType();
      setConstructionType(reponse.data);
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    getConstructionType();
  }, []);

  const [isOpenCreateCategoryInvestModal, setIsOpenCategoryInvestModal] =
    useState<boolean>(false);

  const openCreateCategoryInvestModal = () => {
    setIsOpenCategoryInvestModal(true);
  };

  const closeCreateCategoryInvestModal = () => {
    mutate();
    setIsOpenCategoryInvestModal(false);
  };

  const [isOpenEditCategoryInvestModal, setIsEditCategoryInvestModal] =
    useState<boolean>(false);

  const openEditCategoryInvestModal = (record: EditCategoryInvest) => {
    setIsEditCategoryInvestModal(true);
    setEditInvestSelected(record);
  };

  const closeEditCategoryInvestModal = () => {
    mutate();
    setIsEditCategoryInvestModal(false);
  };

  const { data, isLoading, error, mutate } = useCategoryInvest(params, filter);

  const [editInvestSelected, setEditInvestSelected] =
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
    if (item.key === 7) {
      return {
        ...item,
        render: (_: any, record: any) => (
          <>
            <ListButtonActionUpdate
              editFunction={() =>
                openEditCategoryInvestModal({
                  constructionTypeId: record.constructionTypeId,
                  constructionTypeName: record.constructionTypeName,
                  constructionName: record.constructionName,
                  constructionNameId: record.constructionNameId,
                  lowPrice: record.lowPrice,
                  highPrice: record.highPrice,
                })
              }
              editButtonCode={BUTTON_CODES.dm_kgxvdt_sua}
              removeButtonCode={BUTTON_CODES.dm_kgxvdt_xoa}
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
        <CardTitleCustomUpdate title="Danh sách khung giá suất vốn đầu tư" />
        <ButtonCustom
          label="Thêm khung giá suất vốn đầu tư"
          type="primary"
          onClick={openCreateCategoryInvestModal}
          bgColor="rgba(40, 98, 175, 1)"
          code={BUTTON_CODES.dm_kgxvdt_them}
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
      <CreateCategoryInvestModal
        isOpenModal={isOpenCreateCategoryInvestModal}
        closeModal={closeCreateCategoryInvestModal}
        constructionType={constructionType}
      />
      <EditCategoryInvestModal
        isOpenModal={isOpenEditCategoryInvestModal}
        closeModal={closeEditCategoryInvestModal}
        investSelected={editInvestSelected!}
        constructionType={constructionType}
      />
    </Card>
  );
};

export default CategoryInvestTable;
