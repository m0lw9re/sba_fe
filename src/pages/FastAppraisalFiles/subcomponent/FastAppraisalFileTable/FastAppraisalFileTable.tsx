import { Card, Col, Row, Space } from "antd";
import { CommonGetAllParams } from "constants/types/common.type";
import { FilterFastAppraisalFileType } from "constants/types/fastExpertiseAsset";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { useFastAppraisalFiles } from "utils/request/useFastAppraisalFiles";
import FastAppraisalFileFilter from "../FastAppraisalFileFilter/FastAppraisalFileFilter";
import ButtonCustom from "components/ButtonCustom";
import Icons from "assets/icons";
import TableCustom from "components/TableCustom";
import { defaultColumns } from "./FastAppraisalFileTable.config";
import ListButtonAction from "components/ListButtonAction";
import ModalAsk from "pages/FastAppraisalFiles/subcomponent/Modal";
import ComponentsError from "pages/ComponentsError";

const FastAppraisalFileTable = () => {
  const navigate = useNavigate();

  const [modalAsk, setModalAsk] = useState<boolean>(false);

  const onShowModal = () => {
    setModalAsk(!modalAsk);
  };

  const [params, setParams] = useState<CommonGetAllParams>({
    limit: 10,
    page: 1,
  });

  const [filter, setFilter] = useState<FilterFastAppraisalFileType>({
    keyword: "",
  });

  const { data, isLoading, error } = useFastAppraisalFiles(params, filter);

  const columns = defaultColumns.map((item) => {
    if (item.key === 9) {
      return {
        ...item,
        render: (_: any, item: any) => (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ListButtonAction
              clickView={() => {}}
              clickDelete={() => {}}
              clickEdit={() => {
                navigate(`/fast-expertise/${item.assetId}`, {
                  state: {
                    listId: {
                      lv1Id: item.assetLevelOneId,
                      lv2Id: item.assetLevelTwoId,
                      lv3Id: item.assetLevelThreeId,
                    },
                  },
                });
              }}
              id="TĐN-9542"
            />
          </div>
        ),
      };
    } else return { ...item };
  });

  if (error) return <ComponentsError />;

  return (
    <Card className="fast-appraisal-card" style={{padding: "8px"}}>
      <Row justify={"space-between"}>
        <Col style={{marginBottom: "8px"}}>
          <FastAppraisalFileFilter
            filter={filter}
            onFilter={(filterData: any) =>
              setFilter({ ...filter, ...filterData })
            }
          />
        </Col>
        <Col>
          <Space>
            <ButtonCustom
              label="Tải xuống"
              icon={<Icons.download />}
              size="small"
              style={{ color: "#000" }}
            />
            <ButtonCustom
              label="Thêm mới"
              icon={<Icons.add />}
              bgColor="#0048D3"
              onClick={onShowModal}
              type="primary"
              size="small"
            />
          </Space>
        </Col>
      </Row>
      <TableCustom
        bordered={true}
        columns={columns}
        dataSource={data ? data.data : []}
        isLoading={!data && isLoading}
        limit={data?.limit}
        page={data?.page}
        total={data?.total}
        onLimitChange={(limit) => {
          setParams({ ...params, limit });
        }}
        onPageChange={(page) => {
          setParams({ ...params, page });
        }}
      />
      <ModalAsk modalAsk={modalAsk} showModal={onShowModal} />
    </Card>
  );
};

export default FastAppraisalFileTable;
