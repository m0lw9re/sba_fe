import React, { ButtonHTMLAttributes } from 'react'
import { Tag } from 'antd'
import 'components/StatusAsset/style.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    status: number;
    NormalText? : string;
    NotNormalText? : string;
}

const StatusAsset: React.FC<Props> = ({
    status,
    NormalText = 'Hoàn thành',
    NotNormalText = 'Thế chấp',
    ...rest
}) => {
    if (status === 1) {
        return <Tag color="success" className='status-tag success-tag' {...rest}>{NormalText}</Tag>;
    }
    else if (status === 0) {
        return <Tag color='error' className='status-tag error-tag' {...rest}>{NotNormalText}</Tag>
    } else {
        return null
    }
}

export default StatusAsset