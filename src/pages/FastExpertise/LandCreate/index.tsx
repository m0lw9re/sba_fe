import {Row, Button, Form, message, Space, Card, Typography} from "antd";
import TitleCustom from "components/TitleCustom";
import {setSelectedBeadCrumb} from "pages/App/store/appSlice";
import {useCallback, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {
  FAST_EXPERTISE_LAND_TOWNHOUSE,
  FAST_EXPERTISE_LAND_TOWNHOUSE_CREATE,
  FAST_EXPERTISE_LAND_TOWNHOUSE_DETAIL,
  FAST_EXPERTISE_LAND_TOWNHOUSE_EDIT,
} from "routes/route.constant";
import ExpertiseInfo from "./components/ExpertiseInfo";
import LandInfo from "./components/LandInfo";
import ConstructionInfo from "./components/ConstructionInfo";
import {useNavigate, useParams} from "react-router-dom";
import {fastExpertiseApi} from "apis/fastExpertise";
import {useAppSelector} from "configs/hooks";
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
import {ASSET_PRICES_SHARED_TYPE, axisShapeLandLocation} from "constant/common";
import dayjs from "dayjs";
import Location from "./components/Location";
import {convertDateToString} from "utils/date";
import {DATE_TIME_FORMAT} from "constant/enums";
import {toNumber, toRoundNumber} from "utils/format";
import Zoning from "./components/Zoning";
import TableCompare from "./components/TableCompare";
import {randomId} from "utils";
import Icons from "assets/icons";
import ShapeLand from "./components/ShapeLand";
import proj4 from "proj4";
import "./style.scss";
import ButtonCustom from "components/ButtonCustom";

export type PlaceType = {
  lat: number;
  lng: number;
};
const LandCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpenLandLocation, setIsOpenLandLocation] = useState<boolean>(true);
  const [positionShapeLand, setPositionShapeLand] = useState<any>();
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const {id} = useParams();
  const location = window.location.href;
  const addressText = useAppSelector(
    state => state.fastExpertiseSlice.addressText
  );
  const type = useAppSelector(state => state.fastExpertiseSlice.type);
  const assetInfo = useAppSelector(state => state.fastExpertiseSlice.assetInfo);
  // const detailDoc = useAppSelector(state => state.fastExpertiseSlice.detailDoc);

  useEffect(() => {
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
    dispatch(setAddressText(null));
    // dispatch(setDetailDoc(null));
    // dispatch(setAssetInfo(null));
    dispatch(setListTSSS([]));
    dispatch(setValueExpertise(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Nhà phố - Đất ở",
        path: FAST_EXPERTISE_LAND_TOWNHOUSE,
      },
      {
        label: `${type !== "view" ? "Tạo mới hồ sơ" : "Thông tin hồ sơ"}`,
        path: `${
          type === "create"
            ? FAST_EXPERTISE_LAND_TOWNHOUSE_CREATE
            : FAST_EXPERTISE_LAND_TOWNHOUSE_EDIT.replace(":id", id || "")
        }`,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (id !== null && id !== undefined) {
      getDetailDoc(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getDetailDoc = async (id: any) => {
    try {
      const res = await fastExpertiseApi.getDoc(
        id,
        ASSET_PRICES_SHARED_TYPE.PLAN_USING
      );
      if (res?.data?.code !== 200) {
        // eslint-disable-next-line no-throw-literal
        throw {message: res?.data?.message};
      }
      const assetInfo = res?.data?.data;
      console.log(assetInfo);
      // dispatch(setDetailDoc(assetInfo));
      // form.setFieldsValue(assetInfo);
      dispatch(setAssetInfo(assetInfo));
      dispatch(setListTSSS(assetInfo?.valuations || []));
      dispatch(setValueExpertise(assetInfo?.estimatePrice));
      // dispatch(setUnPlanValueExpertise(assetInfo?.))
    } catch (error: any) {
      message.error(error?.message ?? "Đã có lỗi xảy ra");
    }
  };

  const showHistoryExpertise = () => {
    navigate(FAST_EXPERTISE_LAND_TOWNHOUSE_DETAIL);
  };

  useEffect(() => {
    if (assetInfo?.assetId != null) {
      dispatch(
        setAddressText({
          detailText: assetInfo?.addressDetail,
          streetText: assetInfo?.addressStreet,
          wardText: assetInfo?.addressWard,
          districtText: assetInfo?.addressDistrict,
          provinceText: assetInfo?.addressProvince,
        })
      );
      form.setFieldValue(
        ["addressTable", 0, "addressProvince"],
        assetInfo?.provinces?.code
      );
      form.setFieldValue(
        ["addressTable", 0, "addressDistrict"],
        assetInfo?.districts?.code
      );
      form.setFieldValue(
        ["addressTable", 0, "addressWard"],
        assetInfo?.wards?.code
      );
      form.setFieldValue(
        ["addressTable", 0, "addressStreet"],
        assetInfo?.addressStreet
      );
      form.setFieldValue(
        ["addressTable", 0, "addressDetail"],
        assetInfo?.addressDetail
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetInfo]);

  useEffect(() => {
    if (assetInfo) {
      form.setFieldsValue(assetInfo);
      form.setFieldValue(
        "constructions",
        assetInfo?.constructions?.map((e: any) => {
          return {...e, key: randomId()};
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetInfo]);

  // const validateFields = async () => {
  //   const group1 =
  //     form.getFieldValue("landPlotNumber") &&
  //     form.getFieldValue("mapSheetNumber");
  //   const group2 =
  //     form.getFieldValue(["addressTable", 0, "addressProvince"]) &&
  //     form.getFieldValue(["addressTable", 0, "addressDistrict"]) &&
  //     form.getFieldValue(["addressTable", 0, "addressWard"]);
  //   const group3 =
  //     form.getFieldValue("latitude") && form.getFieldValue("longitude");
  //   if (group1 || group2 || group3) {
  //     return;
  //   } else {
  //     await form.validateFields();
  //   }
  // };

  const getValueOfConstuctor = (listConstructor: any[]) => {
    let tongGiaTri = 0;
    listConstructor?.forEach((e: any) => {
      tongGiaTri += toNumber(e?.value);
    });

    return toRoundNumber(tongGiaTri);
  };

  const getValueOfLand = (
    assetInfo: any,
    estimatePrice: any,
    unPlanPrice: any
  ) => {
    let value =
      toNumber(assetInfo?.areaUnplan) * toNumber(unPlanPrice) +
      toNumber(assetInfo?.areaInplan) * toNumber(estimatePrice);
    return toRoundNumber(value);
  };

  const expertise = async () => {
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
    if (
      form.getFieldValue("areaWidth") &&
      form.getFieldValue("areaUnplan") &&
      form.getFieldValue("areaInplan") &&
      form.getFieldValue("areaWidth") !==
        form.getFieldValue("areaInplan") + form.getFieldValue("areaUnplan")
    ) {
      // kiểm tra rule diện tích hợp lệ
      message.error("Diện tích KPHQH = Diện tích khuôn viên - Diện tích PHQH");
      return;
    }
    try {
      const values = {
        ...form.getFieldsValue(),
        assetType: ASSET_PRICES_SHARED_TYPE.PLAN_USING,
        addressProvince:
          form.getFieldValue("addressTable")?.[0]?.addressProvince,
        addressDistrict:
          form.getFieldValue("addressTable")?.[0]?.addressDistrict,
        addressWard: form.getFieldValue("addressTable")?.[0]?.addressWard,
        addressStreet: form.getFieldValue("addressTable")?.[0]?.addressStreet,
        addressDetail: form.getFieldValue("addressTable")?.[0]?.addressDetail,
        address: getCombineAddress(),
        page: 1,
        limit: 3,
        dateFrom: convertDateToString(dayjs(), DATE_TIME_FORMAT.revertDay),
        dateTo: convertDateToString(
          dayjs().add(6, "months"),
          DATE_TIME_FORMAT.revertDay
        ),
      };
      const params = objectWithoutProperties(values, [
        "constructions",
        "addressTable",
      ]);
      const removedEmptyKeyObject = removeObjUndefined(params);
      const res = await fastExpertiseApi.getListTSSS(removedEmptyKeyObject);
      if (
        res?.data?.code !== 200 &&
        res?.data?.message !== "Không tìm thấy dữ liệu"
      ) {
        // eslint-disable-next-line no-throw-literal
        throw {message: res?.data?.message};
      }
      if (res?.data?.data?.length === 0) {
        message.info("Không tìm thấy dữ liệu phù hợp");
      } else {
        message.success("Đã có kết quả định giá nhanh");
      }
      const totalValue: any =
        toNumber(getValueOfConstuctor(values?.constructions)) +
        toNumber(
          getValueOfLand(values, res?.data?.value, res?.data?.unPlanPrice)
        );
      const newAssetInfo = {
        ...values,
        estimatePrice: res?.data?.value,
        optimizePrice: res?.data?.value,
        unPlanPrice: res?.data?.unPlanPrice,
        valuations: res?.data?.data,
        totalValue: toRoundNumber(totalValue),
        constructionPrice: getValueOfConstuctor(values?.constructions),
        landPrice: getValueOfLand(
          values,
          res?.data?.value,
          res?.data?.unPlanPrice
        ),
        valuationIds: res?.data?.data?.map((e: any) => e?.assetId),
        optimizePrices: res?.data?.data?.map((e: any) => ({
          assetId: e?.assetId,
          optimizePrice: e?.optimizePrice,
        })),
        logs: res?.data?.logs,
      };
      dispatch(setAssetInfo(newAssetInfo));
      dispatch(setListTSSS(res?.data?.data || []));

      navigate(FAST_EXPERTISE_LAND_TOWNHOUSE_DETAIL);
    } catch (error: any) {
      message.error(error?.message ?? "Đã có lỗi xảy ra");
    }
  };

  const handleOpenLandLocation = useCallback(
    (value: boolean) => {
      setIsOpenLandLocation(value);
    },
    [setIsOpenLandLocation]
  );

  const showLandLocation = () => {
    if (isOpenLandLocation) {
      return (
        <Button
          type="text"
          size="small"
          onClick={() => handleOpenLandLocation(false)}
        >
          <Space>
            <Typography className="blue-text">Ẩn thông tin</Typography>
            <Typography className="blue-text">
              <Icons.up />
            </Typography>
          </Space>
        </Button>
      );
    }
    return (
      <Button
        type="text"
        size="small"
        onClick={() => handleOpenLandLocation(true)}
      >
        <Space>
          <Typography className="blue-text">Hiển thị thông tin</Typography>
          <Typography className="blue-text">
            <Icons.down />
          </Typography>
        </Space>
      </Button>
    );
  };

  const LocateShapeLand = () => {
    var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

    const province = values?.addressTable[0]?.addressProvince as string;
    var centralMeridian = parseFloat(axisShapeLandLocation[province]);
    var vn2000ProjString =
      "+proj=tmerc +lat_0=0 +lon_0=" +
      centralMeridian +
      " +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,-0.00928836,0.01975479,-0.00427372,0.252906278 +units=m +no_defs";
    var resultData = values["shapeLandLocation"]
      .map((coords: any) => {
        if (
          (coords["vnLat"] === null && coords["vnLng"] === null) ||
          (coords["vnLat"] === "" && coords["vnLng"] === "")
        ) {
          return null;
        }
        console.log(coords["vnLat"]?.toString());
        var x = Number(coords["vnLat"]?.toString()?.trim());
        var y = Number(coords["vnLng"]?.toString()?.trim());
        var convertedPoint = proj4(vn2000ProjString, wgs84, [y, x]);
        return {
          lat: convertedPoint[1],
          lng: convertedPoint[0],
        };
      })
      .filter((row: any) => row !== null);
    // 1189850.15, 589869.44    1199867.355 597783.047
    // 1189846.21, 589875.07    1199868.388 597784.761
    // 1189842.50, 589880.36    1199855.370 597792.220
    // 1189833.76, 589893.44    1199853.304 597788.793
    // 1189831.94, 589896.16    1199864.587 597782.329
    // 1189823.03, 589889.33    1199867.355 597783.047
    // 1189824.89, 589886.63
    // 1189841.19, 589862.87
    // 1189850.15, 589869.44
    setPositionShapeLand(resultData);
  };

  return (
    <div style={{width: "100%"}}>
      <div className="page-container">
        <Row justify={"space-between"} style={{marginBottom: 2}}>
          <TitleCustom
            title="Định giá nhanh nhà phố - đất ở"
            size="big"
          ></TitleCustom>
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
          <Space
            direction="vertical"
            size={"small"}
            className="land-create-form-space"
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
                title={"Đặc điểm thửa đất"}
                size={"middle"}
              ></TitleCustom>
              <LandInfo form={form}></LandInfo>
            </Card>
            <Card className="card-container">
              <TitleCustom
                title={"Công trình xây dựng"}
                size={"middle"}
              ></TitleCustom>
              <ConstructionInfo form={form}></ConstructionInfo>
            </Card>
            <Card className="card-container">
              <Row justify={"space-between"}>
                <TitleCustom
                  title={"Định vị mảnh đất (VN-2000)"}
                  size={"middle"}
                />
                <div
                  style={{
                    height: "22px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Space>
                    <ButtonCustom
                      label="Định vị"
                      type="primary"
                      bgColor="#2862AF"
                      onClick={() => LocateShapeLand()}
                      disabled={type === "view"}
                    />
                    {showLandLocation()}
                  </Space>
                </div>
              </Row>
              {isOpenLandLocation ? <ShapeLand form={form} /> : null}
            </Card>
            <Card className="card-container">
              <TitleCustom title={"Định vị"} size={"middle"}></TitleCustom>
              <Location
                form={form}
                values={values}
                positionShapeLand={positionShapeLand}
              ></Location>
            </Card>
            <Card className="card-container">
              <TitleCustom title={"Quy hoạch"} size={"middle"}></TitleCustom>
              <Zoning></Zoning>
            </Card>
            <Card className="card-container">
              <TitleCustom
                title={"Thông tin tài sản so sánh"}
                size={"middle"}
              ></TitleCustom>
              <TableCompare></TableCompare>
            </Card>
          </Space>
        </Form>
      </div>
    </div>
  );
};
export default LandCreate;
