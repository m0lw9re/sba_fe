import type { ColumnsType } from "antd/es/table";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "stt",
    align: "center",

    render: (text, record, rowIndex) => rowIndex + 1,
  },
  {
    key: 2,
    title: "Số Tờ tờ trình",
    dataIndex: "soToToTrinh",
  },
  {
    key: 3,
    title: "Mã hồ sơ",
    dataIndex: "maHoSo",
  },
  {
    key: 4,
    title: "Tên KH",
    dataIndex: "tenKH",
  },
  {
    key: 5,
    title: "MST",
    dataIndex: "mst",
  },
  {
    key: 6,
    title: "Tính chất, loại phí",
    dataIndex: "tinhChatLoaiPhi",
  },
  {
    key: 7,
    title: "Ngày TB",
    dataIndex: "ngayTB",
  },
  {
    key: 8,
    title: "Đơn vị thẩm định",
    dataIndex: "donViThamDinh",
  },
  {
    key: 9,
    title: "Đơn vị yêu cầu định giá",
    dataIndex: "donViYeuCauDinhGia",
  },
  {
    key: 10,
    title: "Tiền mặt",
    dataIndex: "tienMat",
  },
  {
    key: 11,
    title: "Chuyển khoản",
    dataIndex: "chuyenKhoan",
  },
  {
    key: 12,
    title: "Tổng tiền",
    dataIndex: "tongTien",
  },
  {
    key: 13,
    title: "Trạng thái",
    dataIndex: "trangThai",
  },
  {
    key: 14,
    title: "Hành động",
    dataIndex: "hanhDong",
    align: "center",
    width: "120px",
    fixed: "right",
  },
];

export { defaultColumns };
