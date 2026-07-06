import { Row, Button, Form, message, Space, Card } from "antd";
import TitleCustom from "components/TitleCustom";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import React, { useEffect, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import {
  FAST_EXPERTISE_VEHICLE,
  FAST_EXPERTISE_VEHICLE_CREATE,
  FAST_EXPERTISE_VEHICLE_DETAIL,
  FAST_EXPERTISE_VEHICLE_EDIT,
} from "routes/route.constant";
import ExpertiseInfo from "./components/ExpertiseInfo";
import VehicleInfo from "./components/VehicleInfo";
import { useNavigate, useParams } from "react-router-dom";
import { fastExpertiseApi } from "apis/fastExpertise";
import { useAppSelector } from "configs/hooks";
import {
  setAddressText,
  setAssetInfo,
  setDetailDoc,
  setListTSSS,
  setType,
  setValueExpertise,
} from "../Store/fastExpertise";
import { removeObjUndefined } from "utils/common";
const VehicleCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const location = window.location.href;
  const addressText = useAppSelector(
    (state) => state.fastExpertiseSlice.addressText
  );
  const type = useAppSelector((state) => state.fastExpertiseSlice.type);

  useLayoutEffect(() => {
    if (location.includes("create")) {
      dispatch(setType("create"));
    } else if (location.includes("edit")) {
      dispatch(setType("edit"));
    } else if (location.includes("view")) {
      dispatch(setType("view"));
    }
  }, [location]);
  useEffect(() => {
    dispatch(setAddressText(null));
    dispatch(setDetailDoc(null));
    dispatch(setAssetInfo(null));
    dispatch(setListTSSS([]));
    dispatch(setValueExpertise(null));
  }, [type]);

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Xe",
        path: FAST_EXPERTISE_VEHICLE,
      },
      {
        label: `${type !== "view" ? "Tạo mới hồ sơ" : "Thông tin hồ sơ"}`,
        path: `${
          type === "create"
            ? FAST_EXPERTISE_VEHICLE_CREATE
            : FAST_EXPERTISE_VEHICLE_EDIT.replace(":id", id || "")
        }`,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [type]);
  useEffect(() => {
    if (id !== null && id !== undefined) {
      getDetailDoc(id);
    }
  }, [id]);
  const getDetailDoc = async (id: any) => {
    try {
      const res = await fastExpertiseApi.getDoc(id, 2);
      if (res?.data?.code !== 200) {
        throw { message: res?.data?.message };
      }
      const detailDoc = res?.data?.data;
      // dispatch(setDetailDoc(detailDoc));
      // form.setFieldsValue(detailDoc);
      dispatch(setAssetInfo(detailDoc));
      dispatch(setListTSSS(detailDoc?.valuations || []));
      dispatch(setValueExpertise(detailDoc?.estimatePrice));
    } catch (error: any) {
      message.error(error?.message ?? "Đã có lỗi xảy ra");
    }
  };
  const showHistoryExpertise = () => {
    navigate(FAST_EXPERTISE_VEHICLE_DETAIL);
  };

  useEffect(() => {
    if (addressText) {
    }
  }, [addressText]);
  const expertise = async () => {
    try {
      await form.validateFields();
    } catch (error) {
      return;
    }

    try {
      const values = {
        ...form.getFieldsValue(),
        assetType: 2,
        page: 1,
        limit: 3,
      };

      const removedEmptyKeyObject = removeObjUndefined(values);
      const res = await fastExpertiseApi.getListTSSS(removedEmptyKeyObject);
      if (
        res?.data?.code !== 200 &&
        res?.data?.message !== "Không tìm thấy dữ liệu"
      ) {
        throw { message: res?.data?.message };
      }
      if (res?.data?.data?.length === 0) {
        message.info("Không tìm thấy dữ liệu phù hợp");
      } else {
        message.success("Đã có kết quả định giá nhanh");
      }
      dispatch(setAssetInfo(values));
      dispatch(setListTSSS(res?.data?.data || []));
      dispatch(setValueExpertise(res?.data?.value));

      navigate(FAST_EXPERTISE_VEHICLE_DETAIL);
    } catch (error: any) {
      message.error(error?.message ?? "Đã có lỗi xảy ra");
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <Row justify={"space-between"} style={{ marginBottom: 2 }}>
          <TitleCustom title="Định giá nhanh xe" size="big"></TitleCustom>
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
          <Space direction="vertical" size={"small"}>
            <Card className="card-container">
              <TitleCustom
                title={"Thông tin thẩm định"}
                size={"middle"}
              ></TitleCustom>
              <ExpertiseInfo></ExpertiseInfo>
            </Card>
            <Card className="card-container">
              <TitleCustom
                title={"Đặc điểm thông số kỹ thuật"}
                size={"middle"}
              ></TitleCustom>
              <VehicleInfo form={form}></VehicleInfo>
            </Card>
          </Space>
        </Form>
      </div>
    </div>
  );
};
export default VehicleCreate;
