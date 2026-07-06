import DatePickerCustom from "components/DatePickerCustom";
import React from "react";
import { ColumnsType } from "antd/es/table";
import { AppraisalFileSurveyScheduleCreateType } from "constant/types";
import { randomId } from "utils";
import { getUsername } from "utils/localStorage";
import dayjs from "dayjs";
import InputCustom from "components/InputCustom";
import { DynamicTable } from "components/DynamicTable";
import { Button, message } from "antd";
import { EditSVG } from "assets/images";

type Props = {
  surveySchedules: Array<AppraisalFileSurveyScheduleCreateType>;
  handleChangeFormData: (data: any) => void;
};

const TableSurvey: React.FC<Props> = ({
  surveySchedules,
  handleChangeFormData,
}) => {
  const handleAddRow = () => {
    const newItem: AppraisalFileSurveyScheduleCreateType = {
      key: randomId(),
      note: "",
      whoCreate: getUsername(),
      timeStart: null,
      timeEnd: null,
    };
    handleChangeFormData({ surveySchedules: [...surveySchedules, newItem] });
  };

  const disabledEndDate = (current: any, startDate: string) => {
    const startDateCompare = new Date(startDate);
    // Can not select days before today and today
    return current && current < startDateCompare;
  };

  const disabledStartDate = (current: any, endDate: string) => {
    const startDateCompare = new Date(endDate);
    // Can not select days before today and today
    return current && current > startDateCompare;
  };

  const handleRemoveRow = (record: any) => {
    const tmpArr = [...surveySchedules];
    const foundIndex = tmpArr.findIndex((el) => el.key === record.key);

    if (foundIndex === -1) return;

    tmpArr.splice(foundIndex, 1);
    handleChangeFormData({ surveySchedules: [...tmpArr] });
  };

  const handleChangeRow = (key: string, data: any) => {
    const tmpArr = [...surveySchedules];
    const foundIndex = tmpArr.findIndex((el) => el.key === key);
    if (foundIndex === -1) return;
    tmpArr[foundIndex] = { ...tmpArr[foundIndex], ...data };
    handleChangeFormData({ surveySchedules: [...tmpArr] });
  };

  const columns: ColumnsType<AppraisalFileSurveyScheduleCreateType> = [
    {
      key: 1,
      title: "Lần liên hệ",
      render: (_, record, index) => index + 1,
      align: "center",
      width: "10%",
    },
    {
      key: 2,
      title: "Bắt đầu khảo sát",
      dataIndex: "timeStart",
      render: (timeStart, record) => {
        return (
          <DatePickerCustom
            value={timeStart ? dayjs(timeStart) : null}
            showTime
            allowClear
            // onChange={(value: any) => {
            //   const startTime = value ? dayjs(value).toISOString() : null;
            //   // Kiểm tra ngày chọn có nhỏ hơn ngày kết thúc khảo sát không
            //   if (record?.timeEnd && startTime && startTime >= record.timeEnd) {
            //     message.error(
            //       "Thời gian bắt đầu khảo sát phải nhỏ hơn thời gian kết thúc khảo sát"
            //     );
            //   } else {
            //     // Nếu nhỏ hơn, cập nhật giá trị
            //     handleChangeRow(record.key || "", {
            //       timeStart: value ? dayjs(value).toISOString() : null,
            //     });
            //   }
            // }}
            disabledDate={(value: any) => {
              if (record?.timeEnd) {
                return disabledStartDate(value, record.timeEnd);
              }
            }}
            onChange={(value: any) =>
              handleChangeRow(record.key || "", {
                timeStart: value ? dayjs(value).toISOString() : null,
              })
            }
          />
        );
      },
    },
    {
      key: 3,
      title: "Kết thúc khảo sát",
      dataIndex: "timeEnd",
      render: (timeEnd, record) => (
        <DatePickerCustom
          value={timeEnd ? dayjs(timeEnd) : null}
          showTime
          disabledDate={(value: any) => {
            if (record?.timeStart) {
              return disabledEndDate(value, record.timeStart);
            }
          }}
          onChange={(value: any) =>
            handleChangeRow(record.key || "", {
              timeEnd: value ? dayjs(value).toISOString() : null,
            })
          }
        />
      ),
    },
    {
      key: 4,
      title: "TT người hướng dẫn",
      dataIndex: "surveyGuidePosition",
      render: (surveyGuidePosition, record) => (
        <InputCustom
          value={surveyGuidePosition}
          onChange={(e) =>
            handleChangeRow(record.key || "", {
              surveyGuidePosition: e.target.value,
            })
          }
        />
      ),
    },
    {
      key: 5,
      title: "Ghi chú",
      dataIndex: "note",
      render: (note, record) => (
        <InputCustom
          value={note}
          onChange={(e) =>
            handleChangeRow(record.key || "", { note: e.target.value })
          }
        />
      ),
    },
  ];
  return (
    <DynamicTable
      columns={columns}
      dataSource={surveySchedules}
      onAddRow={handleAddRow}
      onRemoveRow={(record) => handleRemoveRow(record)}
      otherButton={() => (
        <Button type="text" icon={<EditSVG />} onClick={() => {}} />
      )}
    />
  );
};

export default TableSurvey;
