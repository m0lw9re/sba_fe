import { DatePickerProps, Space } from "antd";
import DatePickerCustom from "components/DatePickerCustom";
import SelectCustom from "components/SelectCustom";
import { FC } from "react";
import dayjs from "dayjs";
import { FilterRoleType } from "constant/types";

type Props = {
    filter: FilterRoleType;
    onFilter: (filter: any) => void;
};

export const UserListFilter: FC<Props> = ({ filter, onFilter }) => {
    return (
        <Space>
            <DatePickerCustom
                placeholder="Từ ngày"
                format={"DD-MM-YYYY"}
                value={filter.start ? dayjs(filter.start) : null}
                onChange={(value: DatePickerProps["value"]) =>
                    onFilter({ start: dayjs(value).valueOf() })
                }
            />
            <DatePickerCustom
                placeholder="Đến hết ngày"
                format={"DD-MM-YYYY"}
                value={filter.end ? dayjs(filter.end) : null}
                onChange={(value: DatePickerProps["value"]) =>
                    onFilter({ end: dayjs(value).valueOf() })
                }
            />

            <SelectCustom
                value={filter.status || null}
                onChange={(value) => onFilter({ status: value })}
                options={[
                    { value: -1, label: "Tất cả trạng thái" },
                    { value: 1, label: "Đang hoạt động" },
                    { value: 0, label: "Dừng hoạt động" },
                ]}
                placeholder="Chọn trạng thái"
            />
        </Space>
    );
};
