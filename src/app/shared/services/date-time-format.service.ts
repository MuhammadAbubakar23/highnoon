import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateTimeFormatService {
  constructor() { }

  // transformDate1(dateString: string | null): string {
  //   if (!dateString) {
  //     return ''; // Or any default value to handle null case
  //   }

  //   const date = new Date(dateString);
  //   const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //   const day = date.getDate().toString().padStart(2, '0');
  //   const year = date.getFullYear();

  //   return `${month}/${day}/${year}`;
  // }

  // transformDateToStringFormat(dateString: string): string {
  //   if (dateString === null) {
  //     return null;
  //   }
  //   const months = [
  //     'Jan', 'Feb', 'March', 'April', 'May', 'June',
  //     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  //   ];

  //   if (!dateString) {
  //     return '';
  //   }

  //   const date = new Date(dateString);
  //   const monthIndex = date.getMonth();
  //   const year = date.getFullYear();
  //   const day = date.getDate();
  //   return `${months[monthIndex]} ${day}, ${year}`;
  // }

  // transformDateTimeToStringFormat(dateString: string): string {

  //   const dateTime = moment(dateString).format("MMM D, YYYY h:mm A");
  //   return dateTime
  //   // if (dateString === null) {
  //   //   return null;
  //   // }
  //   // const months = [
  //   //   'Jan', 'Feb', 'March', 'April', 'May', 'June',
  //   //   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  //   // ];

  //   // if (!dateString) {
  //   //   return '';
  //   // }

  //   // const date = new Date(dateString);
  //   // const monthIndex = date.getMonth();
  //   // const year = date.getFullYear();
  //   // const day = date.getDate();
  //   // let hour = date.getHours();
  //   // const minutes = date.getMinutes();
  //   // let period = 'AM';

  //   // // Convert to 12-hour format
  //   // if (hour >= 12) {
  //   //   period = 'PM';
  //   //   if (hour > 12) {
  //   //     hour -= 12;
  //   //   }
  //   }

  //   // Add leading zero if minutes is less than 10
  // //   const formattedMinutes = (minutes < 10) ? `0${minutes}` : `${minutes}`;

  // //   return `${months[monthIndex]} ${day}, ${year} ${hour}:${formattedMinutes} ${period}`;
  // // }


  // convertHoursMinutes(datetimeString: string): string {
  //   // return moment(datetimeString).format("h:mm A")
  //   if (datetimeString === null) {
  //     return null;
  //   }
  //   const date = new Date(datetimeString);
  //   const hours = date.getHours().toString().padStart(2, '0');
  //   const minutes = date.getMinutes().toString().padStart(2, '0');
  //   return `${hours}:${minutes}`;
  // }

  // timeToMilliseconds(timeString: string): number {
  //   if (timeString === null) {
  //     return null;
  //   }
  //   const [hours, minutes] = timeString.split(':');
  //   const hoursInMs = parseInt(hours) * 60 * 60 * 1000;
  //   const minutesInMs = parseInt(minutes) * 60 * 1000;
  //   return hoursInMs + minutesInMs;
  // }

  // subtractTime(startTime: string, endTime: string): number {
  //   const startMs = this.timeToMilliseconds(startTime);
  //   const endMs = this.timeToMilliseconds(endTime);

  //   return endMs - startMs;
  // }

  calculateHourDifference(startTime: string, endTime: string): any {
    const startTimeFormat = moment(startTime, 'h:mm A');
    const endTimeFormat = moment(endTime, 'h:mm A');
    const duration = moment.duration(endTimeFormat.diff(startTimeFormat));
    const hours = duration.hours();
    const minutes = duration.minutes();
    return {
      hours: hours,
      minutes: minutes,
    };
  }
  findTimeDifference(startTime: string, endTime: string): string {
    const startDate = new Date("1970-01-01T" + startTime);
    const endDate = new Date("1970-01-01T" + endTime);
  
    const differenceInMillis = endDate.getTime() - startDate.getTime();
  
    const hours = Math.floor(differenceInMillis / (1000 * 60 * 60));
    const minutes = Math.floor((differenceInMillis % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((differenceInMillis % (1000 * 60)) / 1000);
  
    const formattedDifference = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
  
    return formattedDifference;
  }
  
  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }


  convertToHours(timeString: string): string {
    if (timeString === null) {
      return null;
    }
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0], 10);
    return `${hours} Hours`;
  }

  // fromSecondsToHours(seconds) {
  //   if (seconds === null) {
  //     return null;
  //   }
  //   const hours = seconds / 3600; // Convert seconds to hours
  //   return hours.toFixed(1);
  // }
  secondsToHHMM(totalSeconds) {
    if (totalSeconds === null) {
        return null;
    }
    const duration = moment.duration(totalSeconds, 'seconds');
    const hours = duration.hours();
    const minutes = duration.minutes();
    const formattedHours = moment(hours, 'HH').format('HH');
    const formattedMinutes = moment(minutes, 'mm').format('mm');
    return `${formattedHours}:${formattedMinutes}`;
}


  // formatAMPM(commingDate: string | number) {
  //   if (commingDate === null) {
  //     return null;
  //   }
  //   let date = new Date(commingDate);
  //   let hours = date.getHours();
  //   let minutes = date.getMinutes();
  //   let ampm = hours >= 12 ? 'PM' : 'AM';
  //   hours = hours % 12;
  //   hours = hours === 0 ? 12 : hours;
  //   let strMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
  //   let strTime = hours + ':' + strMinutes + ' ' + ampm;
  //   return strTime;
  // }

  timePickerFormat(date: Date): string {
    if (date === null) {
      return null;
    }
    let time = new Date(date);
    return time.toTimeString().slice(0, 5);
  }

  convertDurationToYearsMonthsDays(durationString): any {
    {
      if (!durationString) {
          return null;
      }

      const duration = moment.duration(durationString);

      const years = Math.floor(duration.asYears());
      duration.subtract(moment.duration({ years }));

      const months = Math.floor(duration.asMonths());
      duration.subtract(moment.duration({ months }));

      const days = Math.floor(duration.asDays());

      return { years, months, days };
  }

  }

}
