// status 0 -> gọi all tạo mới
// status 3 -> gọi all tạo đợt 2
export const feeNotificationStatus = [
  { value: "0", label: "Chưa tạo nội dung báo phí" },
  { value: "1", label: "Đã tạo phí thẩm định đợt 1" },
  { value: "2", label: "Đã tạo phí thẩm định đợt 2" },
  { value: "3", label: "Đã đồng ý báo phí đợt 1" },
  { value: "4", label: "Đã từ chối báo phí đợt 1" },
  { value: "5", label: "Đã đồng ý báo phí đợt 2" },
  { value: "6", label: "Đã từ chối báo phí đợt 2" },
  { value: "7", label: "Đã báo phí đợt 1" },
  { value: "8", label: "Đã báo phí đợt 2" },
  // { value: "7", label: "Từ chối công tác phí" },
  // { value: "8", label: "Báo lại công tác phí" },
  // { value: "9", label: "Đồng ý phí báo lại công tác phí" },
  // { value: "10", label: "Báo lại phí đợt 2" },
  // { value: "11", label: "Đồng ý phí báo lại đợt 2" },
];

export const debtStatusOptions = [
  { value: "0", label: "Chưa tạo nội dung báo phí" },
  { value: "1", label: "Đã tạo phí thẩm định đợt 1" },
  { value: "2", label: "Đã tạo phí thẩm định đợt 2" },
  { value: "3", label: "Đã đồng ý báo phí đợt 1" },
  { value: "4", label: "Đã từ chối báo phí đợt 1" },
  { value: "5", label: "Đã đồng ý báo phí đợt 2" },
  { value: "6", label: "Đã từ chối báo phí đợt 2" },
  { value: "7", label: "Đã báo phí đợt 1" },
  { value: "8", label: "Đã báo phí đợt 2" },
  // { value: "7", label: "Từ chối công tác phí" },
  // { value: "8", label: "Báo lại công tác phí" },
  // { value: "9", label: "Đồng ý phí báo lại công tác phí" },
  // { value: "10", label: "Báo lại phí đợt 2" },
  // { value: "11", label: "Đồng ý phí báo lại đợt 2" },
];

export const priceOptions = [
  {
    value: "0",
    label: "0 - 2.000.000",
  },
  {
    value: "1",
    label: "2.000.000 - 5.000.000",
  },
  {
    value: "2",
    label: "5.000.000 - 10.000.000",
  },
  {
    value: "3",
    label: "10.000.000 - 50.000.000",
  },
  {
    value: "4",
    label: "50.000.000 - 100.000.000",
  },
  {
    value: "5",
    label: "100.000.000 - 500.000.000",
  },
  {
    value: "6",
    label: "500.000.000 - 1.000.000.000",
  },
  {
    value: "7",
    label: "1.000.000.000 - 2.000.000.000",
  },
  {
    value: "8",
    label: "2.000.000.000 - 5.000.000.000",
  },
  {
    value: "9",
    label: "Lớn hơn 5.000.000.000",
  },
];

export const debtOptions = [
  {
    value: "0",
    label: "0 - 2.000.000",
  },
  {
    value: "1",
    label: "2.000.000 - 5.000.000",
  },
  {
    value: "2",
    label: "5.000.000 - 10.000.000",
  },
  {
    value: "3",
    label: "10.000.000 - 50.000.000",
  },
  {
    value: "4",
    label: "50.000.000 - 100.000.000",
  },
  {
    value: "5",
    label: "100.000.000 - 500.000.000",
  },
  {
    value: "6",
    label: "500.000.000 - 1.000.000.000",
  },
  {
    value: "7",
    label: "1.000.000.000 - 2.000.000.000",
  },
  {
    value: "8",
    label: "2.000.000.000 - 5.000.000.000",
  },
  {
    value: "9",
    label: "Lớn hơn 5.000.000.000",
  },
];

export const feeNatures = [
  { label: "Hồ sơ dự án", value: "1" },
  { label: "Hồ sơ dự toán", value: "2" },
  { label: "Hồ sơ còn lại", value: "3" },
];
