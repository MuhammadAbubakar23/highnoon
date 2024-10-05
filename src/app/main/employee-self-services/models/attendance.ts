import { Time } from "@angular/common";
export  class Attendance{
    time?:Time
    location?:number
    notes?:string
    checkin?:Date;
    checkout?:Date;
    city?:string;
    reason?:string;
}
