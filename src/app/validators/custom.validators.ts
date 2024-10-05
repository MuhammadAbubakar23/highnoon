import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
export class CustomValidators {
  static MatchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
        ? { mismatch: true }
        : null;
    };
  }
  //00:00
  static dateValidator(checkIn: string, checkOut: string): ValidatorFn {

    return (group: FormGroup): ValidationErrors | null => {
      const checkInTime = new Date(group.get(checkIn)?.value).getTime();
      const checkOutTime = new Date(group.get(checkOut)?.value).getTime();
      const checkInDate = new Date(group.get(checkIn)?.value).getDate();
      const checkOutDate = new Date(group.get(checkOut)?.value).getDate();


      if (checkInTime >= checkOutTime) {
        return { invalidDate: true, message: 'Check-out time must be greater than check-in time.' };
      }
      if (checkInDate !== checkOutDate) {
        return { invalidDuration: true, message: 'The duration should be less than 24 hours.' };
      }
      return null;
    };
  }

  static dateValidatorforAttendance(checkIn: string, checkOut: string): ValidatorFn {

    return (group: FormGroup): ValidationErrors | null => {
      const errors: ValidationErrors = {};
      const checkInTime = group.get(checkIn)?.value;
      const checkOutTime = group.get(checkOut)?.value;

      const breakInTime = group.get('breakInTime')?.value;
      const breakOutTime = group.get('breakOutTime')?.value;

      if (checkInTime >= checkOutTime) {
        errors['invalidDate'] = { message: 'Check-out time must be greater than check-in time.' };
      }

      if (breakInTime >= breakOutTime) {
        errors['invalidDatee'] = { message: 'Break-out time must be greater than break-in time.' };
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  static dateValidatorForLeave(startDate: string, endDate: string): ValidatorFn {
    
    return (group: FormGroup): ValidationErrors | null => {
      const start = group.get(startDate)?.value;
      const end = group.get(endDate)?.value;

      if (start && end && start >= end) {
        return { invalidDate: true, message: 'End Date must be greater than Start Date.' };
      }

      return null;
    };
  }

  static overtimeValidator(shiftCheckout: string): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {

      const start = group.get('otCheckIn')?.value;

      const end = shiftCheckout;

      if (start < end) {
        return { invalidDate: true, message: 'Overtime Check In Time must be greater than Shift Checkout Time.' };
      }

      return null;
    };
  }

  static overtimeValidator2(_returnDate: string, _departureDate: string): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {

      const returnDate = _returnDate;
      const departureDate = _departureDate;

      if (departureDate > returnDate) {
        return null;
      }

      return {
        invalidDuration2: true,
        message: 'Departure date of the Trip should be greater than return date of first'
      };
    };
  }
  static benefitDateValidator(requiredFrom: string, requiredTo: string): ValidatorFn {

    return (group: FormGroup): ValidationErrors | null => {
      const errors: ValidationErrors = {};
      const requiredFromDate = new Date(group.get(requiredFrom)?.value);
      const requiredToDate = new Date(group.get(requiredTo)?.value);
      const accomodationStartDate = new Date(group.get('accomodationStartDate')?.value);
      const accomodationEndDate = new Date(group.get('accomodationEndDate')?.value);
      const personalStartDate = new Date(group.get('personalStartDate')?.value);
      const personalEndDate = new Date(group.get('personalEndDate')?.value);

      if (requiredFromDate > requiredToDate) {
        errors['invalidDuration'] = { message: 'RequiredFrom Date should be less than or equal to RequiredTo Date' };
      }
      if (accomodationStartDate > accomodationEndDate) {
        errors['invalidDuration3'] = { message: 'accomodationStartDate should be less than or equal to accomodationEndDate' };
      }
      if (accomodationStartDate < requiredFromDate) {
        errors['invalidDuration5'] = { message: 'accomodationStartDate should be greater than or equal to departure Date' };
      }
      if (accomodationEndDate > requiredToDate) {
        errors['invalidDuration6'] = { message: 'accomodationEndDate should be greater than or equal to return Date' };
      }
      if (personalStartDate > personalEndDate) {
        errors['invalidDuration4'] = { message: 'personalStartDate should be less than or equal to personalEndDate' };
      }
      if (personalStartDate < requiredFromDate) {
        errors['invalidDuration7'] = { message: 'personalStartDate should be greater than or equal to departure Date' };
      }
      if (personalEndDate > requiredToDate) {
        errors['invalidDuration8'] = { message: 'personalEndDate should be less than or equal to return Date' };
      }

      return Object.keys(errors).length ? errors : null;
    };
  }


  static benefitDateValidator2(_returnDate: string, _departureDate: string): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {

      const returnDate = new Date(_returnDate);
      const departureDate = new Date(_departureDate);

      if (departureDate > returnDate) {
        return null;
      }

      return {
        invalidDuration2: true,
        message: 'Departure date of the Trip should be greater than return date of first'
      };
    };
  }

  static addArrayCustomValidator(arr: FormArray): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {
      let quantityPresent = false;

      arr.controls.forEach(elem => {
        const quantity = elem.value.Quantity;

        if (quantity != null && quantity != 0) {
          quantityPresent = true;
        }
      });

      if (!quantityPresent) {
        return { requiredQuantity: true, message: 'Quantity is Required' };
      } else {
        return null;
      }
    };
  }

  static overTimeHoursValidator(overtimeHours: any): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {
      const oTHours = group.get(overtimeHours)?.value
      if (oTHours !== '') {
        return { invalidOvertime: true };
      }
      return null;
    };
  }

  static breakTimeWithinShift(): ValidatorFn {

    return (formGroup: FormGroup): { [key: string]: any } | null => {

      const shiftStart = formGroup.get('shiftStart')?.value;
      const shiftEnd = formGroup.get('shiftEnd')?.value;
      const breakStart = formGroup.get('breakStart')?.value;
      const breakEnd = formGroup.get('breakEnd')?.value;
      if (shiftStart && shiftEnd && breakStart && breakEnd) {
        const shiftStartMoment = moment(shiftStart, 'HH:mm');
        const shiftEndMoment = moment(shiftEnd, 'HH:mm');
        const breakStartMoment = moment(breakStart, 'HH:mm');
        const breakEndMoment = moment(breakEnd, 'HH:mm');

        if (
          breakStartMoment.isBefore(shiftStartMoment) ||
          breakEndMoment.isAfter(shiftEndMoment) ||
          breakStartMoment.isAfter(breakEndMoment)
        ) {
          return { 'breakTimeInvalid': true };
        }
      }

      return null;
    };

  }
}
