import React, { ButtonHTMLAttributes } from 'react'
import { Tag } from 'antd'
import 'components/StatusProfile/style.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    status: number;
    success? : string;
    pending? : string;
    reject? : string;
}

const StatusProfile: React.FC<Props> = ({
    status,
    success = 'Hoàn thành',
    pending = 'Đang chờ',
    reject = 'Từ chối',
    ...rest
}) => {
    if (status === 0) {
        return <Tag color="success" className='status-tag success-tag' {...rest}>{success}</Tag>;
    }
    else if (status === 1) {
        return <Tag color='error' className='status-tag warning-tag' {...rest}>{pending}</Tag>
    } 
    else if (status === 2) {
        return <Tag color='error' className='status-tag error-tag' {...rest}>{reject}</Tag>
    } 
    else {
        return null
    }
}

export default StatusProfile