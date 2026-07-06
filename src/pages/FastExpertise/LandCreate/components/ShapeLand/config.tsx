import {TYPE_FIELD} from "constant/enums";
import {ColumnProps} from "constants/types/common.type";
const {INPUT_NUMBER} = TYPE_FIELD;

const columns: ColumnProps[] = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    show: true,
    align: "center",
    render: (value: any, record: any, index: any) => {
      return <>{index + 1}</>;
    },
    width: '5%',
  },
  {
    type: INPUT_NUMBER,
    dataIndex: "vnLat",
    key: "vnLat",
    title: "Tọa độ X",
    show: true,
    width: "45%",
  },
  {
    type: INPUT_NUMBER,
    dataIndex: "vnLng",
    key: "vnLng",
    title: "Tọa độ Y",
    show: true,
    width: "45%",
  },
  {
    dataIndex: "action",
    key: "action",
    show: true,
    align: "center",
    width: '5%',
  },
];

export {columns};
