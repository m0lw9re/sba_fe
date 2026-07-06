import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import TableCustom from "components/TableCustom";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { useState } from "react";
import { defaultColumns } from "./config";
import { useKPIBonusCoefficient } from "utils/request";
import { Card, message } from "antd";
import ButtonCustom from "components/ButtonCustom";
import { categoryApi } from "apis/category";
import ComponentsError from "pages/ComponentsError";
import ModalKPIBonus from "pages/CategoryManage/CategoryKpi/components/ConvertIndex/ModalKPIBonus";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { BUTTON_CODES } from "constant/common";
import { KPIBonusCoefficientType } from "constant/types/categories";

const TableKPIBonusCoefficient = () => {
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>();
  const [selectedRecord, setSelectedRecord] =
    useState<KPIBonusCoefficientType | null>(null);
  const [params, setParams] = useState<any>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  const { data, isLoading, error, mutate } = useKPIBonusCoefficient(
    params,
    filter
  );

  const deleteRecord = async (record: any) => {
    try {
      await categoryApi.deleteKPIBonusCoefficient(record?.id);
      message.success(`Đã xóa hệ số thưởng hồ sơ`);
      mutate();
    } catch (error) {
      message.error(`Đã có lỗi khi xóa hệ số thưởng hồ sơ`);
    }
  };
  const columns = defaultColumns.map((item: any) => {
    if (item.key === 1) {
      return {
        ...item,
        render: (value: any, record: any, index: any) => {
          return (Number(params.page) - 1) * Number(params.limit) + index + 1;
        },
      };
    }
    if (item.key === 6) {
      return {
        ...item,
        render: (_: any, record: any) => (
          <>
            <ListButtonActionUpdate
              editFunction={() => {
                setSelectedRecord(record);
                setOpenCreateModal(true);
              }}
              removeFunction={() => {
                deleteRecord(record);
              }}
              removeButtonCode={BUTTON_CODES.dm_kpi_xoa}
              editButtonCode={BUTTON_CODES.dm_kpi_sua}
            />
          </>
        ),
      };
    } else return { ...item };
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
        <CardTitleCustomUpdate title="Hệ số thưởng KPIs" />
        <ButtonCustom
          label="Thêm hệ số thưởng"
          bgColor="#2862AF"
          onClick={() => {
            setSelectedRecord(null);
            setOpenCreateModal(true);
          }}
          type="primary"
          size="small"
          code={BUTTON_CODES.dm_kpi_them}
        />
      </div>
      {error ? (
        <ComponentsError />
      ) : (
        <TableCustom
          bordered={true}
          columns={columns}
          dataSource={data?.data}
          isLoading={isLoading}
          limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
          total={data?.total || 0}
          onLimitChange={(limit) => {
            setParams({ ...params, limit });
          }}
          onPageChange={(page) => {
            setParams({ ...params, page });
          }}
          page={params.page || 1}
        />
      )}
      <ModalKPIBonus
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        mutate={mutate}
        record={selectedRecord}
      />
    </Card>
  );
};

export default TableKPIBonusCoefficient;
