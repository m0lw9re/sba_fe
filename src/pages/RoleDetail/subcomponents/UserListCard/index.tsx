import { Card, Button, Row, Divider } from "antd";
import { DownOutlined } from "@ant-design/icons";
import UserListTable from "./subcomponents/UserListTable";
import "./style.scss";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";

const UserListCard = () => {
  return (
    <Card
      className="UserListCard-wrapper"
      style={{ padding: "8px" }}
      size="small"
    >
      <Row justify={"space-between"}>
        <CardTitleCustomUpdate title="Phân quyền" />
        <Button icon={<DownOutlined />} size="small" />
      </Row>
      <Divider />
      <UserListTable />
    </Card>
  );
};

export default UserListCard;
