import { Space, UploadFile } from "antd"
import { RcFile } from "antd/es/upload";
import { useCallback, useEffect, useState } from "react"
import './style.scss'
import { ImageItemCustom } from "../../ImageItemCustom";
interface FormImageProps {
    file: UploadFile<any>
    onPreview: (data: UploadFile) => void
    onRemoved: (uid: string) => void
    setFile: React.Dispatch<React.SetStateAction<UploadFile[]>>;
}
const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
export const FormImage = ({ file, onPreview, onRemoved, setFile }: FormImageProps) => {
    const [src, setSrc] = useState<string>('');

    const handleGetLinkImg = useCallback(async (file: UploadFile) => {
        file.url = await getBase64(file.originFileObj as RcFile);
        setSrc(file.url)
    }, [file])

    const handlePreview = useCallback(() => {
        onPreview(file)
    }, [file])

    const handleRemoved = useCallback(() => {
        onRemoved(file.uid)
    }, [file])

    useEffect(() => {
        if (file?.url) {
            setSrc(file.url)
        } else {
            handleGetLinkImg(file)
        }
    }, [file])
    return (

        <Space size={'small'} direction="vertical" className="image-upload">
            <ImageItemCustom src={src} onPreview={handlePreview} onRemoved={handleRemoved} setList={setFile} />
        </Space>

    )
}