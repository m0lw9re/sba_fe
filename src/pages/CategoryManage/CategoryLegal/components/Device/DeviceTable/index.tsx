import { Card, Typography, message } from "antd";
import TableCustom from "components/TableCustom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { randomId } from "utils/string";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import Modal from "../Modal";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { defaultColumns } from "./config";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { useCategoryLegalDoc } from "utils/request";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { categoryApi } from "apis/category";
import { renderSTT } from "utils/common";
import { BUTTON_CODES } from "constant/common";

const DeviceTable = ({ filter, setFilter }: any) => {
  const [record, setRecord] = useState<any>();
  const [actionModal, setActionModal] = useState<"add" | "update" | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const openModal = (action: "add" | "update" | null) => {
    setIsOpenModal(true);
    setActionModal(action);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setActionModal(null);
  };

  const [params, setParams] = useState<any>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
    assetLevelTwoId: 6,
  });

  const { data, isLoading, mutate } = useCategoryLegalDoc(params, filter);

  const prevParamsRef = useRef<any>(params);

  useEffect(() => {
    if (filter.isFiltering) {
      setParams({ ...params, page: 1 });
      setFilter({
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

  const dataTable = data
    ? data?.data?.map((item: any) => {
        return {
          ...item,
          key: randomId(),
        };
      })
    : [];
  const removeRecord = async (id: any) => {
    try {
      const res = await categoryApi.deleteLegalDoc(id);
      if (res?.data?.code !== 200) {
        throw { message: res?.data?.message };
      }
      mutate();
    } catch (error: any) {
      message.error(error?.message ?? "Đã có lỗi xảy ra");
    }
  };
  const columns = defaultColumns.map((item) => {
    if (item.key === 1) {
      return {
        ...item,
        width: "5%",
        render: (_: any, record: any, index: any) => {
          return renderSTT(params.page, params.limit, index);
        },
      };
    }
    if (item.key === 7) {
      return {
        ...item,
        render: (_: any, _record: any) => (
          <>
            <ListButtonActionUpdate
              editFunction={() => {
                openModal("update");
                setRecord(_record);
              }}
              removeFunction={() => {
                removeRecord(_record?.legalDocumentTypeId);
              }}
              removeButtonCode={BUTTON_CODES.dm_hspl_xoa}
              editButtonCode={BUTTON_CODES.dm_hspl_sua}
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
        <CardTitleCustomUpdate title="Danh sách hồ sơ pháp lý" />
        <ButtonCustom
          label="Thêm hồ sơ pháp lý"
          type="primary"
          onClick={() => {
            setRecord(null);
            openModal("add");
          }}
          bgColor="rgba(40, 98, 175, 1)"
          code={BUTTON_CODES.dm_hspl_them}
        />
      </div>

      <TableCustom
        bordered={true}
        columns={columns}
        dataSource={dataTable}
        isLoading={isLoading}
        limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
        total={data?.total || 0}
        onLimitChange={(limit) => {
          setParams({ ...params, limit, page: 1 });
        }}
        onPageChange={(page) => {
          setParams({ ...params, page });
        }}
        page={params.page || 1}
      />
      <div className="total-Page-HSPLMMTB">
        <Typography.Text style={{ fontSize: "14px" }} ellipsis={true}>
          Tổng: {data?.total}
        </Typography.Text>
      </div>
      <Modal
        isOpenModal={isOpenModal}
        closeModal={closeModal}
        record={record}
        action={actionModal}
        mutate={mutate}
      />
    </Card>
  );
};

export default DeviceTable;
