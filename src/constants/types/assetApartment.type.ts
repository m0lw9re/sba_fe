export interface AssetImageType {
    assetImageId: number,
    assetId: string,
    filepath: string,
    description: string,
    dateCreate: string
}

export interface AssetOwnerType {
    assetOwnerId: number,
    assetId: string,
    assetOwnerName: string,
    identification: string,
    yearOfBirth: number
}

export interface LegalInfoType {
    legalInformationId: number,
    legalInformationTypeId: number,
    assetId: string,
    assetLandInforId: number,
    legalInformationName: string,
    legalInformationNumber: string,
    issueUnit: string,
    issueDate: string,
    details: string,
    whoCreate: string,
    dateCreate: string,
    dateModify: string
}

export interface AssetDtoType {
    riskAssetId: number,
    riskContent: string,
    assetLevelTwoId: number,
    description: string,
    riskLevel: number
}

export interface DetailDtoType {
    riskDetailId: number,
    assetId: string,
    riskAssetId: number,
    riskAssetDto: AssetDtoType,
    riskTypeId: number,
    riskTypeName: string,
    description: string
}

export interface DataApartmentType {
    assetId: string,
    assetCode: string,
    appraisalPurposeId: number,
    landPlotNumber: string,
    mapSheetNumber: string,
    realAddressDetail: string,
    realAddressStreet: string,
    realAddressWard: string,
    realAddressDistrict: string,
    realAddressProvince: string,
    legalAddressDetail: string,
    legalAddressStreet: string,
    legalAddressWard: string,
    legalAddressDistrict: string,
    legalAddressProvince: string,
    positionDescribe: string,
    socialInfra: number,
    techInfra: number,
    mainRoad: string,
    contiguousRoad: string,
    distanceToMainRoad: number,
    contiguousRoadWidth: number,
    apartmentTypeId: number,
    landArea: number,
    floors: number,
    basements: number,
    yearsOfComplete: number,
    equipmentId: number,
    apartmentForm: string,
    ownerTypeId: number,
    legalApartmentNumber: number,
    legalFloorNo: number,
    legalFloorArea: number,
    legalStructure: string,
    legalFacades: number,
    legalMainBalconyDirectionId: number,
    realApartmentNumber: number,
    realFloorNo: number,
    realFloorArea: number,
    realStructure: string,
    realFacades: number,
    realMainBalconyDirectionId: number,
    furnitures: string,
    currentUseSituationId: number,
    realUsingPurposeTypeId: number,
    usingPurposeTypeId: number,
    usingOriginTypeId: number,
    usingPeriodId: number,
    businessAdvantage: number,
    liquidity: number,
    isDispute: number,
    disputeInformation: string,
    isPlanned: number,
    planningInformation: string,
    note: string,
    appraisalDate: string,
    expiredDate: string,
    positioningImage: string,
    unitPrice: number,
    totalPrice: number,
    whoCreate: string,
    dateCreate: string,
    isFinish: true,
    dateModify: string,
    assetImages: AssetImageType[],
    assetOwners: AssetOwnerType[],
    legalInformations: LegalInfoType[],
    riskDetailDtos: AssetDtoType[]
}