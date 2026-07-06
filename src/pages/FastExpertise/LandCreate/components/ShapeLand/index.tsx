import {Col, Row} from "antd";
import {useEffect, useState} from "react";
import {columns} from "./config";
import TableInputAdd from "./TableInputAdd/TableInputAdd";
import {useAppSelector} from "configs/hooks";

const ShapeLand = (props: any) => {
  const {form} = props;
  const [data, setData] = useState<any[]>([{}]);
  const type = useAppSelector(state => state.fastExpertiseSlice.type);
  
  useEffect(() => {
    setData([{}]);
  }, [type === "create"]);
  useEffect(() => {
    if (form.getFieldValue('shapeLandLocation')) {
      setData(form.getFieldValue('shapeLandLocation') || []);
    }
  }, [form.getFieldValue('shapeLandLocation')?.length]);
  return (
    <div>
      <Row gutter={[16, 4]}>
        <Col span={24} style={{margin: '8px 0'}}>
          <TableInputAdd
            setData={setData}
            isCheckbox={undefined}
            isPagination={false}
            data={data}
            column={columns}
            name="shapeLandLocation"
            form={form}
            disabled={type === "view"}
            scroll={false}
          />
        </Col>
      </Row>
    </div>
  );
};
export default ShapeLand;
