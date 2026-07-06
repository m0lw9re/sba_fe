import { Form, Row, Space } from "antd";
import InputFields from "components/InputFields";
import TableInputAdd from "components/TableInputAddCustom/TableInputAddCustom";
import { OwnerInforAssetLandTableType } from "constant/types";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import React, { useState } from "react";
import {
  columns,
  mockData,
} from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/OwnerInfor/config";

const { INPUT, SELECT } = TYPE_FIELD;

const OwnerInfor = () => {
  const [dataSource, setDataSource] =
    useState<OwnerInforAssetLandTableType[]>(mockData);

  const [counts, setCounts] = useState<number>(mockData.length);

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  const labelCol = { xs: 10, md: 10, lg: 10, xl: 8 };
  const wrapperCol = { xs: 14, md: 14, lg: 14, xl: 16 };
  const inputs: InputFiledParams[] = [
    {
      key: 1,
      type: SELECT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      label: "Mối quan hệ giữa chủ TS-KH vay",
      require: true,
      placeholder: "Hệ thống nhập và cho sửa",
    },
    {
      key: 2,
      type: INPUT,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      css: css,
      label: "Chi tiết",
      placeholder: "Hệ thống nhập và cho sửa",
    },
  ];

  const addRow = () => {
    const item: OwnerInforAssetLandTableType = {
      key: counts,
      indentification: "",
      ownerName: "",
      yearOfBirth: 0,
    };
    setCounts(counts + 1);
    setDataSource([...dataSource, item]);
  };

  return (
    <Space size={"small"} style={{ width: "100%" }} direction="vertical">
      <Form labelWrap labelAlign="left" size="small">
        <Row gutter={[24, 8]}>
          <InputFields data={inputs} />
        </Row>
      </Form>
      <TableInputAdd
        data={dataSource}
        handleAdd={addRow}
        column={columns}
        setData={setDataSource}
        isCheckbox={false}
      />
    </Space>
  );
};

export default OwnerInfor;
