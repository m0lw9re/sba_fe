import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "constant/enums";
import { Link } from "react-router-dom";
import { APPRAISAL_FILE_DETAIL } from "routes/route.constant";
import { numberUtils } from "utils";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "key",
    width: '5%',
    align: 'center',
    render: (text, record, index) => index + 1,
  },
  {
    key: 2,
    title: "Thời gian",
    dataIndex: "date",
    render: (value) => dayjs(value).format(DATE_TIME_FORMAT.momentTime),
    align: 'center',
  },
  {
    key: 6,
    title: "Số tờ trình",
    dataIndex: "reportCode",
    align: 'center',
  },
  {
    key: 3,
    title: "Giá trị tài sản",
    dataIndex: "value",
    render: (value, record) => {
      if (!value) return '-'
      return <Link to={`${APPRAISAL_FILE_DETAIL.replace(
        ":id",
        record?.appraisalFileId
      )}?tab=4`}>{numberUtils.formatNumber(value)}</Link>
    },
    align: 'right',
  },
  {
    key: 5,
    title: "Người phê duyệt",
    dataIndex: "approvedBy",
    align: 'center',
  },
];

export { defaultColumns };
