import type { ColumnsType } from "antd/es/table";
import StatusAccount from "components/StatusAccount";
import { formatDate } from "utils/date";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "index",
    align: "center",
    render: (text, record, rowIndex) => rowIndex + 1,
  },
  {
    key: 2,
    title: "Tên người dùng",
    dataIndex: "staffName",
  },
  {
    key: 3,
    title: "Ngày sinh",
    dataIndex: "dateOfBirth",
    render: (dateOfBirth) => {
      if (dateOfBirth) {
        return <>{formatDate(dateOfBirth)}</>;
      }
    },
  },
  {
    key: 4,
    title: "Tên đăng nhập",
    dataIndex: "username",
  },
  {
    key: 5,
    title: "Nhóm quyền",
    dataIndex: "rolename",
    render: (rolename) => {
      if (rolename === "Administrator") return "Quản trị viên hệ thống";
      else if (rolename === "Director") return "Giám đốc chi nhánh";
      else if (rolename === "Appraiser Manager") return "Trưởng phòng TĐG";
      else if (rolename === "Appraiser Expert") return "Nhân viên thẩm định";
      else return "Trưởng phòng kinh doanh";
    },
  },
  {
    key: 6,
    title: "Trạng thái",
    dataIndex: "status",
    render: (status: number) => (
      status ? <>Đang hoạt động</> : <>Tạm dừng</>
    ),
  },
  {
    key: 7,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
  },
];
const datePickerMap = [
  {
    key: 1,
    placeholder: "Từ ngày",
  },
  {
    key: 2,
    placeholder: "Đến ngày",
  },
];

export { datePickerMap, defaultColumns };
