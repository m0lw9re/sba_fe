import { ColumnsType } from "antd/es/table";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    width: "5%",
    title: "STT",
    dataIndex: "index",
    align: "center",
  },
  {
    key: 2,
    dataIndex: "staffNumber",
    title: "Mã nhân viên",
    align: "left",
    width: "10%",
  },
  {
    key: 3,
    dataIndex: "username",
    title: "Tài khoản",
    align: "left",
    width: "20%",
  },
  {
    key: 4,
    dataIndex: "staffName",
    title: "Họ và tên",
    align: "left",
  },
  {
    key: 5,
    dataIndex: "phone",
    title: "Điện thoại",
    align: "left",
  },
  // {
  //   key: 5,
  //   dataIndex: "avatar",
  //   title: "Ảnh đại diện",
  //   align: "left",
  // },
  {
    key: 6,
    dataIndex: "companyBranchName",
    title: "Đơn vị",
    align: "left",
  },
  {
    key: 7,
    dataIndex: "positionName",
    title: "Vị trí",
    align: "left",
  },
  {
    key: 8,
    dataIndex: "status",
    title: "Hoạt động",
    align: "left",
    render: (status) => {
      if (status) {
        return <div style={{color: "green"}}>Đang hoạt động</div>;
      } else return <div style={{color: "red"}}>Không hoạt động</div>;
    },
  },
  {
    key: "actions",
    dataIndex: "",
    title: "Hành động",
    align: "center",
    fixed: "right",
  },
];

export { defaultColumns };
