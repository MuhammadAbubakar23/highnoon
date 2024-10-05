export class Leave {
  leaveId: number = 0;
  userId: number = 0;
  year: string = '';
  leaveStartDate: string = "";
  leaveEndDate: string = "";
  leaveDate: string = '';
  leaveTypeId: number = null;
  leavetype: string = '';
  leaveDuration: number = 0;
  leaveStatusId: number = 1;
  leaveStatus: string = '';
  reason: string = '';
}

export enum Gender {
  M = 'Male',
  F = 'Female'
}
export enum Status {
  Pending = '1',
  Approved = '2',
  Rejected = '3',
  Canceled = '4',
  OnHold = '5'
}
