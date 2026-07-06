import InputFields from "components/Dung/InputFields";
import React, {useEffect, useState} from "react";
import {fields as fieldsInit} from "./config";
import {Row} from "antd";
import {useAppSelector} from "configs/hooks";
const ExpertiseInfo = () => {
  const type = useAppSelector(state => state.fastExpertiseSlice.type);
  const [fields, setFields] = useState<any>(fieldsInit);

  useEffect(() => {
    fieldsInit[0].disable = type === "view";
    fieldsInit[1].disable = type === "view";
    setFields([...fieldsInit]);
  }, [type]);
  
  return (
    <div>
      <Row gutter={[8, 8]}>
        <InputFields data={fields}></InputFields>
      </Row>
    </div>
  );
};
export default ExpertiseInfo;
