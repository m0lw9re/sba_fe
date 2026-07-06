import { ColumnsType } from "antd/es/table";
import { numberUtils } from "utils";

export interface TableRentalType {
  // Diện tích khuôn viên
  stt1: string;
  type1: string;
  areaWidth: string | number;
  note1: string;

  // Tỷ lệ cho thuê (%)
  stt2: string;
  type2: string;
  rentRatio: string | number;
  note2: string;

  // Diện tích đất cho thuê
  stt3: string;
  type3: string;
  areaRent: string | number;
  note3: string;

  // Tốc độ tăng giá theo thị trường
  stt4: string;
  type4: string;
  growthSpeed: string | number;
  note4: string;

  // Tỷ suất chiết khấu
  stt5: string;
  type5: string;
  discountRate: string | number;
  note5: string;

  // Số năm khai thác còn lại
  stt6: string;
  type6: string;
  remainYears: string | number;
  note6: string;

  // Giả định tốc độ tăng giá của giá Nhà nước
  stt7: string;
  type7: string;
  assumeGrowthSpeed: string | number;
  note7: string;

  // Đơn giá cho thuê theo thị trường
  stt8: string;
  type8: string;
  unitPriceMarket: string | number;
  note8: string;

  // Đơn giá cho thuê theo Nhà nước
  stt9: string;
  type9: string;
  unitPriceState: string | number;
  note9: string;

  // Doanh thu cho thuê
  stt10: string;
  type10: string;
  rentIncome: string | number;
  note10: string;

  // Lợi nhuận sau thuế
  stt11: string;
  type11: string;
  profitAfterTax: string | number;
  note11: string;

  // Tiền thuế  đất phải đóng
  stt12: string;
  type12: string;
  landTax: string | number;
  note12: string;
  [key: string]: string | number;

  // Số tháng thuê trong năm đầu
  stt13: string;
  type13: string;
  monthsInFirstYear: string | number;
  note13: string;
}

export const mockData1: TableRentalType = {
  stt1: "1.1",
  type1: "Diện tích khuôn viên",
  areaWidth: "",
  note1: "",

  stt2: "1.2",
  type2: "Tỷ lệ cho thuê (%)",
  rentRatio: "",
  note2: "",

  stt3: "1.3",
  type3: "Diện tích đất cho thuê",
  areaRent: "",
  note3: "",

  stt4: "1.4",
  type4: "Tốc độ tăng giá theo thị trường",
  growthSpeed: "",
  note4: "",

  stt5: "1.5",
  type5: "Tỷ suất chiết khấu",
  discountRate: "",
  note5: "",

  stt6: "1.6",
  type6: "Số năm khai thác còn lại",
  remainYears: "",
  note6: "",

  stt7: "1.7",
  type7: "Giả định tốc độ tăng giá của giá Nhà nước",
  assumeGrowthSpeed: "",
  note7: "",

  stt8: "1.8",
  type8: "Đơn giá cho thuê theo thị trường",
  unitPriceMarket: "",
  note8: "",

  stt9: "1.9",
  type9: "Đơn giá cho thuê theo Nhà nước",
  unitPriceState: "",
  note9: "",

  stt10: "2",
  type10: "Doanh thu cho thuê",
  rentIncome: "",
  note10: "",

  stt11: "3",
  type11: "Lợi nhuận sau thuế",
  profitAfterTax: "",
  note11: "",

  stt12: "4",
  type12: "Tiền thuế đất phải đóng",
  landTax: "",
  note12: "",

  stt13: "5",
  type13: "Số tháng thuê trong năm đầu",
  monthsInFirstYear: "",
  note13: "",
};

export type GrowthTableType = {};
export const growthTableColumns: ColumnsType<GrowthTableType> = [
  {
    key: 1,
    title: "Năm",
    dataIndex: "year",
    width: "5%",
    align: "center",
  },
  {
    key: 2,
    title: "Tốc độ tăng giá cho thuê theo TT",
    dataIndex: "speed",
    width: "18.75%",
    align: "right",
    render: (value: string | number) => `${Number(value) * 100}%`,
  },
  {
    key: 1,
    title: "Doanh thu cho thuê",
    dataIndex: "income",
    width: "18.75%",
    align: "right",
    render: (value: string | number) => {
      return numberUtils.formatNumber(Number(value));
    },
  },
  {
    key: 1,
    title: "Tốc độ tăng giá cho thuê theo NN",
    dataIndex: "speedState",
    width: "18.75%",
    align: "right",
    render: (value: string | number) => `${Number(value) * 100}%`,
  },
  {
    key: 1,
    title: "Tiền thuế phải đóng",
    dataIndex: "tax",
    width: "18.75%",
    align: "right",
    render: (value: string | number) => {
      return numberUtils.formatNumber(Number(value));
    },
  },
  {
    key: 1,
    title: "Dòng tiền CKDT",
    dataIndex: "cashFlow",
    width: "20%",
    align: "right",
    render: (value: string | number) => {
      return numberUtils.formatNumber(Number(value));
    },
  },
];
export const growthTableFooterColumns: ColumnsType<GrowthTableType> = [
  {
    key: 1,
    dataIndex: "label",
    align: "center",
    render: (value: string) => {
      return numberUtils.formatNumber(value);
    },
    width: "80%",
  },
  {
    key: 2,
    dataIndex: "value",
    align: "end",
    render: (value: string) => {
      return numberUtils.formatNumber(value);
    },
    width: "20%",
  },
];
