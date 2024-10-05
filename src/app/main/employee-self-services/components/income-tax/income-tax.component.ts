import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { IncomeTaxService } from '../../services/income-tax.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
@Component({
  selector: 'app-income-tax',
  templateUrl: './income-tax.component.html',
  styleUrls: ['./income-tax.component.css']
})
export class IncomeTaxComponent implements OnInit {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  itemsPerPage: number = 10;
  text = "";
  startDate = "";
  currentTime: Date = new Date();
  endDate = "";
  taxId = 1;
  incomeTaxItems: any[] = [];
  incomTaxDetails?: any = {};
  monthlySalaryTaxesItems: any[] = [];
  From = ""
  netIncome=0;
  slabStart="";
  slabEnd="";
  currentTaxId = 0;
  timeLeft: number = 30;
  formattedTimeLeft = ""
  isTimer = false;
  errorMessage = ""
  interval;
  monthlySalaryDisColumns = ["Date of deposit", "SBP/NBP/Treasury", "Branch/City", "Amount(Rupees)", "Challan/Treasury No."];
  monthlySalaryColumns: any[] = ['despiteDate', 'bank', 'branch', 'amount', 'challanNo'];
  otpValue = "";
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  onOtpChange(otp) {
    this.otpValue = otp;
    console.log("Otp change", this.otpValue)
  }
  @ViewChild('reportContent') reportContent: ElementRef;
  //@ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;
  constructor(private _hS: HeaderService, private _incomeTaxS: IncomeTaxService,private _per: MenuPermissionService
    , private _route: Router , private datePipe: DatePipe) {

    let tabs = [];
    let isTabActive = false;
    if (this._per.hasPermission('Income Tax Slip')) {
      tabs.push({ title: '', url: '', isActive: true })
    }
    else {
      this._route.navigateByUrl('/connect/dashborad/my-dashboard');
    }
    this._hS.updateHeaderData({
      title: 'Income Tax',
      tabs: tabs,
      isTab: isTabActive,
    })
  }
  ngOnInit(): void {
    this.getCurrentYearDateFormatted();
    this.getIncomeTax();
  }
  getCurrentYearDateFormatted() {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1); // January 1st
    const endOfYear = new Date(today.getFullYear(), 11, 31); // December 31st
    const parsedStartDate = this.datePipe.transform(startOfYear, 'yyyy-MM-dd');
    const parsedEndDate = this.datePipe.transform(endOfYear, 'yyyy-MM-dd');
    this.startDate = parsedStartDate;
    this.endDate = parsedEndDate;
  }
  getIncomeTax() {
    const data = {
      "pageNumber": this.pageNumber,
      "pageSize": this.pageSize,
      "dateStart": "2022-07-01",
      "dateEnd": "2023-06-30",
      "searchText": this.text
    }
    //this.spinner.show();

    this._incomeTaxS.getIncomeTax(data).subscribe((res) => {
      console.log("IncomeTax", res);
      // res.pagedReponse.data.forEach((item) => {
      //   item.salarySlipDate = moment(item.salarySlipDate)
      //   item.paySlip = "Pay Slip" + "-" + moment(item.salarySlipDate)
      // })
      this.incomeTaxItems = res.data.data;
      this.totalPages = res.data.totalPages;
      this.totalRecords = res.data.totalRecords;
      this.netIncome=res.netIncome;
      this.slabStart= res.slabStart;
      this.slabEnd=res.slabEnd;
    })
  }
  calculateTimeDifference(comingDateTime) {
    const parsedTimestamp = new Date(comingDateTime);
    const timeDifference = parsedTimestamp.getTime() - this.currentTime.getTime()
    const differenceInSeconds = Math.floor(timeDifference / 1000);
    return differenceInSeconds;
  }

  sendOtpByEmail(taxId) {
    this.ngOtpInput.setValue("");
    //this.showToggle = true;
    this.currentTaxId = taxId;
    //this.isPdf = isPdf;



    // this._pS.salarySlipSendOtpByEmail(localStorage.getItem('userId')).subscribe((res) => {
    //   if (res.statusCode == 200) {
    //
    //     this.timeLeft = this.calculateTimeDifference(res.data)
    //     this.startTimer();
    //   }
    //   else {
    //     this.errorMessage = res.message;
    //     this.isTimer = false;

    //   }

    // })
  }
  getIncomeTaxDetails(taxId) {


    //this.convertToPDF()
    this._incomeTaxS.getIncomeTaxById(taxId).subscribe((res) => {
      if (res.pagedResponse.issueDate) {
        res.pagedResponse.issueDate =  this.datePipe.transform(res.pagedResponse.issueDate, 'MMM dd, yyyy');
      }
      if (res.pagedResponse.from) {
        res.pagedResponse.from =   this.datePipe.transform(res.pagedResponse.from, 'MMM dd, yyyy');
      }
      if (res.pagedResponse.to) {
        res.pagedResponse.to =   this.datePipe.transform(res.pagedResponse.to, 'MMM dd, yyyy');
      }

      this.incomTaxDetails = res.pagedResponse;
      res.pagedResponse.monthlyySalaryTaxes.forEach((item) => {
        if (item.despiteDate) {
          item.despiteDate =   this.datePipe.transform(item.despiteDate, 'MMM dd, yyyy');
        }
      })
      this.monthlySalaryTaxesItems = res.pagedResponse.monthlyySalaryTaxes;
      this._incomeTaxS.getIncomeTaxPdf(taxId).subscribe((res) => {
        console.log("Income Tax Pdf: " + res)
        const linkSource = 'data:application/pdf;base64,' + `${res.pdfBase64}`
        const downloadLink = document.createElement("a");
        const fileName = "Income Tax.pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      })
      // setTimeout(()=>{
      //   this.convertToPDF()
      // },2000)

    })
  }
  submitOtp(taxId,content) {
    this.currentTaxId=taxId;
    this.getIncomeTaxDetails(taxId);
    // this._pS.salarySlipsVerifyOtp(Number(localStorage.getItem('userId')), this.otpValue).subscribe((res) => {
    //   if (res.statusCode === 200) {
    //     this.getPayslipDetails()

    //   }
    //   else {
    //     const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: `${res.message}` }
    //     this._toastS.updateToastData(toasterObject)
    //     this._toastS.hide();
    //   }
    // })

  }


}
