import React, { ButtonHTMLAttributes } from 'react'
import { Tag } from 'antd'
import "components/StatusAccount/style.scss"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    status: number;
    Active? : string;
    Ban? : string;
}

const StatusAccount: React.FC<Props> = ({
    status,
    Active = 'Hoạt động',
    Ban = 'Tạm dừng',
    ...rest
}) => {
    if (status === 1) {
        return <Tag color="success" className='account-status-tag success-tag' {...rest}>{Active}</Tag>;
    }
    else if (status === 0) {
        return <Tag color='error' className='account-status-tag error-tag' {...rest}>{Ban}</Tag>
    } else {
        return null
    }
}

export default StatusAccount