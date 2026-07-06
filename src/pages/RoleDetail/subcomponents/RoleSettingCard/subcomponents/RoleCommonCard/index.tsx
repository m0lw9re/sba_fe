import { Button, Card, Divider, Row, Typography, Col, Space } from 'antd'
import React from 'react'
import {
    DownOutlined,
} from '@ant-design/icons';
import './style.scss'
import { ReactComponent as ActiveCheckedRole } from 'assets/images/svg/ActiveCheckedRole.svg';
import { ReactComponent as InActiveCheckedRole } from 'assets/images/svg/InActiveCheckRole.svg';
import { PermissionGroup } from 'constants/types/permission.type';
import CardTitleCustomUpdate from 'components/CardTitleCustomUpdate';

type Props = {
    permissionGroup?: PermissionGroup;
}

const RoleCommonCard: React.FC<Props> = ({ permissionGroup }) => {
    return (
        <Card className="role-common-card">
            <Row justify={"space-between"}>
                <CardTitleCustomUpdate title={permissionGroup?.permissionGroupName || ""} />
                <Button icon={<DownOutlined />} size="small"/>
            </Row>
            <Divider />
            <Row gutter={[24, 4]}>
                {permissionGroup?.permissions?.map((item, index) => (
                    <Col span={12} key={index}>
                        <Space size="small" align="center" className="role-group-wrapper">
                            {item.status === 0 ? <InActiveCheckedRole /> : <ActiveCheckedRole />}
                            <Typography.Text className='role-description'>{item.description}</Typography.Text>
                        </Space>
                    </Col>
                ))}
            </Row>
        </Card>
    )
}

export default RoleCommonCard