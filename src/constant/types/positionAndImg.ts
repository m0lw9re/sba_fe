export interface ImageInfoType {
  assetImageId: number;
  appraisalFileId: string;
  ecmId: string;
  filename: string;
  mediaType: string;
  description: string | number | null;
  whoUpload: string;
  dateUpload: string;
  type: number | null;
}

export type PlaceType = {
  lat: number;
  lng: number;
};