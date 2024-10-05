import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { PaySlipService } from '../../services/pay-slip.service';
//import pdfMake from 'pdfmake/build/pdfmake';
//import pdfFonts from 'pdfmake/build/vfs_fonts';

import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { NgxSpinnerService } from 'ngx-spinner';


//pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-pay-slip',
  templateUrl: './pay-slip.component.html',
  styleUrls: ['./pay-slip.component.css']
})
export class PaySlipComponent implements OnInit {
  isShow = false;
  payslipItems: any = [];
  desColumns = ["paySlip", "salarySlipDate"];
  columnNames = ['Periods', 'Generate Date'];
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  itemsPerPage: number = 10;
  text = "";
  startDate = "";
  endDate = "";
  paySlipDetails?: any = {};
  employeeId = 0;
  timeLeft: number = 30;
  formattedTimeLeft = ""
  isTimer = false;
  errorMessage = ""
  interval;
  currentTime: Date = new Date();
  currentsalarySlipId = 0;
  showToggle = false;
  isPdf = false;
  otpValue = "";
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  onOtpChange(otp) {
    this.otpValue = otp;
    console.log("Otp change", this.otpValue)
  }
  startTimer() {
    this.isTimer = true;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        let minutes = Math.floor(this.timeLeft / 60);
        let seconds = this.timeLeft % 60;
        let formattedMinutes = ('0' + minutes).slice(-2);
        let formattedSeconds = ('0' + seconds).slice(-2);

        console.log(`${formattedMinutes}:${formattedSeconds}`);
        this.formattedTimeLeft = `${formattedMinutes}:${formattedSeconds}`
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.isTimer = false;
        console.log("Timer finished!");
      }
    }, 1000);
  }


  pauseTimer() {
    clearInterval(this.interval);
  }
  constructor(private _hS: HeaderService, private _pS: PaySlipService, private datePipe: DatePipe, private _per: MenuPermissionService, private _route: Router,
    private _toastS: ToasterService, private spinner: NgxSpinnerService,) {
    let tabs = [];
    let isTabActive = false;
    if (this._per.hasPermission('Pay Slip')) {
      tabs.push({ title: '', url: '', isActive: true })
    }
    else {
      this._route.navigateByUrl('/connect/dashborad/my-dashboard');
    }

    this._hS.updateHeaderData({
      title: 'Pay Slip',
      tabs: tabs,
      isTab: isTabActive,
    })

  }

  ngOnInit(): void {
    this.getCurrentYearDateFormatted();
    this.getPayslip();
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


  hideSalerySlip() {
    this.isShow = false;
  }
  submitOtp() {
    this.getPayslipDetails();
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
  getPayslip() {
    const data = {
      "pageNumber": this.pageNumber,
      "pageSize": this.pageSize,
      "dateStart": this.startDate,
      "dateEnd": this.endDate,
      "userId": localStorage.getItem('userId'),
      "searchText": this.text
    }
    //this.spinner.show();

    this._pS.getPayslip(data).subscribe((res) => {
      res.pagedReponse.data.forEach((item) => {
        item.salarySlipDate =   this.datePipe.transform(item.salarySlipDate, 'MMM dd, yyyy');
        item.paySlip = "Pay Slip" + "-" +   this.datePipe.transform(item.salarySlipDate, 'MMM dd, yyyy');
      })
      this.payslipItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
    })

  }


  visiblePages(): number[] {
    const currentPage = this.pageNumber;
    const totalPages = this.totalPages;
    let visiblePageNumbers: number[] = [];
    visiblePageNumbers.push(1);
    if (currentPage - 2 > 2) {
      visiblePageNumbers.push(-1);
    }

    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
      visiblePageNumbers.push(i);
    }
    if (currentPage + 2 < totalPages - 1) {
      visiblePageNumbers.push(-1);
    }
    if (totalPages > 1) {
      visiblePageNumbers.push(totalPages);
    }

    return visiblePageNumbers;
  }
  generalFilter() {
    this.getPayslip();
  }
  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getPayslip();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.text = "";
    this.getCurrentYearDateFormatted();

    this.getPayslip();
  }
  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getPayslip();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getPayslip();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getPayslip();
    }
  }

  calculateTimeDifference(comingDateTime) {
    debugger
    const parsedTimestamp = new Date(comingDateTime);
    const timeDifference = parsedTimestamp.getTime() - this.currentTime.getTime()
    const differenceInSeconds = Math.floor(timeDifference / 1000);
    return differenceInSeconds;
  }

  sendOtpByEmail(salarySlipId, isPdf) {
    this.ngOtpInput.setValue("");
    this.showToggle = true;
    this.currentsalarySlipId = salarySlipId;
    this.isPdf = isPdf;
    // this._pS.salarySlipSendOtpByEmail(localStorage.getItem('userId')).subscribe((res) => {
    //   if (res.statusCode == 200) {
    //     debugger
    //     this.timeLeft = this.calculateTimeDifference(res.data)
    //     this.startTimer();
    //   }
    //   else {
    //     this.errorMessage = res.message;
    //     this.isTimer = false;

    //   }

    // })
  }
  getPayslipDetails() {

    this.spinner.show();
    this._pS.getPayslipById(this.currentsalarySlipId).subscribe((res) => {
      this.spinner.hide();
      this.isShow = true;
      res.data.salaryDate =   this.datePipe.transform(res.data.salaryDate, 'MMM dd, yyyy');
      res.data.salaryTime = moment(res.data.salaryDate).format("h:mm A")
      res.data.joinigDate =   this.datePipe.transform(res.data.joinigDate, 'MMM dd, yyyy');
      this.paySlipDetails = res.data;
      this.employeeId = res.data.employeeId;
      if (this.isPdf) {
        this._pS.getPayslipPdf(this.currentsalarySlipId).subscribe(
          (res) => {
            const linkSource = 'data:application/pdf;base64,' + `${res.pdfBase64}`
            const downloadLink = document.createElement("a");
            const currentDate = new Date();
            const timestamp = currentDate.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' }).replace(/ /g, ' ');
            const pdfName = `Payslip_EmployeeId#${this.employeeId}_${timestamp}.pdf`;
            downloadLink.href = linkSource;
            downloadLink.download = pdfName;
            downloadLink.click();
          },
          (error) => {
            console.error('Error downloading PDF:', error);
          }
        );
      }
    })
  }


  // generatePdf() {
  //
  //   const tableLayouts = {

  //   };
  //   const employeeData = [];
  //   employeeData.push(['Employee', 'Employee ID', 'Employment Type'])
  //   const employeeArray1Values = [];
  //   const employeeArray2Values = [];
  //   const employeeArray3Values = [];
  //   const employeeArray4Values = [];
  //   const employee = this.paySlipDetails.employeeName
  //   employeeArray1Values.push(employee, this.paySlipDetails.employeeId, this.paySlipDetails.title)
  //   employeeData.push(employeeArray1Values)
  //   employeeData.push(['CNIC', 'Designation', 'Department'])
  //   employeeArray2Values.push(this.paySlipDetails.cnic, this.paySlipDetails.designation, this.paySlipDetails.department)
  //   employeeData.push(employeeArray2Values)
  //   employeeData.push(['Date of Joining', 'Grade', 'Location'])
  //   employeeArray3Values.push(this.paySlipDetails.joinigDate, this.paySlipDetails.grade, this.paySlipDetails.location)
  //   employeeData.push(employeeArray3Values)
  //   employeeData.push(['Bank, 2022', 'Account No.', 'Service Period'])
  //   employeeArray4Values.push(this.paySlipDetails.bank, this.paySlipDetails.accountNo, this.paySlipDetails.servicePeriod)
  //   employeeData.push(employeeArray4Values)
  //   const boldRowsIndices = [0, 2, 4, 6, 8, 10];
  //   const modifiedData = employeeData.map((row, index) => row.map((cell, cellIndex) => {
  //     const cellData = {
  //       text: cell,
  //       bold: boldRowsIndices.includes(index),
  //     };
  //     if (boldRowsIndices.includes(index)) {
  //       cellData['fontSize'] = 13;
  //       cellData['border'] = [false, false, false, true];
  //     } else {
  //       cellData['border'] = [false, false, false, true];
  //       cellData['fontSize'] = 10;
  //     }
  //     return cellData;
  //   }));



  //   const saleryData = [
  //     [
  //       { text: 'Gross Salary', bold: true, fontSize: 13 },
  //       { text: 'Other Payments', bold: true, fontSize: 13 },
  //       { text: 'Deductions', bold: true, fontSize: 13 }
  //     ],

  //     [
  //       {
  //         columns: [
  //           { text: 'Basic', fontSize: 10, alignment: 'left' },
  //           { text: this.paySlipDetails.basicSalary, fontSize: 10, alignment: 'right' }
  //         ]
  //       },
  //       {
  //         text: '',
  //         fontSize: 10
  //       },
  //       {
  //         text: `Income Tax ${this.paySlipDetails.deduction}`,
  //         fontSize: 10
  //       }
  //     ],
  //     [
  //       {
  //         columns: [
  //           { text: 'House Rent', fontSize: 10, alignment: 'left' },
  //           { text: this.paySlipDetails.houseRent, fontSize: 10, alignment: 'right' }
  //         ]
  //       },
  //       { text: '-', fontSize: 10 },
  //       { text: '-', fontSize: 10 }
  //     ],
  //     [
  //       {
  //         columns: [
  //           { text: 'Utilities', fontSize: 10, alignment: 'left' },
  //           { text: this.paySlipDetails.utilities, fontSize: 10, alignment: 'right' }
  //         ]
  //       },
  //       { text: '-', fontSize: 10 },
  //       { text: '-', fontSize: 10 }
  //     ],
  //     [
  //       {
  //         columns: [
  //           { text: 'COLA', fontSize: 10, alignment: 'left' },
  //           { text: this.paySlipDetails.cola, fontSize: 10, alignment: 'right' }
  //         ]
  //       },
  //       { text: '-', fontSize: 10 },
  //       { text: '-', fontSize: 10 }
  //     ],
  //     [
  //       {
  //         columns: [
  //           { text: 'P.E. Special allow', fontSize: 10, alignment: 'left' },
  //           { text: this.paySlipDetails.peSpecialAllow, fontSize: 10, alignment: 'right' }
  //         ]
  //       },
  //       { text: '-', fontSize: 10 },
  //       { text: '-', fontSize: 10 }
  //     ],
  //     [
  //       {
  //         columns: [
  //           { text: 'Ad-hoc Relief', fontSize: 10, alignment: 'left' },
  //           { text: this.paySlipDetails.adhocRelief, fontSize: 10, alignment: 'right' }
  //         ]
  //       },
  //       { text: '-', fontSize: 10 },
  //       { text: '-', fontSize: 10 }
  //     ],
  //     [
  //       {
  //         columns: [
  //           { text: 'Total', bold: true, fontSize: 10, alignment: 'left' },
  //           { text: '212,711', bold: true, fontSize: 10, alignment: 'right' }
  //         ]
  //       },
  //       {
  //         columns: [
  //           { text: 'Total', bold: true, fontSize: 10, alignment: 'left' },
  //           { text: '0', bold: true, fontSize: 10, alignment: 'right' }
  //         ]
  //       },
  //       {
  //         columns: [
  //           { text: 'Total', bold: true, fontSize: 10, alignment: 'left' },
  //           { text: '0', bold: true, fontSize: 10, alignment: 'right' }
  //         ]
  //       }
  //     ]
  //   ];



  //   const incomeTaxData = [
  //     [{ text: 'Taxable Income', bold: true, fontSize: 10 }, { text: 'Tax Slab', bold: true, fontSize: 10 }, { text: 'Tax Chargeable', bold: true, fontSize: 10 }, { text: 'Tax Credit | Adj.', bold: true, fontSize: 10 }, { text: 'Tax Deducted', bold: true, fontSize: 10 }, { text: 'Tax Payable', bold: true, fontSize: 10 }],
  //   ];
  //   const incomeTaxDataValues = []
  //   incomeTaxDataValues.push(this.paySlipDetails.taxableIncome, this.paySlipDetails.taxSlab, this.paySlipDetails.taxChargeable, this.paySlipDetails.taxCreditAdj,
  //     this.paySlipDetails.taxDeducted, this.paySlipDetails.taxPayable)
  //   incomeTaxData.push(incomeTaxDataValues)

  //   const providentFundData = [
  //     [{ text: 'Member Contribution', bold: true, fontSize: 10 }, { text: 'Company Contribution', bold: true, fontSize: 10 }, { text: 'Member Profit', bold: true, fontSize: 10 }, { text: 'Company Profit', bold: true, fontSize: 10 }, { text: 'Permanent Withdrawals', bold: true, fontSize: 10 }, { text: 'Temporary Withdrawals', bold: true, fontSize: 10 }, { text: 'Withdrawal Recovery to date', bold: true, fontSize: 10 }, { text: 'Available PF Balance', bold: true, fontSize: 10 }],
  //   ];
  //   const providentFundDataValues = []
  //   providentFundDataValues.push(this.paySlipDetails.memberContribution,
  //     this.paySlipDetails.companyContribution,
  //     this.paySlipDetails.memberProfit,
  //     this.paySlipDetails.companyProfit,
  //     this.paySlipDetails.permanentWithDrawals,
  //     this.paySlipDetails.temporaryWithDrawals,
  //     this.paySlipDetails.withRecoveryToDate,
  //     this.paySlipDetails.availablePFBalance,)
  //   providentFundData.push(providentFundDataValues)


  //   const loanData = [
  //     [{ text: 'Loan Name', bold: true, fontSize: 10 }, { text: 'Opening', bold: true, fontSize: 10 }, { text: 'Deduction', bold: true, fontSize: 10 }, { text: 'Balance Amount', bold: true, fontSize: 10 }, { text: 'Remaining Installment', bold: true, fontSize: 10 }]
  //   ];
  //   const loanDataValues = []
  //   loanDataValues.push(this.paySlipDetails.loanName,
  //     this.paySlipDetails.opening,
  //     this.paySlipDetails.deduction,
  //     this.paySlipDetails.balanceAmount,
  //     this.paySlipDetails.remainingBalance,)
  //   loanData.push(loanDataValues)
  //   const docDefinition = {
  //     content: [
  //       {
  //         ul: [
  //           { text: 'Published', bold: true, listType: 'none' },
  //           { text: 'Date 7 September, 2022', listType: 'none' },
  //           { text: 'At 5:54 PM', listType: 'none' },
  //           { text: 'By ABAP_DEV', listType: 'none' },
  //         ],
  //         style: 'rightSide'
  //       },
  //       { text: 'HIGHNOON LABORATORIES LIMITED', style: 'header' },
  //       { text: 'Salary Slip for the Month of July 2022', style: 'subheader' },
  //       {
  //         table: {
  //           body: modifiedData, // Use the modified data array
  //           headerRows: 0, // Specify the number of header rows
  //           widths: ['*', '*', '*'], // Adjust column widths as needed
  //         },
  //         style: 'employee',
  //         layout: tableLayouts,
  //       },
  //       {
  //         table: {
  //           body: saleryData,
  //           headerRows: 1,
  //           widths: ['*', '*', '*'],
  //         },
  //         style: 'salery',
  //       },

  //       {
  //         text: 'Income Tax',
  //         style: 'leftHeaderText'
  //       },
  //       {
  //         table: {
  //           headerRows: 1,
  //           body: incomeTaxData,
  //         },
  //         style: 'tableStyle',
  //         layout: 'lightHorizontalLines',
  //       },
  //       {
  //         text: 'Provident Fund',
  //         style: 'leftHeaderText'

  //       },
  //       {
  //         table: {
  //           headerRows: 1,
  //           body: providentFundData,
  //         },
  //         style: 'tableStyle',
  //         layout: 'lightHorizontalLines',
  //       },
  //       {
  //         text: 'Loan Information',
  //         style: 'leftHeaderText'
  //         // Adjust margin as needed
  //       },
  //       {
  //         table: {
  //           headerRows: 1,
  //           body: loanData,
  //         },
  //         style: 'tableStyle',
  //         layout: 'lightHorizontalLines',
  //       },

  //     ],
  //     styles: {
  //       rightSide: { alignment: 'right' },
  //       header: { fontSize: 18, bold: true, alignment: 'center' },
  //       subheader: { fontSize: 10, bold: true, alignment: 'center' },
  //       employee: {
  //         alignment: 'left', margin: [20, 25, 0, 0],
  //       },
  //       salery: { margin: [20, 25, 0, 0] },
  //       leftHeaderText: { fontSize: 18, bold: true, margin: [0, 25, 0, 0] },
  //       tableStyle: {
  //         fontSize: 10,
  //         margin: [20, 10, 0, 0],
  //       },
  //     }
  //   };
  //   const currentDate = new Date();
  //   const timestamp = currentDate.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' }).replace(/ /g, ' ');
  //   const pdfName = `Payslip_EmployeeId#${this.employeeId}_${timestamp}.pdf`;
  //   pdfMake.createPdf(docDefinition).download(pdfName);
  // }

}
