import {Card} from "antd";
import ExpandSearch from "components/ExpandSearch";
import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import {fields as fieldsInit} from "./config";
import {useAppDispatch, useAppSelector} from "configs/hooks";
import {
  getListDistrictAPI,
  getListProvinceAPI,
  getListWardAPI,
} from "configs/commonSlice";
import {useCategoryPurpose} from "utils/request";

type Props = {
  setFilters: (filters: any) => void;
};
const Filter = forwardRef(({setFilters}: Props, ref) => {
  const dispatch = useAppDispatch();
  const listProvince = useAppSelector(state => state.commonSlice.listProvince);
  const listDistrict = useAppSelector(state => state.commonSlice.listDistrict);
  const listWard = useAppSelector(state => state.commonSlice.listWard);
  const expandRef = useRef<any>(null);
  const [fields, setFields] = useState<any>(fieldsInit);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {data, isLoading, error, mutate} = useCategoryPurpose(
    {page: 1, limit: 1000},
    {}
  );

  const onSearch = (values: any) => {
    setFilters({...values, page: 1});
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: (e: any) => {
      onKeyDown(e);
    },
  }));
  
  const onKeyDown = (e: any) => {
    if (e.key === "Enter") {
      onSearch(expandRef?.current.getFieldsValue());
    }
  };

  useEffect(() => {
    dispatch(getListProvinceAPI());
    handleOnClickItem();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    const options = data?.data?.content?.map((e: any) => ({
      value: e?.usingPurposeId,
      label: e?.usingPurposeName,
    }));

    fieldsInit[8].options = options;
    setFields([...fieldsInit]);
    // fields2?.find((e: any) => e.name == "usingPurposeId")?.options = options;
  }, [data]);

  useEffect(() => {
    try {
      if (!listProvince) return;
  
      fieldsInit[4].options = listProvince?.map(e => ({
        value: e?.code,
        label: e?.fullName,
      })) || [];
      setFields([...fieldsInit]);
    } catch (error) {}
  }, [listProvince]);

  useEffect(() => {
    fieldsInit[5].options = listDistrict?.map(e => ({
      value: e?.code,
      label: e?.fullName,
    })) || [];
    setFields([...fieldsInit]);
  }, [listDistrict]);

  useEffect(() => {
    fieldsInit[6].options = listWard?.map(e => ({
      value: e?.code,
      label: e?.fullName,
    })) || [];
    setFields([...fieldsInit]);
  }, [listWard]);

  const handleOnClickItem = () => {
    fields[4].onChange = () => {
      const province = expandRef?.current.getFieldValue("addressProvince");
      expandRef?.current.setFieldValue("addressDistrict", null);
      expandRef?.current.setFieldValue("addressWard", null);
      dispatch(getListDistrictAPI(province));
    };

    fields[5].onChange = () => {
      const district = expandRef?.current.getFieldValue("addressDistrict");
      expandRef?.current.setFieldValue("addressWard", null);
      dispatch(getListWardAPI(district));
    };
  };
  return (
    <div className="filter-fast-expertise">
      <Card className="card-container">
        <ExpandSearch
          fields={fields}
          onSearch={onSearch}
          ref={expandRef}
        ></ExpandSearch>
      </Card>
    </div>
  );
});
export default Filter;
