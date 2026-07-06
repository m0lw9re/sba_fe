import React, { ButtonHTMLAttributes } from 'react'
import { Tag } from 'antd'
import 'components/StatusReport/style.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    status: number;
    success? : string;
    pending? : string;
    reject? : string;
}

const StatusReport: React.FC<Props> = ({
    status,
    success = 'Đã duyệt',
    pending = 'Chờ duyệt',
    reject = 'Từ chối',
    ...rest
}) => {
    if (status === 1) {
        return <Tag color="success" className='status-tag success-tag' {...rest}>Chờ duyệt</Tag>;
    }
    else if (status === 0) {
        return <Tag color='error' className='status-tag warning-tag' {...rest}>Bản thảo</Tag>
    } 
    else {
        return null
    }
}

export default StatusReport