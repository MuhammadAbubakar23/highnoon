export class User {
  userId: number;
  personalNumber: string;
  residenceNumber: string;
  cnicExpiry: string;
  maritalStatusId: string;
  address: NewAddress;
}

export class NewAddress {
  id: number;
  currentAddress: string;
  city: string;
  state: string;
}

export class Address {
  id: number = 0;
  curentAddress: string = '';
  addressType: string = '';
  cityId: number = 0;
}
export class BankDetails {
  id: number = 0;
  banklName: string = '';
  branchName: string = '';
  accountNumber: string = '';
  ibanNumber: string = '';

}
export class Employee {
  id?: number = 0;
  employeeId:number=0;
  title?: string = '';
  firstName?: string = '';
  userName?: string = '';
  password?: string = '';
  lastName?: string = '';
  email?: string = '';
  phone?: string = '';
  gender?: string = null;
  martialStatus?: string = null;
  birthDate?: string = null;
  cnic?: string = '';
  cnicExpiry?: string = null;
  joinigDate?: string = null;
  hiringDate?: string = null;
  alternateEmail?: string = '';
  picture?: string = '';
  employeeTypeId?: number = null;
  designationId?: number = null;
  teamId?: number = null;
  jobTitleId?: number = null;
  managerId?: number = null;
  address?: Address;
  bankDetails?: BankDetails
}
export enum MaritalStatus {
  S = 'Single',
  E = 'Engaged',
  M = 'Married'
}
export enum Genders{
  M= 'Male',
  F= 'Female'
}
