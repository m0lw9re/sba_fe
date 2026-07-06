import React, { useState, useEffect } from "react";
import "./style.scss";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Calendar, Button, Alert, Badge } from "antd";
import type { BadgeProps, CalendarProps } from "antd";
import Icons from "assets/icons";
import {
  CategoryDayOffsNote,
  dayOffVacation as dayOffVacationType,
} from "constant/types";
import { dayOffVacation as dayOffVacationAPI } from "apis/dayOffVacation";
import EditDayOffModal from "./EditDayOffModal";
import locale from "antd/es/date-picker/locale/vi_VN";
import "dayjs/locale/vi";
import { useDayOffCalender } from "utils/request/useDayOffCalender";

const App: React.FC = () => {
  // Value
  const englishDays: string[] = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const vietnameseDays: string[] = [
    "Chủ Nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  const [groupedClassesAdded, setGroupedClassesAdded] = useState(false);
  const [showEditButton, setShowEditButton] = useState<Boolean>(false);
  const [dayOffVacation, setDayOffVacation] = useState<any>([]);

  // Modal
  const [
    isUpdateCategoriesBussinessFeeModalShow,
    SetIsUpdateCategoriesBussinessFeeModalShow,
  ] = useState(false);
  const [record, setRecord] = useState<any>();
  const [value, setValue] = useState(() => dayjs());
  const [selectedValue, setSelectedValue] = useState(() => dayjs());
  const [prevSelectedValue, setPrevSelectedValue] = useState(selectedValue);
  const [isFirstMount, setIsFirstMount] = useState(true);
  const [actionModal, setActionModal] = useState<"add" | "update" | null>(null);
  const [selectedDayData, setSelectedDayData] = useState<{
    id: number;
    day: string;
    type: string;
  }>({ id: 0, day: "", type: "" });

  const formattedDate = selectedValue?.format("DD/MM/YYYY");
  const parts = formattedDate?.split("/");
  const month = parts?.[1];
  const year = parts?.[2];
  const day = parts?.[0];
  const { data, isLoading, error, mutate } = useDayOffCalender({ year, month });

  const closeCategoriesBussinessFeeModal = () => {
    SetIsUpdateCategoriesBussinessFeeModalShow(false);
    setActionModal(null);
    mutate();
  };
  const openModal = (action: "add" | "update" | null) => {
    SetIsUpdateCategoriesBussinessFeeModalShow(true);
    setActionModal(action);
  };

  const typeMappings: { [key: string]: string } = {
    "Nghỉ buổi sáng": "morning_break",
    "Nghỉ buổi chiều": "afternoon_break",
    "Nghỉ cả ngày": "rest_all_day",
  };

  const onSelect = (newValue: dayjs.Dayjs) => {
    setSelectedValue(newValue);
    setValue(newValue);

    setSelectedDayData((prev) => ({
      ...prev,
      id: dayOffVacation?.body?.id,
      day: newValue.format("DD/MM/YYYY"),
      type: "",
    }));

    for (const date of specialDates) {
      if (newValue.isSame(date.date, "day")) {
        setSelectedDayData((prev) => ({
          ...prev,
          id: dayOffVacation?.body?.id,
          day: date.date,
          type: typeMappings[date.events[0].content],
        }));
        setShowEditButton(true);
        break;
      }
    }
  };

  const onPanelChange = (newValue: dayjs.Dayjs) => {
    setValue(newValue);
    setSelectedValue(newValue);
    setShowEditButton(false);
  };

  // Group năm với thêm ngày nghỉ
  useEffect(() => {
    if (!groupedClassesAdded) {
      // Thêm ngày nghỉ
      const btnAddNew: Element | null = document.querySelector(".add-new-cal");
      const calendarHeader: Element | null = document.querySelector(
        ".ant-picker-calendar-header"
      );
      if (btnAddNew && calendarHeader) {
        calendarHeader.appendChild(btnAddNew);
      }
      const groupDiv = document.createElement("div");
      groupDiv.classList.add("grouped-classes");
      // Lấy ra các class con cần nhóm
      const yearSelect = document.querySelector(
        ".ant-picker-calendar-year-select"
      );
      const monthSelect = document.querySelector(
        ".ant-picker-calendar-month-select"
      );
      const modeSwitch = document.querySelector(
        ".ant-picker-calendar-mode-switch"
      );
      // Kiểm tra xem các class con tồn tại trước khi thêm vào nhóm
      if (yearSelect) {
        groupDiv.appendChild(yearSelect);
      }
      if (monthSelect) {
        groupDiv.appendChild(monthSelect);
      }
      if (modeSwitch) {
        groupDiv.appendChild(modeSwitch);
      }
      if (calendarHeader) {
        calendarHeader.appendChild(groupDiv);
      }
      setGroupedClassesAdded(true);

      // Change language calender
      // const table: Element | null = document.querySelector(".ant-picker-content");

      // if (table !== null) {
      //   const tableHeaders = table.querySelectorAll("thead th");

      //   tableHeaders.forEach((header, index) => {
      //     const englishDay = header.textContent ?? "";

      //     const vietnameseDay = vietnameseDays[index];

      //     if (englishDays.includes(englishDay)) {
      //       header.textContent = vietnameseDay;
      //     }
      //   });
      // }
    }
  }, [groupedClassesAdded]);

  // Note calender
  const specialDates: any = [];
  if (dayOffVacation?.body) {
    for (let day = 1; day <= 31; day++) {
      const dayKey = `day${day}`;
      const dayValue = dayOffVacation.body[dayKey];

      if (dayValue !== null) {
        const date = `${dayOffVacation.body.year}-${String(
          dayOffVacation.body.month
        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const events = [];

        if (dayValue === "morning_break") {
          events.push({ type: "warning", content: "Nghỉ buổi sáng" });
        } else if (dayValue === "afternoon_break") {
          events.push({ type: "error", content: "Nghỉ buổi chiều" });
        } else if (dayValue === "rest_all_day") {
          events.push({ type: "success", content: "Nghỉ cả ngày" });
        }

        if (events.length > 0) {
          specialDates.push({ date, events });
        }
      }
    }
  }

  const getListData = (value: Dayjs) => {
    const formattedDate = value.format("YYYY-MM-DD");
    let listData: CategoryDayOffsNote[] = [];

    for (const specialDate of specialDates) {
      if (formattedDate === specialDate.date) {
        listData = specialDate.events;
        break;
      }
    }

    return listData;
  };

  const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
      return 1394;
    }
  };
  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    const hasSpecialEvent = specialDates.some((specialDate: any) =>
      value.isSame(dayjs(specialDate.date), "day")
    );

    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge
              status={item.type as BadgeProps["status"]}
              text={item.content}
            />
          </li>
        ))}
        {hasSpecialEvent && (
          <Button
            type="text"
            icon={
              <img
                src={require("assets/images/png/Vector.png")}
                alt="Edit Icon"
                style={{ width: "16px", height: "16px" }}
              />
            }
            className="btn-edit-vacation"
            onClick={() => {
              setRecord(null);
              openModal("update");
            }}
          ></Button>
        )}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  useEffect(() => {
    const getDayOffVacation = async (
      month: string,
      year: string
    ): Promise<dayOffVacationType> => {
      const response = await dayOffVacationAPI.getDayOffVacation({
        month,
        year,
      });
      return response.data as dayOffVacationType;
    };

    if (isFirstMount) {
      // Gọi getDayOffVacation khi component được mount lần đầu tiên
      getDayOffVacation(month, year).then((data) => {
        setDayOffVacation(data);
      });

      setIsFirstMount(false); // Đánh dấu rằng component đã được mount lần đầu
    } else {
      const prevFormattedDate = prevSelectedValue?.format("DD/MM/YYYY");
      const prevParts = prevFormattedDate?.split("/");
      const prevMonth = prevParts?.[1];
      const prevYear = prevParts?.[2];

      if ((month || year) && (month !== prevMonth || year !== prevYear)) {
        getDayOffVacation(month, year).then((data) => {
          setDayOffVacation(data);
        });
      }
    }

    setSelectedValue(selectedValue);
  }, [selectedValue]);


  useEffect(() => {
    if (data) {
      setDayOffVacation(data);
    }
  }, [data]);

  return (
    <div className="day-off-container">
      <EditDayOffModal
        isOpenModal={isUpdateCategoriesBussinessFeeModalShow}
        closeModal={closeCategoriesBussinessFeeModal}
        record={record}
        action={actionModal}
        mutate={mutate}
        selectedDayData={selectedDayData}
        selectedValue={selectedValue.add(0, "month")}
      />
      <Alert
        message={`Bạn đang chọn ngày: ${selectedValue?.format("DD/MM/YYYY")}`}
      />
      <Button
        icon={<Icons.add />}
        type="primary"
        size="middle"
        style={{ width: "150px", backgroundColor: "#2A81D0" }}
        className="add-new-cal"
        onClick={() => {
          setRecord(null);
          openModal("add");
        }}
      >
        Thêm ngày nghỉ
      </Button>
      <Calendar
        value={value}
        onSelect={onSelect}
        onPanelChange={onPanelChange}
        cellRender={cellRender}
        locale={locale}
      />
    </div>
  );
};

export default App;
