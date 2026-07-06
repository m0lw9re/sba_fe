import InputFields from "components/Dung/InputFields";
import React, { useEffect, useState } from "react";
import { fields as fieldsInit } from "./config";
import { useAppSelector } from "configs/hooks";
import { Row } from "antd";

const LandInfo = (props: any) => {
  const [data, setData] = useState<any[]>([{}]);
  const type = useAppSelector(state => state.fastExpertiseSlice.type);
  useEffect(() => {
    setData([{}]);
  }, [type === "create"]);
  const [fields, setFields] = useState<any>(fieldsInit);
  // const listGearBox = useAppSelector(
  //   (state) => state.fastExpertiseSlice.listGearBox
  // );
  // const listWheelFormula = useAppSelector(
  //   (state) => state.fastExpertiseSlice.listWheelFormula
  // );
  // const [fields, setFields] = useState<any>(fieldsInit);
  // useEffect(() => {
  //   dispatch(getListGearBoxAPI());
  //   dispatch(getListWheelFormulaAPI());
  // }, []);
  // useEffect(() => {
  //   const setOptions = () => {
  //     fieldsInit.find((e) => e.name === "gearBoxs").options = listGearBox?.map(
  //       (e) => ({
  //         value: e?.id,
  //         label: e?.gearBox,
  //       })
  //     );

  //     setFields([...fieldsInit]);
  //   };
  //   setOptions();
  // }, [listGearBox]);
  // useEffect(() => {
  //   const setOptions = () => {
  //     fieldsInit.find((e) => e.name === "wheelFormulas").options =
  //       listWheelFormula?.map((e) => ({
  //         value: e?.id,
  //         label: e?.wheelFormula,
  //       }));

  //     setFields([...listWheelFormula]);
  //   };
  //   setOptions();
  // }, [listWheelFormula]);
  return (
    <div>
      <Row gutter={[10, 4]}>
        <InputFields data={fields}></InputFields>
      </Row>
    </div>
  );
};
export default LandInfo;
