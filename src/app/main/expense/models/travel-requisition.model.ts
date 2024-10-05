export interface TravelRequisition {
  travelExpenseMasterId: number;
  requestName: string;
  addTravelDetailsRequisitions: TravelDetailsRequisition[];
}

export interface TravelDetailsRequisition {
  tripType: number;
  countryFromId: number;
  countryToId: number;
  cityFromId: number;
  cityToId: number;
  departureDate: Date;
  returnDate: Date;
  travelPreferenceTime: Date;
  travelClass: number;
  travelBy: number;
  pickUpRequired: boolean;
  currencyType: string;
  advanceCurrency: number;
  accomodationStartDate: Date | null;
  accomodationEndDate: Date | null;
  personalStartDate: Date | null;
  personalEndDate: Date | null;
  personalReason: string;
  files: File[];
}

export interface TravelRequisitionAttachment {
  travelExpenseAttachmentId: number;
  attachmentName: string;
  attachmentVirtualName: string;
  attachmentUrl: string;
  travelDetailsRequisitionId: number;
  files: File[];
}

export interface TravelRequisition {
  travelExpenseMasterId: number;
  requestName: string;
  addTravelDetailsRequisitions: TravelDetailsRequisition[];
}

export interface TravelDetailsRequisition {
  tripType: number;
  countryFromId: number;
  countryToId: number;
  cityFromId: number;
  cityToId: number;
  departureDate: Date;
  returnDate: Date;
  travelPreferenceTime: Date;
  travelClass: number;
  travelBy: number;
  pickUpRequired: boolean;
  currencyType: string;
  advanceCurrency: number;
  accomodationStartDate: Date | null;
  accomodationEndDate: Date | null;
  personalStartDate: Date | null;
  personalEndDate: Date | null;
  personalReason: string;
  files: File[];
}

export interface TravelRequisitionAttachment {
  travelExpenseAttachmentId: number;
  attachmentName: string;
  attachmentVirtualName: string;
  attachmentUrl: string;
  travelDetailsRequisitionId: number;
  files: File[];
}
