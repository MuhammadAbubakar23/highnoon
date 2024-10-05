interface ScheduleDay {
  dayName: string;
  shiftStart: string;
  shiftEnd: string;
  breakStart: string;
  breakEnd: string;
  overTimeStart: string;
  overTimeEnd: string;
}

interface ScheduleForm {
  userId: number;
  scheduleId: number;
  dateStart: string;
  dateEnd: string;
  date: string;
  shiftStart: string;
  shiftEnd: string;
  breakStart: string;
  breakEnd: string;
  overTimeStart: string;
  overTimeEnd: string;
  scheduleDays: ScheduleDay[];
}
