import { ColumnsType } from "antd/es/table";
import { KPI_BONUS_COEFFICIENT } from "constant/common";
import { DATE_TIME_FORMAT } from "constant/enums";
import { KPIBonusCoefficientType } from "constant/types/categories";
import dayjs from "dayjs";
import { numberUtils } from "utils";

const defaultColumns: ColumnsType<KPIBonusCoefficientType> = [
  {
    key: 1,
    title: "STT",
    render: (text, record, rowIndex) => rowIndex + 1,
    align: "center",
    width: 60,
  },
  {
    key: 2,
    title: "Loại hệ số thưởng",
    dataIndex: "type",
    width: 400,
    render: (type: string) => {
      let label = "";
      if (type === KPI_BONUS_COEFFICIENT.SURPASSING_KPI)
        label = KPI_BONUS_COEFFICIENT.SURPASSING_KPI_LABEL;
      if (type === KPI_BONUS_COEFFICIENT.PERFORM_24H)
        label = KPI_BONUS_COEFFICIENT.PERFORM_24H_LABEL;
      return label;
    },
  },
  {
    key: 3,
    title: "Hệ số",
    dataIndex: "kpiBonusCoefficient",
    align: "right",
    render: (value: number) => {
      return numberUtils.formatNumber(value || 0);
    },
  },
  {
    key: 4,
    title: "Từ ngày",
    dataIndex: "fromDate",
    align: "center",
    render: (value: string) => {
      return value ? dayjs(value).format(DATE_TIME_FORMAT.day) : null;
    },
  },
  {
    key: 5,
    title: "Đến ngày",
    dataIndex: "toDate",
    align: "center",
    render: (value: string) => {
      return value ? dayjs(value).format(DATE_TIME_FORMAT.day) : null;
    },
  },
  {
    key: 6,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
    width: 120,
  },
];

export { defaultColumns };
