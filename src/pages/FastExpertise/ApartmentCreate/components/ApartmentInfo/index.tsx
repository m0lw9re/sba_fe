/* eslint-disable react-hooks/exhaustive-deps */
import InputFields from "components/Dung/InputFields";
import React, { useEffect, useState } from "react";
import {
  columns as columnsInit,
  fields1 as fieldsInit1,
  fields2 as fieldsInit2,
} from "./config";
import { Col, Row } from "antd";
import TableInputAddNew from "./TableInputAddNew/TableInputAdd";
// import {useCategoryPurpose} from "utils/request";
import { useAppDispatch, useAppSelector } from "configs/hooks";
import {
  getLisBlockApartmentAPI,
  getLisBuildingApartmentAPI,
  getLisProjectApartmentAPI,
  getListDistrictAPI,
  getListPositionAPI,
  getListProvinceAPI,
  getListWardAPI,
} from "configs/commonSlice";
import {
  setAddressText,
  setAssetInfo,
} from "pages/FastExpertise/Store/fastExpertise";

const ApartmentInfo = (props: any) => {
  const { form } = props;
  const dispatch = useAppDispatch();
  //const [dataTable, setDataTable] = useState<any[]>([{}]);
  const type = useAppSelector((state) => state.fastExpertiseSlice.type);
  const {
    listPosition,
    listProjectApartment,
    listBuildingApartment,
    listBlockApartment,
    listProvince,
    listDistrict,
    listWard,
  } = useAppSelector((state) => state.commonSlice);
  const assetInfo = useAppSelector(
    (state) => state.fastExpertiseSlice.assetInfo
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //const [columns, setColumns] = useState<any[]>(columnsInit);

  useEffect(() => {
    dispatch(getListPositionAPI());
    dispatch(getLisProjectApartmentAPI());
    dispatch(getListProvinceAPI());
    //setDataTable([{}]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeField_2 = async () => {
    dispatch(
      setAssetInfo({
        ...assetInfo,
        latitude: form.getFieldValue("latitude"),
        longitude: form.getFieldValue("longitude"),
      })
    );
  };

  useEffect(() => {
    if (form.getFieldValue("projectId")) {
      dispatch(getLisBuildingApartmentAPI(form.getFieldValue("projectId")));
    }
  }, [form.getFieldValue("projectId")]);

  useEffect(() => {
    if (form.getFieldValue("buildingId")) {
      dispatch(
        getLisBlockApartmentAPI(
          form.getFieldValue("projectId"),
          form.getFieldValue("buildingId")
        )
      );
    }
  }, [form.getFieldValue("buildingId")]);

  useEffect(() => {
    if (form.getFieldValue("addressProvince")) {
      dispatch(getListDistrictAPI(form.getFieldValue("addressProvince")));
    }
  }, [form.getFieldValue("addressProvince")]);

  useEffect(() => {
    if (form.getFieldValue("addressDistrict")) {
      dispatch(getListWardAPI(form.getFieldValue("addressDistrict")));
    }
  }, [form.getFieldValue("addressDistrict")]);

  const setAddressTextByCodes = async () => {
    try {
      const provinceCode = form.getFieldValue("addressProvince");
      const districtCode = form.getFieldValue("addressDistrict");
      const wardCode = form.getFieldValue("addressWard");
      const streetText = form.getFieldValue("addressStreet");
      const detailText = form.getFieldValue("addressDetail");

      const provinceText = listProvince?.find(
        (e: any) => e?.code === provinceCode
      )?.fullName;
      const districtText = listDistrict?.find(
        (e: any) => e?.code === districtCode
      )?.fullName;
      const wardText = listWard?.find(
        (e: any) => e?.code === wardCode
      )?.fullName;

      dispatch(
        setAddressText({
          provinceText: provinceText,
          districtText: districtText,
          wardText: wardText,
          streetText: streetText,
          detailText: detailText,
        })
      );
    } catch (error) {}
  };

  useEffect(() => {
    setAddressTextByCodes();
  }, [
    form.getFieldValue("addressProvince"),
    form.getFieldValue("addressDistrict"),
    form.getFieldValue("addressWard"),
    form.getFieldValue("addressStreet"),
    form.getFieldValue("addressDetail"),
  ]);

  const fields1 = fieldsInit1.map((item) => {
    const disable = type === "view" || false;
    return { ...item, disable };
  });

  const fields2 = fieldsInit2.map((item) => {
    const disable = type === "view" || false;
    if (item.name === "projectId") {
      return {
        ...item,
        options: listProjectApartment,
        onChange: (value: any) => {
          form.setFieldValue("buildingId", null);
          form.setFieldValue("blockId", null);
        },
        disable,
      };
    } else if (item.name === "buildingId") {
      return {
        ...item,
        options: listBuildingApartment,
        onChange: (value: any) => {
          form.setFieldValue("blockId", null);
        },
        disable,
      };
    } else if (item.name === "blockId") {
      return {
        ...item,
        options: listBlockApartment,
        disable,
      };
    } else if (item.name === "positionId") {
      return {
        ...item,
        options: listPosition.map((el) => ({
          value: el?.positionId,
          label: el?.positionName,
        })),
        disable,
      };
    } else if (item.name === "addressProvince") {
      return {
        ...item,
        options: listProvince.map((el) => ({
          value: el.code,
          label: el.fullName,
        })),
        onChange: (value: any) => {
          form.setFieldValue("addressDistrict", null);
          form.setFieldValue("addressWard", null);
        },
        disable,
      };
    } else if (item.name === "addressDistrict") {
      return {
        ...item,
        options: listDistrict.map((el) => ({
          value: el.code,
          label: el.fullName,
        })),
        onChange: (value: any) => {
          form.setFieldValue("addressWard", null);
        },
        disable,
      };
    } else if (item.name === "addressWard") {
      return {
        ...item,
        options: listWard.map((el) => ({
          value: el.code,
          label: el.fullName,
        })),
        disable,
      };
    } else if (item.name === "latitude") {
      return {
        ...item,
        onChange: onChangeField_2,
        disable,
      };
    } else if (item.name === "longitude") {
      return {
        ...item,
        onChange: onChangeField_2,
        disable,
      };
    }
    return { ...item, disable };
  });

  return (
    <div>
      <Row gutter={[10, 4]}>
        {/* <InputFields data={fields1}></InputFields> */}

        {/* <Col span={24} style={{ marginBottom: 8 }}>
          <TableInputAddNew
            setData={setDataTable}
            isCheckbox={undefined}
            isPagination={false}
            data={[...dataTable]}
            column={columns}
            name="addressTable"
            form={form}
            disabled={type === "view"}
          ></TableInputAddNew>
        </Col> */}

        {fields2 && <InputFields data={fields2}></InputFields>}
      </Row>
    </div>
  );
};
export default ApartmentInfo;
