import React, { FC, useEffect, useState } from "react";
import { AppraisalFileSurveyScheduleType } from "constant/types";
import { DynamicTable } from "components/DynamicTable";
import { ColumnsType } from "antd/es/table";
import DatePickerCustom from "components/DatePickerCustom";
import InputCustom from "components/InputCustom";
import dayjs from "dayjs";
import { randomId } from "utils/string";
import { Button, Checkbox, Form, Input, Select, message } from "antd";
import { EditSVG } from "assets/images";
import { getUsername } from "utils/localStorage";

type Props = {
  surveySchedules: Array<AppraisalFileSurveyScheduleType>;
  handleChangeFormData: (data: any) => void;
  allowEdit?: boolean;
  errors: any;
  touched: any;
};

const TableSurvey: FC<Props> = ({
  surveySchedules,
  handleChangeFormData,
  allowEdit,
  errors,
  touched,
}) => {
  const [conditionObj, setConditionObj] = useState<{
    isAddedNewRecord: boolean;
    lastOldIndex: number;
  }>({
    isAddedNewRecord: false,
    lastOldIndex: -1,
  });
  const [_surveySchedules, setSurveySchedules] =
    useState<Array<AppraisalFileSurveyScheduleType>>(surveySchedules);

  useEffect(() => {
    if (surveySchedules) {
      let isCheckNew = false;
      for (let i = 0; i < surveySchedules.length; i++) {
        if (surveySchedules[i].isNew) {
          isCheckNew = true;
          break;
        }
      }
      setConditionObj((prev) => ({
        ...prev,
        isAddedNewRecord: isCheckNew,
        lastOldIndex: surveySchedules.filter((item) => !item.isNew).length - 1,
      }));
      setSurveySchedules([...surveySchedules]);
    }
  }, [JSON.stringify(surveySchedules)]);

  const handleAddRow = () => {
    const newItem: AppraisalFileSurveyScheduleType = {
      key: randomId(),
      surveyScheduleId: null,
      appraisalFilesId: "",
      surveyTime: null,
      note: "",
      whoCreate: getUsername(),
      timeStart: null,
      timeEnd: null,
      isMetCustomer: false,
      isNew: true,
    };
    handleChangeFormData({ surveySchedules: [..._surveySchedules, newItem] });
  };

  const handleRemoveRow = (record: any) => {
    if (!record.isNew) {
      message.error("Không được xoá bản ghi cũ");
      return;
    }
    const tmpArr = [..._surveySchedules];
    const foundIndex = tmpArr.findIndex((el) => el.key === record.key);

    if (foundIndex === -1) return;

    tmpArr.splice(foundIndex, 1);
    handleChangeFormData({ surveySchedules: [...tmpArr] });
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

  const handleChangeRow = (key: string, data: any) => {
    const tmpArr = [..._surveySchedules];
    const foundIndex = tmpArr.findIndex((el) => el.key === key);

    if (foundIndex === -1) return;

    // Validate if Start time is greater than End time
    if (
      data.timeStart &&
      data.timeEnd &&
      dayjs(data.timeStart).isAfter(dayjs(data.timeEnd))
    ) {
      // Show toast error message
      return;
    }

    tmpArr[foundIndex] = { ...tmpArr[foundIndex], ...data };
    handleChangeFormData({ surveySchedules: [...tmpArr] });
  };

  const columns: ColumnsType<AppraisalFileSurveyScheduleType> = [
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
      render: (timeStart, record, index) => {
        const _error = errors ? errors[index]?.timeStart : "";
        const _touched = touched ? touched[index]?.timeStart : "";
        return (
          <Form.Item
            validateStatus={_error && _touched ? "error" : ""}
            help={_touched && _error}
            style={{ margin: 0 }}
          >
            <DatePickerCustom
              value={timeStart ? dayjs(timeStart) : null}
              showTime
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
              disabled={!record?.isNew}
            />
          </Form.Item>
        );
      },
    },
    {
      key: 3,
      title: "Kết thúc khảo sát",
      dataIndex: "timeEnd",
      render: (timeEnd, record, index) => {
        const _error = errors ? errors[index]?.timeEnd : "";
        const _touched = touched ? touched[index]?.timeEnd : "";

        return (
          <Form.Item
            validateStatus={_error && _touched ? "error" : ""}
            help={_touched && _error}
            style={{ margin: 0 }}
          >
            <DatePickerCustom
              value={timeEnd ? dayjs(timeEnd) : null}
              showTime
              disabledDate={(value: any) => {
                if (record?.timeStart) {
                  const convertedTimeStart = dayjs(record.timeStart);
                  const convertedTimeEnd = dayjs(value)
                    .set("hour", convertedTimeStart.hour())
                    .set("minute", convertedTimeStart.minute())
                    .set("second", convertedTimeStart.second())
                    .set("millisecond", convertedTimeStart.millisecond());
                  return disabledEndDate(convertedTimeEnd, record.timeStart);
                }
              }}
              onChange={(value: any) =>
                handleChangeRow(record.key || "", {
                  timeEnd: value ? dayjs(value).toISOString() : null,
                })
              }
              disabled={!record?.isNew && index < conditionObj.lastOldIndex}
            />
          </Form.Item>
        );
      },
    },
    {
      key: 4,
      title: "TT người hướng dẫn",
      dataIndex: "surveyGuideType",
      render: (surveyGuideType, record, index) => {
        return (
          <Select
            size="small"
            style={{ width: "100%" }}
            placeholder="Chọn"
            value={surveyGuideType ?? undefined}
            options={[
              { value: 1, label: "CVKH" },
              { value: 2, label: "Đại diện Khách hàng" },
            ]}
            onChange={(value) => {
              handleChangeRow(record.key || "", {
                surveyGuideType: value,
              });
            }}
            disabled={!record?.isNew && index < conditionObj.lastOldIndex}
          />
        );
      },
    },
    {
      key: 5,
      title: "Ghi chú",
      dataIndex: "note",
      render: (note, record, index) => {
        console.log("Value khi đã update: ", "");
        return (
          <Input
            size="small"
            // value={note}
            defaultValue={note || ""}
            onChange={(e) => {
              console.log("value khi onChange: ", "");
              handleChangeRow(record.key || "", { note: e.target.value });
            }}
            disabled={!record?.isNew && index < conditionObj.lastOldIndex}
          />
        );
      },
    },
    {
      key: 5,
      title: "Khách hàng hẹn lại",
      dataIndex: "isMetCustomer",
      align: "center",
      width: "100px",
      render: (isMetCustomer, record, index) => (
        <Checkbox
          checked={isMetCustomer}
          onChange={(e) =>
            handleChangeRow(record.key || "", {
              isMetCustomer: e.target.checked,
            })
          }
          disabled={!record?.isNew && index < conditionObj.lastOldIndex}
        />
      ),
    },
  ];

  return (
    <DynamicTable
      columns={columns}
      dataSource={_surveySchedules}
      onAddRow={
        !allowEdit &&
        !conditionObj.isAddedNewRecord &&
        (_surveySchedules.length === 0 ||
          (conditionObj.lastOldIndex !== -1
            ? _surveySchedules[conditionObj.lastOldIndex].isMetCustomer
            : false))
          ? handleAddRow
          : undefined
      }
      onRemoveRow={!allowEdit ? (record) => handleRemoveRow(record) : undefined}
      // otherButton={() => (
      //   <Button type="text" icon={<EditSVG />} onClick={() => {}} />
      // )}
    />
  );
};

export default TableSurvey;
