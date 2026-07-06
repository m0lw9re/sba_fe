import { Row } from "antd";
import InputFields from "components/InputFields";
import { useEffect, useState } from "react";
import { fields } from "./config";
import { useAppSelector } from "configs/hooks";

const ConstructionInfo = (props: any) => {
  const [data, setData] = useState<any[]>([{}]);
  const type = useAppSelector((state) => state.fastExpertiseSlice.type);

  useEffect(() => {}, [data]);
  useEffect(() => {
    setData([{}]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type === "create"]);
  
  return (
    <div>
      <Row gutter={[16, 4]}>
        <InputFields data={fields}></InputFields>
      </Row>
    </div>
  );
};
export default ConstructionInfo;
