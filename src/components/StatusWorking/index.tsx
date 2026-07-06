import React, { ButtonHTMLAttributes } from 'react'
import { Tag } from 'antd'
import 'components/StatusWorking/style.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    status: number;
    doingText? : string;
    doneText? : string;
}

const StatusWorking: React.FC<Props> = ({
    status,
    doingText = 'Đang làm',
    doneText = 'Đã xong',
    ...rest
}) => {
    if (status === 1) {
        return <Tag color="success" className='status-tag success-tag' {...rest}>{doingText}</Tag>;
    }
    else if (status === 0) {
        return <Tag color='error' className='status-tag error-tag' {...rest}>{doneText}</Tag>
    } else {
        return null
    }
}

export default StatusWorking