import { DatePickerProps, Space } from "antd";
import DatePickerCustom from "components/DatePickerCustom";
import InputCustom from "components/InputCustom";
import SelectCustom from "components/SelectCustom";
import { FilterAccountType } from "constant/types";
import { FC } from "react";
import Icons from "assets/icons";
import dayjs from "dayjs";

type Props = {
  filter: FilterAccountType;
  onFilter: (filter: any) => void;
};

export const AccountFilter: FC<Props> = ({ filter, onFilter }) => {
  return (
    <Space style={{marginBottom: "10px"}}>
      <InputCustom
        value={filter.keyword || ""}
        onChange={(e) => {
          onFilter({ keyword: e.target.value });
        }}
        prefix={<Icons.search />}
        placeholder="Tìm kiếm"
      />
      {/* <DatePickerCustom
        placeholder="Từ ngày"
        format={"DD-MM-YYYY"}
        value={filter.start ? dayjs(filter.start) : null}
        onChange={(value: DatePickerProps["value"]) =>
          onFilter({ start: dayjs(value).valueOf() })
        }
        style={{ width: "196px" }}
      />
      <DatePickerCustom
        placeholder="Đến hết ngày"
        format={"DD-MM-YYYY"}
        value={filter.end ? dayjs(filter.end) : null}
        onChange={(value: DatePickerProps["value"]) =>
          onFilter({ end: dayjs(value).valueOf() })
        }
        style={{ width: "196px" }}
      />
      <SelectCustom
        style={{ width: "196px" }}
        value={filter.status || null}
        onChange={(value) => onFilter({ status: value })}
        options={[
          { value: -1, label: "Tất cả trạng thái" },
          { value: 1, label: "Đang hoạt động" },
          { value: 0, label: "Dừng hoạt động" },
        ]}
        placeholder="Chọn trạng thái"
      /> */}
    </Space>
  );
};
