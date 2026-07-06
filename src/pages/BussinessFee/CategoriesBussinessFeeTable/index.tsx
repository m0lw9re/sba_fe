import { Card, Tooltip, Typography, message } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import "pages/AppraisalFiles/subcomponent/AppraisalFilesTable/style.scss";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CommonGetAllParams } from "constants/types/common.type";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { ColumnsType } from "antd/es/table";
import { randomId } from "utils/string";
import {
  CategoriesBussinessFeeType,
  FilterCategoriesBussinessFeeType,
} from "constant/types/categories";
import ButtonCustom from "components/ButtonCustom";
import { useFeeBussiness } from "utils/request/useBussinessFee";
import { categoryApi } from "apis/category";
import EditCategoriesBussinessFeeModal from "../EditCategoriesBussinessFeeModal";
import { numberUtils } from "utils";
import "./style.scss";
import { BUTTON_CODES } from "constant/common";

type Props = {
  filter: FilterCategoriesBussinessFeeType;
  setFilters: (filters: FilterCategoriesBussinessFeeType) => void;
};
const CategoriesBussinessFeeTable: FC<Props> = ({ filter, setFilters }) => {
  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  const [editCatBussinessFeeItem, setEditCatBussinessFeeItem] =
    useState<CategoriesBussinessFeeType>({});
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "edit" | null>(null);
  const handleCreate = () => {
    setOpenAddModal(true);
    setModalType("add");
  };
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setModalType(null);
  };
  const handleEdit = (
    bussinessFeeId: number,
    branchCode: string,
    provinceCode: string,
    bussinessFee: number
  ) => {
    setOpenAddModal(true);
    setModalType("edit");
    const categoryBussinessFeeItem: CategoriesBussinessFeeType = {
      feeBusinessId: bussinessFeeId,
      provinceCode: provinceCode,
      branchCode: branchCode,
      businessFee: bussinessFee,
    };
    setEditCatBussinessFeeItem(categoryBussinessFeeItem);
  };

  const { data, isLoading, mutate } = useFeeBussiness(params, filter);

  const handleDelete = async (id: number) => {
    const res = await categoryApi.deleteBussinessFee(id);
    if (res.data.body.code === 200) {
      message.success(res.data.body.message);
      mutate();
    } else {
      message.error(res.data.body.message);
    }
  };
  const dataTable = data
    ? data.data.map((item: any) => {
        return {
          ...item,
          key: randomId(),
        };
      })
    : [];

  const columns: ColumnsType<CategoriesBussinessFeeType> = [
    {
      key: 1,
      title: "STT",
      align: "center",
      render: (_, record, index) => {
        return (Number(params.page) - 1) * Number(params.limit) + index + 1;
      },
    },
    {
      key: 2,
      title: "Chi nhánh (điểm đi)",
      dataIndex: "diemDi",
      align: "left",
      render: (diemDi) => (
        <Tooltip title={diemDi}>
          <div className="inline-text">{diemDi}</div>
        </Tooltip>
      ),
    },
    {
      key: 3,
      title: "Tỉnh/Thành phố (điểm đến)",
      dataIndex: "diemDen",
      align: "left",
      render: (diemDen) => (
        <Tooltip title={diemDen}>
          <div className="inline-text">{diemDen}</div>
        </Tooltip>
      ),
    },
    {
      key: 4,
      title: "Phí công tác",
      dataIndex: "businessFee",
      align: "right",
      render: (businessFee) => (
        <Tooltip title={businessFee}>
          <div className="inline-text">
            {numberUtils.formatNumber(businessFee)}
          </div>
        </Tooltip>
      ),
    },
    {
      key: 5,
      title: "Hành động",
      align: "center",
      render: (_, record: any) => (
        <>
          <ListButtonActionUpdate
            editFunction={() =>
              handleEdit(
                record.feeBusinessId,
                record.branchCode,
                record.provinceCode,
                record.businessFee
              )
            }
            removeFunction={() => handleDelete(record.feeBusinessId)}
            removeButtonCode={BUTTON_CODES.dm_ctp_xoa}
            editButtonCode={BUTTON_CODES.dm_ctp_sua}
          />
        </>
      ),
    },
  ];

  const prevParamsRef = useRef<any>(params);

  useEffect(() => {
    if (filter.isFiltering) {
      setParams({ ...params, page: 1 });
      setFilters({
        ...filter,
        isFiltering: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

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

  return (
    <div className="categories-administratives-table-container">
      <Card className="card-container" size="small">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <CardTitleCustomUpdate title="Danh sách công tác phí" />
          <ButtonCustom
            label="Thêm công tác phí"
            type="primary"
            onClick={handleCreate}
            bgColor="rgba(40, 98, 175, 1)"
            code={BUTTON_CODES.dm_snck_them}
          />
        </div>
        <TableCustom
          dataSource={dataTable}
          columns={columns}
          bordered={true}
          isLoading={!data && isLoading}
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
        <div className="total-Page-BussinessFee">
          <Typography.Text style={{ fontSize: "14px" }} ellipsis={true}>
            Tổng: {data?.total}
          </Typography.Text>
        </div>
      </Card>
      <EditCategoriesBussinessFeeModal
        isOpenModal={openAddModal}
        closeModal={handleCloseAddModal}
        provinceCode={editCatBussinessFeeItem.provinceCode || null}
        branchCode={editCatBussinessFeeItem.branchCode || null}
        bussinessFee={editCatBussinessFeeItem.businessFee || null}
        modalType={modalType}
        bussinessFeeId={editCatBussinessFeeItem.feeBusinessId || null}
        mutate={mutate}
      />
    </div>
  );
};

export default CategoriesBussinessFeeTable;
