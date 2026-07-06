import { Button, Row, Space, Typography } from "antd";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { APPROVE_PRICE_SHARED } from "routes/route.constant";
import "pages/PriceShared/ApprovePriceShared/style.scss";
import TableApprovalAsset from "pages/PriceShared/ApprovePriceShared/subcomponents/TableApprovalAsset";
import Commant from "components/Commant";

const ApprovePriceShared = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Phê duyệt tài sản so sánh",
        path: APPROVE_PRICE_SHARED,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [APPROVE_PRICE_SHARED]);
  return (
    <div style={{ width: "100%" }} className="approval-price-shared-container">
      <div className="page-container">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row justify={"space-between"}>
            <Typography className="title">Phê duyệt tài sản</Typography>
            <Space>
              <Button
                className="btn-bottom"
                style={{ backgroundColor: "#F25B60" }}
              >
                Từ chối
              </Button>
              <Button
                className="btn-bottom"
                style={{ backgroundColor: "#2862AF" }}
              >
                Phê duyệt
              </Button>
            </Space>
          </Row>
          <Space direction="vertical" size={"small"} style={{ width: "100%" }}>
            <TableApprovalAsset />
            <Commant value="" onChange={() => {}} />
          </Space>
        </Space>
      </div>
    </div>
  );
};

export default ApprovePriceShared;
