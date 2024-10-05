import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import * as XLSX from 'xlsx';
import { SchedularService } from '../../services/schedular.service';
@Component({
  selector: 'app-scheduler-bulk-upload',
  templateUrl: './scheduler-bulk-upload.component.html',
  styleUrls: ['./scheduler-bulk-upload.component.css']
})
export class SchedulerBulkUploadComponent {
  file: DataTransfer
  validFile: boolean = true;
  fileRequired: boolean = false;
  isFileField = true;
  isProgressBar = false;
  isUpload = false;
  isSave = false;
  isSuccess = false;
  isErrors = false;
  errorsData: any[] = [];
  successData: any[] = [];
  requiredColumns = [
    "userId",
    "date",
    "shiftStart",
    "shiftEnd",
    "breakStart",
    "breakEnd",
    "notes",
    "overTimeHours"
  ];
  fileSize: any
  fileName: string
  constructor(private _hS: HeaderService, private _scheduleS: SchedularService, private _toastS: ToasterService, private _r: Router
    , private _dDFS: DateTimeFormatService, private spinner: NgxSpinnerService, private datePipe: DatePipe) {
    _hS.updateHeaderData({
      title: 'Roster Bulk Upload',
      tabs: [],
      isTab: false,
    })
  }
  getFileSize(file) {
    const fileSizeInBytes = file.size;
    const fileSizeInKB = fileSizeInBytes / 1024;
    const fileSizeInMB = fileSizeInKB / 1024;
    const megabytes = fileSizeInMB.toFixed(2)
    return megabytes
  }
  isExcelFile(file: File): boolean {
    const allowedExtensions = ['.xlsx', '.xls', '.csv'];
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    return allowedExtensions.includes(fileExtension);
  }
  onFileChange(event: any) {
    this.file = <DataTransfer>(event.target);
    if (this.file.files.length > 0) {
      this.fileRequired = false;
      const file: File = this.file.files[0];
      if (this.isExcelFile(file)) {
        this.validFile = true;
      } else {
        this.validFile = false;
        console.error('Invalid file type. Please select an Excel file.');

      }
    }
  }
  fileUpload() {
    
    if (this.file === undefined || this.file.files.length === 0) {
      this.fileRequired = true;
    }
    if (this.validFile) {
      this.errorsData = [];
      this.successData = [];
      this.requiredColumns = [
        "userId",
        "date",
        "shiftStart",
        "shiftEnd",
        "breakStart",
        "breakEnd",
        "notes",
        "overTimeHours"
      ];
      
      if (this.file.files.length !== 1) {
        throw new Error('Cannot use multiple files');
      }
      const reader: FileReader = new FileReader();
      this.fileSize = this.getFileSize(this.file.files[0])
      this.fileName = this.file.files[0].name;
      reader.readAsBinaryString(this.file.files[0]);
      reader.onload = (e: any) => {

        const binarystr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, {
          raw: false,
          dateNF: 'yyyy-mm-ddTHH:MM:ss.SSSZ',
        });
        console.log("data: ", data);
        data.forEach((obj) => {
          let hasError = false;
          this.requiredColumns.forEach((key) => {
            if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
              obj[key] = "This Field is Required";
              hasError = true;
            }
          });
          if (hasError) {
            this.errorsData.push(obj);
          } else {
            this.successData.push(obj);
          }
        });
        this.isFileField = false;
        this.isUpload = true;
        this.isErrors = true;
        this.isSave = true;
      };
    }
  }
  showAll(e: any) {
    const isChecked: boolean = e.target.checked;
    if (isChecked) {
      this.isSuccess = true;
    } else {
      this.isSuccess = false;
    }
  }
  submitFile() {
    this._scheduleS.addBulkSchedular(this.successData).subscribe((res) => {
      if (res.statusCode === 200) {
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Success", toastParagrahp: "Scheduler Added Successfully!" }
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/attendance/schedular/team']);
        //this.getTeamSchedular();
        this._toastS.hide();
      }
      if (res.statusCode === 400) {
        this.requiredColumns = [
          "userId",
          "date",
          "shiftStart",
          "shiftEnd",
          "breakStart",
          "breakEnd",
          "notes",
          "overTimeHours"
        ];
        //this.requiredColumns.push("errorMessage1","errorMessage2")
        this.errorsData = [];
        this.successData = [];
        res.data.forEach((item) => {
          const parsedDate = new Date(item.date);
          item.date = this.datePipe.transform(parsedDate, 'yyyy-MM-dd');

          if ((item.errorMessage1 !== null && item.errorMessage1 !== "") || (item.errorMessage2 !== null && item.errorMessage2 !== "")) {
            const isExist1 = this.requiredColumns.includes('errorMessage1');
            const isExist2 = this.requiredColumns.includes('errorMessage2');

            if (!isExist1 && item.errorMessage1 !== null && item.errorMessage1 !== "") {
              this.requiredColumns.push("errorMessage1");
            }

            if (!isExist2 && item.errorMessage2 !== null && item.errorMessage2 !== "") {
              this.requiredColumns.push("errorMessage2");
            }
            this.errorsData.push(item);
          } else {
            this.successData.push(item);
          }
        });


        const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: res.message }
        this._toastS.updateToastData(toasterObject)
        //this._r.navigate(['/connect/attendance/schedular/team']);
        //this.getTeamSchedular();
        this._toastS.hide();
      }

    }, (error: any) => {
      console.error("Internal Server Error", error);
      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })

  }
  cancel() {
    this.isUpload = false;
    this.isSave = false;
    this.isFileField = true;

  }
}
