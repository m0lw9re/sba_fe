import { Card, message } from "antd";
import "./style.scss";
import { defaultColumns } from "./config";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CommonGetAllParams } from "constants/types/common.type";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { feeScheduleFilter, updateFeeSchedule } from "constant/types";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import ButtonCustom from "components/ButtonCustom";
import TableCustom from "components/TableCustom";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { useListFeeSchedule } from "utils/request";
import ModalCreateFeeSchedule from "pages/CategoryManage/CategoryFee/components/ModalCreate";
import { feeScheduleApi } from "apis/feeSchedule";
import ModalUpdateFeeSchedule from "pages/CategoryManage/CategoryFee/components/ModalUpdate";

type Props = {
  filters: feeScheduleFilter;
  setFilters: (filters: feeScheduleFilter) => void;
};

const CategoryFeeSchedule: React.FC<Props> = ({ filters, setFilters }) => {
  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const [isOpenModalCreateFee, setIsOpenModalCreateFee] =
    useState<boolean>(false);

  const [isOpenModalUpdateFee, setIsOpenModalUpdateFee] =
    useState<boolean>(false);

  const openModalCreateFee = () => {
    setIsOpenModalCreateFee(true);
  };
  const closeModalCreateFee = () => {
    mutate();
    setIsOpenModalCreateFee(false);
  };

  const openModalUpdateFee = (record: any) => {
    setIsOpenModalUpdateFee(true);
    setUpdateFeeScheduleSelected(record);
  };

  const closeModalUpdateFee = () => {
    mutate();
    setIsOpenModalUpdateFee(false);
  };

  const [updateFeeScheduleSelected, setUpdateFeeScheduleSelected] =
    useState<updateFeeSchedule>();

  const { data, isLoading, error, mutate } = useListFeeSchedule(params, {
    ...filters,
    applyPromotion:
      filters?.applyPromotion === true || filters?.applyPromotion === false
        ? filters?.applyPromotion.toString()
        : null,
  });

  const prevParamsRef = useRef<any>(params);

  useEffect(() => {
    setParams({ ...params, page: 1 });
    setFilters({
      ...filters,
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

  const handleRemove = async (id: number) => {
    try {
      const response = await feeScheduleApi.deleteFeeSchedule(id);
      if (response.data.statusCode === 200) {
        message.success(response.data.message);
        mutate();
      } else message.error(response.data.message);
    } catch {
      message.error(error);
    }
  };

  const columns = defaultColumns.map((item: any) => {
    if (item.key === 1) {
      return {
        ...item,
        width: "5%",
        render: (_: any, record: any, index: any) => {
          return (Number(params.page) - 1) * Number(params.limit) + index + 1;
        },
      };
    }
    if (item.key === 22) {
      return {
        ...item,
        render: (_: any, record: any) => (
          <>
            <ListButtonActionUpdate
              editFunction={() => openModalUpdateFee(record)}
              removeFunction={() => handleRemove(record.id)}
            />
          </>
        ),
      };
    }
    return { ...item };
  });

  return (
    <Card className="card-container" size="small">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <CardTitleCustomUpdate title="Danh sách biểu phí định giá" />
        <ButtonCustom
          label="Thêm biểu phí mới"
          type="primary"
          onClick={openModalCreateFee}
          bgColor="rgba(40, 98, 175, 1)"
        />
      </div>

      <TableCustom
        dataSource={data ? data?.data?.items : []}
        columns={columns}
        bordered={true}
        isLoading={!data?.data && isLoading}
        limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
        total={data ? data?.data?.total : 0}
        onLimitChange={(limit) => {
          setParams({ ...params, limit });
        }}
        onPageChange={(page) => {
          setParams({ ...params, page });
        }}
        page={params.page || 1}
        scroll={{ x: "1980px" }}
      />

      <ModalCreateFeeSchedule
        isOpenModal={isOpenModalCreateFee}
        closeModal={closeModalCreateFee}
      />
      <ModalUpdateFeeSchedule
        isOpenModal={isOpenModalUpdateFee}
        closeModal={closeModalUpdateFee}
        feeScheduleSelected={updateFeeScheduleSelected}
      />
    </Card>
  );
};

export default CategoryFeeSchedule;
