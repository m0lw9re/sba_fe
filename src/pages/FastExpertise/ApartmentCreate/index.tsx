import { Row, Button, Form, message, Space, Card } from "antd";
import TitleCustom from "components/TitleCustom";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  FAST_EXPERTISE_APARTMENT,
  FAST_EXPERTISE_APARTMENT_CREATE,
  FAST_EXPERTISE_APARTMENT_DETAIL,
  FAST_EXPERTISE_APARTMENT_EDIT,
} from "routes/route.constant";
import ExpertiseInfo from "./components/ExpertiseInfo";
import ApartmentInfo from "./components/ApartmentInfo";
import ConstructionInfo from "./components/ConstructionInfo";
import TableCompare from "./components/TableCompare";
import { useNavigate, useParams } from "react-router-dom";
import { fastExpertiseApi } from "apis/fastExpertise";
import { convertDateToString } from "utils/date";
import { useAppSelector } from "configs/hooks";
import {
  setAddressText,
  setAssetInfo,
  setListTSSS,
  setType,
  setValueExpertise,
} from "../Store/fastExpertise";
import {
  objectWithoutProperties,
  removeObjUndefined,
  combineAddress,
} from "utils/common";
import dayjs from "dayjs";
import Location from "./components/Location";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
import { DATE_TIME_FORMAT } from "constant/enums";

export type PlaceType = {
  lat: number;
  lng: number;
};
const ApartmentCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const { id } = useParams();
  const location = window.location.href;
  const addressText = useAppSelector(
    (state) => state.fastExpertiseSlice.addressText
  );
  const type = useAppSelector((state) => state.fastExpertiseSlice.type);
  const assetInfo = useAppSelector(
    (state) => state.fastExpertiseSlice.assetInfo
  );
  // const detailDoc = useAppSelector(state => state.fastExpertiseSlice.detailDoc);

  useEffect(() => {
    // set TYPE
    if (location.includes("create")) {
      dispatch(setType("create"));
    }
    if (location.includes("edit")) {
      dispatch(setType("edit"));
    }
    if (location.includes("view")) {
      dispatch(setType("view"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // set default data theo TYPE (edit, create, view)
    dispatch(setAddressText(null));
    dispatch(setListTSSS([]));
    dispatch(setValueExpertise(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    // breadCrumb
    let breadCrumb = [
      {
        label: "Chung cư",
        path: FAST_EXPERTISE_APARTMENT,
      },
      {
        label: `${type !== "view" ? "Tạo mới hồ sơ" : "Thông tin hồ sơ"}`,
        path: `${
          type === "create"
            ? FAST_EXPERTISE_APARTMENT_CREATE
            : FAST_EXPERTISE_APARTMENT_EDIT.replace(":id", id || "")
        }`,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    // call api khi edit
    if (id !== null && id !== undefined) {
      getDetailDoc(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getDetailDoc = async (id: any) => {
    // lấy chi tiết thông tin tài sản theo ID
    try {
      const res = await fastExpertiseApi.getDoc(
        id,
        ASSET_PRICES_SHARED_TYPE.APARTMENT
      );
      if (res?.data?.code !== 200) {
        // eslint-disable-next-line no-throw-literal
        throw { message: res?.data?.message };
      }
      const assetInfo = res?.data?.data;
      dispatch(setAssetInfo(assetInfo));
      dispatch(setListTSSS(assetInfo?.valuations || []));
      dispatch(setValueExpertise(assetInfo?.estimatePrice));
    } catch (error: any) {
      message.error(error?.message ?? "Đã có lỗi xảy ra");
    }
  };

  const showHistoryExpertise = () => {
    navigate(FAST_EXPERTISE_APARTMENT_DETAIL);
  };

  // useEffect(() => {
  //   // xử lý khi có dữ liệu TÀI SẢN thay đổi
  //   if (assetInfo?.assetId != null) {
  //     form.setFieldsValue(assetInfo);
  //     dispatch(
  //       setAddressText({
  //         detailText: assetInfo?.addressDetail,
  //         streetText: assetInfo?.addressStreet,
  //         wardText: assetInfo?.addressWard,
  //         districtText: assetInfo?.addressDistrict,
  //         provinceText: assetInfo?.addressProvince,
  //       })
  //     );
  //     // form.setFieldValue(
  //     //   ["addressTable", 0, "addressProvince"],
  //     //   assetInfo?.provinceId
  //     // );
  //     // form.setFieldValue(
  //     //   ["addressTable", 0, "addressDistrict"],
  //     //   assetInfo?.districtId
  //     // );
  //     // form.setFieldValue(["addressTable", 0, "addressWard"], assetInfo?.wardId);
  //     // form.setFieldValue(
  //     //   ["addressTable", 0, "addressStreet"],
  //     //   assetInfo?.addressStreet
  //     // );
  //     // form.setFieldValue(
  //     //   ["addressTable", 0, "addressDetail"],
  //     //   assetInfo?.addressDetail
  //     // );
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [assetInfo]);

  useEffect(() => {
    if (assetInfo) {
      form.setFieldsValue(assetInfo);
      form.setFieldValue(
        "utilities",
        assetInfo?.utilities?.toString()?.split(",")
      );
      dispatch(
        setAddressText({
          detailText: assetInfo?.addressDetail,
          streetText: assetInfo?.addressStreet,
          wardText: assetInfo?.addressWard,
          districtText: assetInfo?.addressDistrict,
          provinceText: assetInfo?.addressProvince,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetInfo]);

  const expertise = async () => {
    // Hàm ĐỊNH GIÁ
    try {
      await form.validateFields();
    } catch (error) {
      return;
    }
    const getCombineAddress = () => {
      const address = combineAddress(
        addressText?.detailText,
        addressText?.streetText,
        addressText?.wardText,
        addressText?.districtText,
        addressText?.provinceText
      );
      return address;
    };
    try {
      const values = {
        ...form.getFieldsValue(),
        assetType: ASSET_PRICES_SHARED_TYPE.APARTMENT,
        // addressProvince:
        //   form.getFieldValue("addressTable")?.[0]?.addressProvince,
        // addressDistrict:
        //   form.getFieldValue("addressTable")?.[0]?.addressDistrict,
        // addressWard: form.getFieldValue("addressTable")?.[0]?.addressWard,
        // addressStreet: form.getFieldValue("addressTable")?.[0]?.addressStreet,
        // addressDetail: form.getFieldValue("addressTable")?.[0]?.addressDetail,
        page: 1,
        limit: 3,
        address: getCombineAddress(),
        dateFrom: convertDateToString(dayjs(), DATE_TIME_FORMAT.revertDay),
        dateTo: convertDateToString(
          dayjs().add(3, "months"),
          DATE_TIME_FORMAT.revertDay
        ),
      };
      const params = objectWithoutProperties(values, ["addressTable"]);
      const removedEmptyKeyObject = removeObjUndefined(params);
      const res = await fastExpertiseApi.getListTSSS({
        ...removedEmptyKeyObject,
        utilities: form.getFieldValue("utilities")?.sort().join(","),
      });
      if (
        res?.data?.code !== 200 &&
        res?.data?.message !== "Không tìm thấy dữ liệu"
      ) {
        // eslint-disable-next-line no-throw-literal
        throw { message: res?.data?.message };
      }
      if (res?.data?.data?.length === 0) {
        message.info("Không tìm thấy dữ liệu phù hợp");
      } else {
        message.success("Đã có kết quả định giá nhanh");
      }
      const newAssetInfo = {
        ...values,
        estimatePrice: res?.data?.value,
        optimizePrice: res?.data?.value,
        valuations: res?.data?.data,
        valuationIds: res?.data?.data?.map((e: any) => e?.assetId),
        logs: res?.data?.logs,
      };
      dispatch(setAssetInfo(newAssetInfo));
      dispatch(setListTSSS(res?.data?.data || []));

      navigate(FAST_EXPERTISE_APARTMENT_DETAIL);
    } catch (error: any) {
      message.error(error?.message ?? "Đã có lỗi xảy ra");
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <Row justify={"space-between"} style={{ marginBottom: 10 }}>
          <TitleCustom title="Định giá nhanh chung cư" size="big"></TitleCustom>
          <Space>
            {type === "view" && (
              <Button className="btn-primary" onClick={showHistoryExpertise}>
                Lịch sử định giá
              </Button>
            )}
            {(type === "create" || type === "edit") && (
              <Button
                className="btn-primary"
                onClick={() => {
                  expertise();
                }}
              >
                Định giá
              </Button>
            )}
          </Space>
        </Row>
        <Form requiredMark={false} labelAlign="left" form={form} size="small">
          <div
            style={{
              flexDirection: "column",
              display: "flex",
              boxSizing: "border-box",
              gap: "8px",
            }}
          >
            <Card className="card-container">
              <TitleCustom
                title={"Thông tin thẩm định"}
                size={"middle"}
              ></TitleCustom>
              <ExpertiseInfo></ExpertiseInfo>
            </Card>
            <Card className="card-container">
              <TitleCustom
                title={"Đặc điểm chung cư"}
                size={"middle"}
              ></TitleCustom>
              <ApartmentInfo form={form}></ApartmentInfo>
            </Card>
            <Card className="card-container">
              <TitleCustom title={"Tiện ích"} size={"middle"}></TitleCustom>
              <ConstructionInfo form={form}></ConstructionInfo>
            </Card>
            <Card className="card-container">
              <TitleCustom title={"Định vị"} size={"middle"}></TitleCustom>
              <Location form={form} values={values}></Location>
            </Card>
            <Card className="card-container">
              <TitleCustom
                title={"Thông tin tài sản so sánh"}
                size={"middle"}
              ></TitleCustom>
              <TableCompare></TableCompare>
            </Card>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default ApartmentCreate;
