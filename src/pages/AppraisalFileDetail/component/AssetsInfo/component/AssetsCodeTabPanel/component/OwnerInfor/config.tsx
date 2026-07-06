import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import { OwnerInforAssetLandTableType } from "constant/types/appraisalFilesDetail";

const mockData: OwnerInforAssetLandTableType[] = [
  {
    key: 0,
    indentification: "",
    ownerName: "",
    yearOfBirth: 0,
  },
];

const columns: ColumnsEdit = [
  {
    key: 1,
    dataIndex: "ownerName",
    title: "Tên chủ sở hữu",
    width: "35%",
    editable: true,
    placeholder: 'HT nhập và cho sửa'
  },
  {
    key: 2,
    dataIndex: "indentification",
    title: "Mã số thuế/Số ĐKKD/ Số CMND",
    width: "30%",
    editable: true,
    placeholder: 'HT nhập và cho sửa'
  },
  {
    key: 3,
    dataIndex: "yearOfBirth",
    title: "Năm sinh",
    width: "30%",
    editable: true,
    placeholder: 'HT nhập và cho sửa'
  },
  {
    key: 'action',
    dataIndex: '',
    align: 'center',
    width: '5%'
  }
];

export { columns, mockData };
