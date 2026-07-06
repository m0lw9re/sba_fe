import { message } from "antd";
import { RcFile } from "antd/es/upload";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
});
const blobToBase64 = async (url: string): Promise<string> => {
  const blob = await fetch(url).then(res => res.blob())
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  })
};
const dataURItoBlob = (dataURI: string) => {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};
const base64ToBlob = (base64: string) => {
  const parts = base64.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; i++) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
};
const checkFileSizeBeforeUpload = (file: RcFile, mb: number): boolean => {
  const size = file.size / 1024 / 1024
  const isLargeThan = size > mb
  if (isLargeThan) {
    const errorMessage = `Dung lượng file lớn hơn so với mức quy định, vui lòng chọn file nhỏ hơn ${mb}MB`

    message.error(errorMessage);
    throw new Error(errorMessage);
  }
  return true;
};

export { getBase64, blobToBase64, dataURItoBlob, base64ToBlob, checkFileSizeBeforeUpload };
