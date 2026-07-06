import InputFields from "components/Dung/InputFields";
import { useEffect, useState } from "react";
import {
  columns as columnsInit,
  fields1 as fieldsInit1,
  fields2 as fieldsInit2,
} from "./config";
import { Col, Form, Row } from "antd";
import TableInputAddNew from "./TableInputAddNew/TableInputAdd";
import { useCategoryPurpose } from "utils/request";
import { useAppDispatch, useAppSelector } from "configs/hooks";
import {
  getListRoadInPriceAPI,
  setAssetInfo,
} from "pages/FastExpertise/Store/fastExpertise";
import {
  getListPositionAPI,
  getListRoadContiguousTypesAPI,
} from "configs/commonSlice";
import { toNumber } from "utils/format";
import { isNumber } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
// import { toNumber } from "utils/format";

const LandInfo = (props: any) => {
  const { form } = props;
  const dispatch = useAppDispatch();
  const [dataTable, setDataTable] = useState<any[]>([{}]);

  const type = useAppSelector((state) => state.fastExpertiseSlice.type);
  const { usingPurposeOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );
  const listRoadInPrice = useAppSelector(
    (state) => state.fastExpertiseSlice.listRoadInPrice
  );
  const listPosition = useAppSelector(
    (state) => state.commonSlice.listPosition
  );
  const listRoadContiguousTypes = useAppSelector(
    (state) => state.commonSlice.listRoadContiguousTypes
  );
  const assetInfo = useAppSelector(
    (state) => state.fastExpertiseSlice.assetInfo
  );
  const [fields1, setFields1] = useState<any>(fieldsInit1);
  const [fields2, setFields2] = useState<any[]>(fieldsInit2);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [columns, setColumns] = useState<any[]>(columnsInit);

  useEffect(() => {
    dispatch(getListPositionAPI());
    dispatch(getListRoadContiguousTypesAPI());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (type === "create") {
      form.setFieldValue("radius", 3);
    }
    if (type === "view") {
      setColumns((prev) =>
        prev.map((item) => {
          if (item.dataIndex === "action_locate") {
            return {
              ...item,
              disabled: true,
            };
          } else {
            return item;
          }
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const values = Form.useWatch([], form);
  // const validateFields = async () => {
  //   if (checkAllValidate()) {
  //     try {
  //       console.log("valid");

  //       const res = await form.validateFields();
  //       console.log(fields1);
  //       console.log(res);
  //     } catch (error) {}
  //   }
  // };

  useEffect(() => {
    const options = listPosition?.map((e) => ({
      value: e?.positionId,
      label: e?.positionName,
    }));
    fieldsInit2.find((e) => e?.name === "positionId").options = options;
    setFields2([...fieldsInit2]);
  }, [listPosition]);

  useEffect(() => {
    const options = listRoadContiguousTypes?.map((e) => ({
      value: e?.roadContiguousTypeId?.toString(),
      label: e?.roadContiguousTypeName,
    }));
    fieldsInit2.find((e) => e?.name === "roadContiguousTypeId").options =
      options;
    setFields2([...fieldsInit2]);
  }, [listRoadContiguousTypes]);

  useEffect(() => {
    if (assetInfo?.provinces?.code) {
      dispatch(getListRoadInPriceAPI(assetInfo?.provinces?.code));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetInfo]);

  useEffect(() => {
    fieldsInit2[5].options = usingPurposeOptions;
    setFields2([...fieldsInit2]);
    // fields2?.find((e: any) => e.name === "usingPurposeId")?.options = options;
  }, [usingPurposeOptions]);

  useEffect(() => {
    fieldsInit2[10].onClick = () => {
      dispatch(
        getListRoadInPriceAPI(
          form.getFieldValue(["addressTable", 0, "addressProvince"])
        )
      );
    };
    const setFieldAreaWidth = () => {
      const areaInplan = form.getFieldValue("areaInplan");
      const areaUnplan = form.getFieldValue("areaUnplan");
      if (!isNumber(areaInplan) || !isNumber(areaUnplan)) return;

      const areaWidth = toNumber(areaInplan) + toNumber(areaUnplan);
      form.setFieldValue("areaWidth", areaWidth);
    };
    fieldsInit2.find((e) => e.name === "areaInplan").onChange = (e: any) => {
      setFieldAreaWidth();
    };
    fieldsInit2.find((e) => e.name === "areaUnplan").onChange = (e: any) => {
      setFieldAreaWidth();
    };

    setFields2([...fieldsInit2]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fieldsInit2[10].options = listRoadInPrice?.map((e: any) => ({
      value: e?.roadInPriceRangeId?.toString(),
      label: `Đường ${e?.road} (từ ${e?.doanDuongTu} đến ${e?.doanDuongDen}), ${e?.districts}`,
    }));
    setFields2([...fieldsInit2]);
  }, [listRoadInPrice]);

  useEffect(() => {
    // enableRule_1();
    // enableRule_2();
    // enableRule_table();
    setDataTable([{}]);
  }, []);

  useEffect(() => {
    // if (type !== "create") {
    //   disableRule_1();
    //   disableRule_2();
    //   disableRule_table();
    // }
    fieldsInit1.forEach((field) => {
      field.disable = type === "view";
    });
    fieldsInit2.forEach((field) => {
      field.disable = type === "view";
    });
    setFields1([...fieldsInit1]);
    setFields2([...fieldsInit2]);
  }, [type]);

  // useEffect(() => {
  //   fieldsInit1[0].onChange = onChangeField_1;
  //   fieldsInit1[1].onChange = onChangeField_1;
  //   setFields1([...fieldsInit1]);
  // }, []);

  useEffect(() => {
    fieldsInit2[0].onChange = onChangeField_2;
    fieldsInit2[1].onChange = onChangeField_2;
    setFields2([...fieldsInit2]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const onChangeField_1 = async (e: any) => {
  //   if (
  //     form.getFieldValue("landPlotNumber") &&
  //     form.getFieldValue("mapSheetNumber")
  //   ) {
  //     disableRule_table();
  //     disableRule_2();
  //   } else if (!checkAllValidate()) {
  //     enableRule_1();
  //     enableRule_2();
  //     enableRule_table();
  //   }
  //   validateFields();
  // };
  // const checkAllValidate = () => {
  //   if (
  //     (form.getFieldValue("latitude") && form.getFieldValue("longitude")) ||
  //     (form.getFieldValue("landPlotNumber") &&
  //       form.getFieldValue("mapSheetNumber")) ||
  //     (form.getFieldValue(["addressTable", 0, "addressProvince"]) &&
  //       form.getFieldValue(["addressTable", 0, "addressDistrict"]) &&
  //       form.getFieldValue(["addressTable", 0, "addressWard"]))
  //   ) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };
  const onChangeField_2 = async () => {
    dispatch(
      setAssetInfo({
        ...assetInfo,
        latitude: form.getFieldValue("latitude"),
        longitude: form.getFieldValue("longitude"),
      })
    );
    // if (form.getFieldValue("latitude") && form.getFieldValue("longitude")) {
    //   disableRule_1();
    //   disableRule_table();
    // } else if (!checkAllValidate()) {
    //   enableRule_1();
    //   enableRule_2();
    //   enableRule_table();
    // }
    // validateFields();
  };
  // const enableRule_1 = () => {
  //   fieldsInit1[0].rules = [{required: true, message: "Chưa nhập số thửa"}];
  //   fieldsInit1[1].rules = [
  //     {required: true, message: "Chưa nhập số tờ bản đồ"},
  //   ];
  //   setFields1([...fieldsInit1]);
  // };
  // const disableRule_1 = () => {
  //   fieldsInit1[0].rules = [];
  //   fieldsInit1[1].rules = [];
  //   setFields1([...fieldsInit1]);
  // };
  // const enableRule_2 = () => {
  //   fieldsInit2[0].rules = [{required: true, message: "Chưa nhập Tọa độ (X)"}];
  //   fieldsInit2[1].rules = [{required: true, message: "Chưa nhập Tọa độ (Y)"}];
  //   setFields2([...fieldsInit2]);
  // };
  // const disableRule_2 = () => {
  //   fieldsInit2[0].rules = [];
  //   fieldsInit2[1].rules = [];
  //   setFields2([...fieldsInit2]);
  // };
  // const enableRule_table = () => {
  //   columnsInit[1].rules = [
  //     {required: true, message: "Chưa chọn Tỉnh/Thành phố"},
  //   ];
  //   columnsInit[2].rules = [
  //     {required: true, message: "Chưa chọn Quận/Huyện/TP/Thị xã"},
  //   ];
  //   columnsInit[3].rules = [
  //     {required: true, message: "Chưa chọn Xã/Phường/Thị trấn"},
  //   ];
  //   columnsInit[1].title = "Tỉnh/Thành phố (*)";
  //   columnsInit[2].title = "Quận/Huyện/TP/Thị xã (*)";
  //   columnsInit[3].title = "Xã/Phường/Thị trấn (*)";
  //   setColumns([...columnsInit]);
  // };
  // const disableRule_table = () => {
  //   columnsInit[1].rules = [];
  //   columnsInit[2].rules = [];
  //   columnsInit[3].rules = [];
  //   columnsInit[1].title = "Tỉnh/Thành phố";
  //   columnsInit[2].title = "Quận/Huyện/TP/Thị xã";
  //   columnsInit[3].title = "Xã/Phường/Thị trấn";
  //   setColumns([...columnsInit]);
  // };
  // const checkValidateTableOnChange = async () => {
  //   if (
  //     (form.getFieldValue(["addressTable", [0], "addressProvince"]) &&
  //       form.getFieldValue(["addressTable", [0], "addressDistrict"]) &&
  //       form.getFieldValue(["addressTable", [0], "addressWard"])) ||
  //     checkAllValidate()
  //   ) {
  //     disableRule_1();
  //     disableRule_2();
  //     disableRule_table();
  //   } else if (!checkAllValidate()) {
  //     enableRule_1();
  //     enableRule_2();
  //     enableRule_table();
  //   }
  //   validateFields();
  // };
  return (
    <div>
      <Row gutter={[10, 4]}>
        <InputFields data={fields1}></InputFields>

        <Col span={24} style={{ marginBottom: 8 }}>
          <TableInputAddNew
            setData={setDataTable}
            isCheckbox={undefined}
            isPagination={false}
            data={[...dataTable]}
            column={columns}
            name="addressTable"
            form={form}
            disabled={type === "view"}
            // checkValidateTableOnChange={checkValidateTableOnChange}
            values={values}
          ></TableInputAddNew>
        </Col>

        {fields2 && <InputFields data={fields2}></InputFields>}
      </Row>
    </div>
  );
};
export default LandInfo;
