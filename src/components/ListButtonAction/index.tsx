import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import Icon from "@ant-design/icons/lib/components/Icon";
import { Button, Space } from "antd";
import "components/ListButtonAction/style.scss";

interface ButtonProps {
  clickEdit: (id: string) => void;
  clickDelete: (id: string) => void;
  clickView: (id: string) => void;
  id: string;
}
const ListButtonAction = ({
  clickEdit,
  clickDelete,
  clickView,
  id,
}: ButtonProps) => {
  const handleClickEdit = (id: string) => {
    clickEdit(id);
  };
  const handleClickDelete = (id: string) => {
    clickDelete(id);
  };
  const handleClickView = (id: string) => {
    clickView(id);
  };
  return (
    <div className="list-btn-act">
      <Space size={"middle"}>
        <Button className="button-act" onClick={() => handleClickEdit(id)}>
          <Icon
            className="icons"
            style={{ fontSize: 18 }}
            component={EditOutlined as React.ForwardRefExoticComponent<any>}
          />
        </Button>
        <Button className="button-act" onClick={() => handleClickDelete(id)}>
          <Icon
            className="icons"
            style={{ fontSize: 18 }}
            component={DeleteOutlined as React.ForwardRefExoticComponent<any>}
          />
        </Button>
        <Button className="button-act" onClick={() => handleClickView(id)}>
          <Icon
            className="icons"
            style={{ fontSize: 18 }}
            component={EyeOutlined as React.ForwardRefExoticComponent<any>}
          />
        </Button>
      </Space>
    </div>
  );
};

export default ListButtonAction;
