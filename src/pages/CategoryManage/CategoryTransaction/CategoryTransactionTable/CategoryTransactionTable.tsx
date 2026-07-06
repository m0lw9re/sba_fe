import { Card, Space, Typography, message } from "antd";
import TableCustom from "components/TableCustom";
import { useEffect, useState, useLayoutEffect, useRef } from "react";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import CreateCategoryTransactionModal from "../components/CreateTransactionBranchModal";
import EditCategoryTransactionModal from "../components/EditTransactionBranchModal";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { defaultColumns } from "./config";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { GetAllCommonType } from "constant/types";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { useCategoryTransaction } from "utils/request";
import {
  FilterCategoryTransactionType,
  EditCategoryTransactionType,
} from "constant/types";
import ModalViewTransactionTable from "./ModalViewTransactionTable";
import { transactionsApi } from "apis/transactions";
import ComponentsError from "pages/ComponentsError";
import TransactionBranchTable from "pages/CategoryManage/CategoryTransaction/CategoryTransactionTable/TransactionBranchChild";
import { BUTTON_CODES } from "constant/common";
import CreatePGDModal from "../components/CreateTransactionOfficeModal";

type Props = {
  filters: FilterCategoryTransactionType;
  setFilters: (filters: FilterCategoryTransactionType) => void;
};

const CategoryTransactionTable: React.FC<Props> = ({ filters, setFilters }) => {
  const [
    isOpenCreateCategoryTransactionModal,
    setIsOpenCreateCategoryTransactionModal,
  ] = useState<boolean>(false);

  const openCreateCategoryTransactionModal = () => {
    setIsOpenCreateCategoryTransactionModal(true);
  };

  const closeCreateCategoryTransactionModal = () => {
    setIsOpenCreateCategoryTransactionModal(false);
    mutate();
  };

  const [isOpenCreateOfficeModal, setIsOpenCreateOfficeModal] =
    useState<boolean>(false);

  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
    status: 1,
  });

  const handleRemove = async (branchCode: string) => {
    try {
      const response = await transactionsApi.delete(branchCode);
      if (response.data.code === 200) {
        message.success("Xoá chi nhánh thành công");
        mutate();
      } else message.error("Xoá chi nhánh thất bại!");
    } catch {
      message.error("Xoá chi nhánh thất bại!");
    }
  };

  const { data, isLoading, error, mutate } = useCategoryTransaction(
    params,
    filters
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const handleExpandRow = (expanded: boolean, record: any) => {
    console.log(record);
    setExpandedRowKeys(
      expanded
        ? [...expandedRowKeys, record.regionCode]
        : expandedRowKeys.filter((key) => key !== record.regionCode)
    );

    // if (expanded) {
    //   setExpandedRowKeys((prevKeys) => [...prevKeys, record.key]);
    // } else {
    //   setExpandedRowKeys((prevKeys) =>
    //     prevKeys.filter((key) => key !== record.key)
    //   );
    // }
  };

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
    // if (item.key === 7) {
    //   return {
    //     ...item,
    //     render: (_: any, record: any) => (
    //       <>
    //         <ListButtonActionUpdate
    //           editFunction={() =>
    //             openEditCategoryTransactionModal({
    //               branchCode: record.branchCode,
    //               branchName: record.branchName,
    //               address: record.address,
    //               email: record.email,
    //               phoneNumber: record.phoneNumber,
    //             })
    //           }
    //           removeFunction={() => handleRemove(record.branchCode)}
    //         />
    //       </>
    //     ),
    //   };
    // }
    return { ...item };
  });

  const getBranches = (data: any) => {
    return data.map((region: any) => ({
      label: region.regionName,
      title: region.regionName,
      options: region.branch.map((branch: any) => ({
        value: branch.branchCode,
        label: branch.branchName,
      })),
    }));
  };

  const branchOptions = getBranches(data ? data.data : []);

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
        <CardTitleCustomUpdate title="Danh sách khu vực/CN" />
        <Space>
          <ButtonCustom
            label="Thêm Chi nhánh"
            type="primary"
            onClick={openCreateCategoryTransactionModal}
            bgColor="rgba(40, 98, 175, 1)"
            code={BUTTON_CODES.dm_kv_them}
          />
          <ButtonCustom
            label="Thêm Phòng giao dịch"
            type="primary"
            bgColor="rgba(40, 98, 175, 1)"
            onClick={() => setIsOpenCreateOfficeModal(true)}
            code={BUTTON_CODES.dm_kv_them}
          />
        </Space>
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
        expandable={{
          expandRowByClick: true,
          indentSize: 0,
          expandedRowKeys: expandedRowKeys,
          expandedRowRender: (record: any) => (
            <TransactionBranchTable
              transContent={record.branch}
              branchOptions={branchOptions}
              mutate={mutate}
            />
          ),
          onExpand: handleExpandRow,
        }}
        rowKey="regionCode"
      />
      <div className="total-Page-Transaction">
        <Typography.Text style={{ fontSize: "14px" }} ellipsis={true}>
          Tổng: {data?.total}
        </Typography.Text>
      </div>
      <CreateCategoryTransactionModal
        isOpenModal={isOpenCreateCategoryTransactionModal}
        closeModal={closeCreateCategoryTransactionModal}
        mutate={mutate}
      />

      <CreatePGDModal
        isOpenModal={isOpenCreateOfficeModal}
        closeModal={() => setIsOpenCreateOfficeModal(false)}
        branchOptions={branchOptions}
        mutate={mutate}
      />
    </Card>
  );
};

export default CategoryTransactionTable;
