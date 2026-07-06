import { Col, Space } from "antd";
import InputCustom from "components/InputCustom";
import { FilterFastAppraisalFileType } from "constants/types/fastExpertiseAsset";
import React from "react";
import Icons from "assets/icons";
import DatePickerCustom from "components/DatePickerCustom";
import { DATE_TIME_FORMAT } from "constants/enums";

type Props = {
  filter: FilterFastAppraisalFileType;
  onFilter: (filter: any) => void;
};

const { day } = DATE_TIME_FORMAT;

const FastAppraisalFileFilter: React.FC<Props> = ({ filter, onFilter }) => {
  return (
    <Col style={{ padding: 0 }}>
      <Space>
        <InputCustom
          value={filter.keyword || ""}
          onChange={(e) => {
            onFilter({ keyword: e.target.value });
          }}
          prefix={<Icons.search />}
          placeholder="Tìm kiếm"
        />
        <DatePickerCustom
          placeholder="Từ ngày"
          format={day}
          onChange={() => {}}
          style={{ width: "196px" }}
        />
        <DatePickerCustom
          placeholder="Đến ngày"
          format={day}
          onChange={() => {}}
          style={{ width: "196px" }}
        />
      </Space>
    </Col>
  );
};

export default FastAppraisalFileFilter;
