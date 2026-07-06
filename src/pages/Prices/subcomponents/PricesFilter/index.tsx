import { Col, Row, Space, message } from "antd";
import { addressApi } from "apis/adress";
import Icons from "assets/icons";
import InputCustom from "components/InputCustom";
import SelectCustom from "components/SelectCustom";
import { DistrictType, ProvinceType } from "constant/types";
import { useEffect, useState } from "react";

// type Props = {
//     filter: FilterAccountType;
//     onFilter: (filter: any) => void;
// };

const PricesFilter = () => {
    const [districts, setDistricts] = useState<DistrictType[]>([]);
    const [provinces, setProvinces] = useState<ProvinceType[]>([]);
    const getAllProvinces = async () => {
        try {
            const dataRes = await addressApi.getProvinces({ page: 1, limit: 100 });
            setProvinces(dataRes.data.data);
        } catch (error: any) {
            message.error("Lỗi khi lấy danh sách các tỉnh!");
        }
    };
    const loadDistricts = async (code: string) => {
        try {
            const dataRes = await addressApi.getDistricts({ code: code });
            setDistricts(dataRes.data);
        } catch (error: any) {
            message.error("Lỗi khi lấy danh sách các huyện!");
        }
    };
    const handleChangeProvince = (value: any) => {
        loadDistricts(value)
    };
    useEffect(() => {
        getAllProvinces();
    }, []);
    return (
        <Row gutter={[16, 16]} style={{ width: '100%', margin: 0 }} justify={"space-between"}>
            <Col span={12} style={{ padding: 0 }}>
                <InputCustom
                    value={""}
                    prefix={<Icons.search />}
                    placeholder="Tìm kiếm"
                />
            </Col>
            <Col span={12} style={{ textAlign: "end" }}>
                <Space>
                    <SelectCustom
                        style={{ width: "200px" }}
                        value={""}
                        onChange={handleChangeProvince}
                        placeholder="Chọn Tỉnh/Thành phố"
                        options={provinces.map((item) => {
                            return {
                                label: item.name,
                                value: item.code,
                              };
                        })}
                    />
                    <SelectCustom
                        style={{ width: "200px" }}
                        value={""}
                        onChange={() => {}}
                        placeholder="Chọn Quận/Huyện"
                        options={districts.map((item) => {
                            return {
                                label: item.name,
                                value: item.code,
                              };
                        })}
                    />
                </Space>
            </Col>
        </Row>
    );
};

export default PricesFilter;
