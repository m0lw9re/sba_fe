import {Col, Row} from "antd";
import InputFields from "components/InputFields";
import React, {useEffect, useState} from "react";
import {columns, fields} from "./config";
import TableInputAdd from "./TableInputAdd/TableInputAdd";
import {useAppSelector} from "configs/hooks";

const ConstructionInfo = (props: any) => {
  const {form} = props;
  const [data, setData] = useState<any[]>([{}]);
  const type = useAppSelector(state => state.fastExpertiseSlice.type);
  useEffect(() => {
    setData([{}]);
  }, [type === "create"]);
  useEffect(() => {
    if (form.getFieldValue('constructions')) {
      setData(form.getFieldValue('constructions'));
    }
  }, [form.getFieldValue('constructions')?.length]);
  return (
    <div>
      <Row gutter={[16, 4]}>
        <InputFields data={fields}></InputFields>
        <Col span={24} style={{marginBottom: 8}}>
          <TableInputAdd
            setData={setData}
            isCheckbox={undefined}
            isPagination={false}
            data={data}
            column={columns}
            name="constructions"
            form={form}
            disabled={type === "view"}

            // scroll={{x: "100%", overflow: "auto"}}
          ></TableInputAdd>
        </Col>
      </Row>
    </div>
  );
};
export default ConstructionInfo;
