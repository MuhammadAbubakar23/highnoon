import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { BusinessTravelRequisitionService } from '../../../services/business-travel-requisition.service';
import { CurrencyTypesService } from 'src/app/main/console/services/currency-types.service';
import { CountryService } from 'src/app/main/console/services/country.service';
import { CityService } from 'src/app/main/console/services/city.service';
import { TravelTypesService } from 'src/app/main/console/services/travel-types.service';
import { TravelPreferenceTimeService } from 'src/app/main/console/services/travel-preference-time.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TravelClassService } from 'src/app/main/console/services/travel-class.service';
import { LeavesService } from 'src/app/main/leaves/services/leaves.service';
import { CustomValidators } from 'src/app/validators/custom.validators';

const imageBaseUrl = environment.imageBaseUrl;

@Component({
  selector: 'app-create-business-travel-requisition',
  templateUrl: './create-business-travel-requisition.component.html',
  styleUrls: ['./create-business-travel-requisition.component.css']
})
export class CreateBusinessTravelRequisitionComponent implements OnInit {
  currentId: any;
  tripForms: FormGroup[] = [];
  travelRequisitionForm: FormGroup;
  leaveQuota: any;
  flag = true;
  masterId: number = 0;
  detailId: any = 0;
  currencyTypeItems: any[] = [];
  countryTypeItems: any[] = [];
  cityTypeItems: any[] = [];
  travelTypeItems: any[] = [];
  travelClassItems: any[] = [];
  travelPreferenceItems: any[] = [];
  tripForm: FormGroup;
  selectedFiles: { [key: number]: any[] } = {};
  departureDateControl = new FormControl();
  travelClass: any[] = [
    { name: 'Economy', id: 1 },
    { name: 'Business', id: 2 },
  ];

  constructor(private fb: FormBuilder, private _hS: HeaderService, private spinner: NgxSpinnerService, private _toastS: ToasterService, private _BS: BusinessTravelRequisitionService,
    private countryS: CountryService, private http: HttpClient, private _lS: LeavesService, private currencyS: CurrencyTypesService, private cityS: CityService, private travelS: TravelTypesService, private travelC: TravelClassService, private _aR: ActivatedRoute, private _r: Router, private tPreferenceS: TravelPreferenceTimeService) {
    _hS.updateHeaderData({
      title: 'Create Requisition',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }

  ngOnInit() {
    this.getCurrencyTypes();
    this.getCountries();
    this.getCities();
    this.getTravelTypes();
    this.getTravelClasses();
    this.getTravelPreference();
    this.getLeaveQuote();
    this.createForm(this.detailId);
    this.getExistingRequisition();
  }
  createForm(detailId) {
    this.travelRequisitionForm = this.fb.group({
      travelExpenseMasterId: [0],
      requestName: [null, Validators.required],
      addTravelDetailsRequisitions: this.fb.array([this.createTripArray(detailId)])
    })
  }

  createTripArray(detailId) {
    return this.fb.group({
      tripType: [null, Validators.required],
      countryFromId: [null, Validators.required],
      countryToId: [null, Validators.required],
      cityFromId: [null, Validators.required],
      cityToId: [null, Validators.required],
      departureDate: ['', Validators.required],
      returnDate: ['', Validators.required],
      travelPreferenceTimeId: [null, Validators.required],
      travelClassId: [null, Validators.required],
      travelTypeId: [null, Validators.required],
      pickUpRequired: [false],
      contactNumber: [null, Validators.required],
      currencyTypeId: [null, Validators.required],
      advanceCurrency: [null, Validators.required],
      accomodationStartDate: ['', Validators.required],
      accomodationEndDate: ['', Validators.required],
      personalStartDate: ['', Validators.required],
      personalEndDate: ['', Validators.required],
      personalReason: ['', Validators.required],
      files: this.fb.array([]),
      travelRequisitionMasterId: this.masterId,
      travelRequisitionDetailId: detailId
    });
  }
  addCustomValidator(form) {
    const returnDate = form.get('returnDate').value;

    if (returnDate !== null) {
      form.setValidators(
        CustomValidators.benefitDateValidator('departureDate', 'returnDate')
      );
      form.updateValueAndValidity();
    }
  }

  isDurationOk(form): boolean {
    return (form.getError('invalidDuration')
      && form.get('returnDate').touched)
  }

  addCustomValidator2(i, form) {
    if (i > 0) {
      const travelDetailsArray = this.travelRequisitionForm.get('addTravelDetailsRequisitions') as FormArray;
      const previousForm = travelDetailsArray.controls[i - 1];
      const returnDate = previousForm.get('returnDate').value;
      const departureDate = form.get('departureDate').value;


      if (returnDate != null && departureDate != null) {
        form.setValidators(
          CustomValidators.benefitDateValidator2(returnDate, departureDate)
        );
        form.updateValueAndValidity();
      }
    }
  }

  isDurationOk2(form): boolean {
    return (form.getError('invalidDuration2')
      && form.get('departureDate').touched)
  }

  isDurationOk3(form): boolean {
    return (form.getError('invalidDuration3')
      && form.get('accomodationEndDate').touched)
  }
  isDurationOk4(form): boolean {
    return (form.getError('invalidDuration4')
      && form.get('personalEndDate').touched)
  }
  isDurationOk5(form): boolean {
    return (form.getError('invalidDuration5')
      && form.get('accomodationStartDate').touched)
  }
  isDurationOk6(form): boolean {
    return (form.getError('invalidDuration6')
      && form.get('accomodationEndDate').touched)
  }
  isDurationOk7(form): boolean {
    return (form.getError('invalidDuration7')
      && form.get('personalStartDate').touched)
  }
  isDurationOk8(form): boolean {
    return (form.getError('invalidDuration8')
      && form.get('personalEndDate').touched)
  }
  getTrip(form): Array<any> {
    return form.controls.addTravelDetailsRequisitions.controls;
  }

  addTrip(detailsId) {
    const control = <FormArray>this.travelRequisitionForm.get('addTravelDetailsRequisitions');
    control.push(this.createTripArray(detailsId));
  }
  deleteTripFromLast(index) {
    console.log(this.travelRequisitionForm.controls['addTravelDetailsRequisitions']);
    const control = this.travelRequisitionForm.controls['addTravelDetailsRequisitions'] as FormArray;
    control.removeAt(index);
    console.log(control);
  }
  get tRF() {
    return this.travelRequisitionForm.controls;
  }

  tRDFCurrent(form) {
    return form.controls
  }

  submitForm(): void {

    if (this.travelRequisitionForm.valid) {

      console.log(this.travelRequisitionForm.value)


      if (this.currentId !== 0 && this.currentId !== undefined) {
        let travelExpenseMasterId = this.travelRequisitionForm.get('travelExpenseMasterId').value;
        let requestName = this.travelRequisitionForm.get('requestName').value;
        let tripForms = this.travelRequisitionForm.get('addTravelDetailsRequisitions')?.value as any[];

        // const data = {
        //   "userId": localStorage.getItem('userId'),
        //   "travelExpenseMasterId": 1,
        //   "requestName": requestName,
        //   "travelStatus": 1,
        //   "addTravelDetailsRequisitions": tripForms,
        // };
        tripForms.forEach((trip) => {

          this._BS.updateTravelRequisition(trip).subscribe((res) => {
            if (res.statusCode === 200) {
              const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Request Sent Successfully", toastParagrahp: "Your Benefit Request has been sent for approval." }
              this._toastS.updateToastData(toasterObject)
              this._r.navigate(['/connect/expense/businesstravelrequisition']);
              this._toastS.hide();

            }

          }, (error: any) => {
            const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
            this._toastS.updateToastData(toasterObject)
            this._toastS.hide();
          })
        })
      }

      else {
        let travelExpenseMasterId = this.travelRequisitionForm.get('travelExpenseMasterId').value;
        let requestName = this.travelRequisitionForm.get('requestName').value;
        let tripForms = this.travelRequisitionForm.get('addTravelDetailsRequisitions')?.value as any[];

        const data = {
          "userId": localStorage.getItem('userId'),
          "travelExpenseMasterId": travelExpenseMasterId,
          "requestName": requestName,
          "travelStatus": 1,
          "addTravelDetailsRequisitions": tripForms,
        };

        this._BS.createTravelRequisition(data).subscribe((res) => {
          if (res.statusCode === 200) {
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Request Sent Successfully", toastParagrahp: "Your Benefit Request has been sent for approval." }
            this._toastS.updateToastData(toasterObject)
            this._r.navigate(['/connect/expense/businesstravelrequisition']);
            this._toastS.hide();

          }

        }, (error: any) => {
          const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
          this._toastS.updateToastData(toasterObject)
          this._toastS.hide();
        })
      }
    }
    else {
      this.markFormGroupTouched(this.travelRequisitionForm);
    }

  }
  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
    this.flag = false;
  }
  getCurrencyTypes() {
    this.currencyS.getAllCurrencyTypes(1, 10).subscribe((res) => {
      this.currencyTypeItems = res?.data.map(currency => ({ currencyCode: currency.currencyCode, currencyTypeId: currency.currencyTypeId }));
    })
  }
  getCountries() {
    this.countryS.getCountry(1, 10).subscribe((res) => {
      this.countryTypeItems = res.data.map(country => ({ name: country.name, countryId: country.countryId }));
    })
  }
  getCities() {
    this.cityS.getCity(1, 10).subscribe((res) => {
      this.cityTypeItems = res?.data.map(city => ({ name: city.name, cityId: city.cityId }));
    })
  }
  getTravelTypes() {
    this.travelS.getAllTravelTypes(1, 10).subscribe((res) => {
      this.travelTypeItems = res?.data;
    })
  }
  getTravelClasses() {
    this.travelC.getAllTravelClasses(1, 10).subscribe((res) => {
      this.travelClassItems = res?.data;
    })
  }
  getTravelPreference() {
    this.tPreferenceS.getAllTravelPreferenceTime(1, 10).subscribe((res) => {
      this.travelPreferenceItems = res?.data;
    })
  }
  onFileSelected(event: any, tripIndex: number, trip: FormGroup) {

    const fileInput = event.target as HTMLInputElement;
    const filesFormArray = trip.get('files') as FormArray;

    if (!this.selectedFiles[tripIndex]) {
      this.selectedFiles[tripIndex] = [];
    }

    for (let i = 0; i < fileInput.files.length; i++) {
      const file = fileInput.files[i];
      console.log("files---", file);
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        this.selectedFiles[tripIndex].push({ name: file.name, attachements: base64String });

        const fileFormGroup = this.fb.group({
          name: [file.name],
          attachements: [base64String]
        });

        filesFormArray.push(fileFormGroup);
        console.log("filesCheck->>", trip);
        console.log("attachment->>", base64String);
      };

      reader.readAsDataURL(file);
    }
  }
  // isAttachmentValid(tripIndex: number){
  //   if(!this.selectedFiles[tripIndex] && this.flag == false){
  //     return false;
  //   }
  //   else
  //     return true ;
  // }
  removeFile(i, index: number, trip) {
    this.selectedFiles[i].splice(index, 1);
    const filesFormArray = trip.get('files') as FormArray;
    filesFormArray.removeAt(index)
  }

  changeHeader(title: string) {
    if (title === 'create') {
      this._hS.updateHeaderData({
        title: 'Create Requisition',
        tabs: [{ title: '', url: '', isActive: true }],
        isTab: false,
      })
    }
    else {
      this._hS.updateHeaderData({
        title: 'Update Requisition',
        tabs: [{ title: '', url: '', isActive: true }],
        isTab: false,
      })
    }
  }
  getExistingRequisition() {

    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update');
        this.spinner.show();
        this._BS.getRequisitionRequestSummary(this.currentId).subscribe((res) => {
          this.spinner.hide();
          this.travelRequisitionForm.reset();
          console.log("travelRequisitionForm", this.travelRequisitionForm);
          this.masterId = this.currentId;
          console.log("current id", this.currentId)
          console.log("master Id", this.masterId)

          this.createForm(res.data.travelRequisitionSummaryDetails[0].travelRequisitionDetailsId)
          const numberOfTrips = res.data.travelRequisitionSummaryDetails.length;
          for (let i = 1; i < numberOfTrips; i++) {
            this.addTrip(res.data.travelRequisitionSummaryDetails[i].travelRequisitionDetailsId);
          }
          console.log("travelRequisitionForm", this.travelRequisitionForm);
          console.log("Response", res);
          this.travelRequisitionForm.patchValue({
            requestName: res.data.requestName,
            addTravelDetailsRequisitions: res.data.travelRequisitionSummaryDetails,
          })
          // const attachmentsArray = res.data.travelRequisitionAttachments;
          const DataArray = res.data.travelRequisitionSummaryDetails;

          console.log("Updated Response", res);

          const addTravelDetailsRequisitionsForm: FormArray = this.travelRequisitionForm.controls['addTravelDetailsRequisitions'] as FormArray;

          var index = 0;
          addTravelDetailsRequisitionsForm.controls.forEach((form) => {
            const data = DataArray[index];
            console.log("index->", index);
            console.log("DataArray->", DataArray[index]);
            if (data) {
              form.patchValue({
                countryFromId: this.getCountryIdFromName(data.countryFrom),
                countryToId: this.getCountryIdFromName(data.countryTo),
                cityFromId: this.getCityIdFromName(data.fromCity),
                cityToId: this.getCityIdFromName(data.toCity),
                departureDate: this.formatDate(data.departureDate),
                returnDate: this.formatDate(data.returnDate),
                travelPreferenceTimeId: this.getTravelPreferenceTimeIdFromName(data.travelPreferenceTimeFrom),
                travelClassId: this.getTravelClassIdFromName(data.travelClass),
                travelTypeId: this.getTravelTypeIdFromName(data.travelBy),
                currencyTypeId: this.getCurrencyIdFromName(data.currencyType),
                accomodationStartDate: this.formatDate(data.accomodationStartDate),
                accomodationEndDate: this.formatDate(data.accomodationEndDate),
                personalStartDate: this.formatDate(data.personalStartDate),
                personalEndDate: this.formatDate(data.personalEndDate),
              });
            }

            const filesFormArray = form.get('files') as FormArray;
            data.travelRequisitionAttachmentDetails?.forEach((e) => {
              // console.log("imageBaseUrl->",imageBaseUrl)
              // console.log("e.attachmentUrl->",e.attachmentUrl)
              // this.http.get(imageBaseUrl + e.attachmentUrl, { responseType: 'blob' })
              // .subscribe((blob: Blob) => {
              //     const reader = new FileReader();
              //     reader.onloadend = () => {
              //         const base64data = reader.result;
              //         console.log('Base64 data:', base64data);
              //         const fileFormGroup = this.fb.group({
              //           name: [e.attachmentName],
              //           attachements: [base64data]
              //         });
              //         filesFormArray.push(fileFormGroup);
              //       };
              //     reader.readAsDataURL(blob);
              // });

              const fileFormGroup = this.fb.group({
                name: [e.attachmentName],
                attachements: [e.attachmentUrl]
              });
              filesFormArray.push(fileFormGroup);

              if (!this.selectedFiles[index]) {
                this.selectedFiles[index] = [];
              }
              this.selectedFiles[index].push({ name: e.attachmentName, attachements: e.attachmentUrl });
            })

            console.log("files", filesFormArray)
            console.log("selectedFiles", this.selectedFiles)

            index = index + 1;
          });
        })
      }
    })
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  getCountryIdFromName(countryName) {
    const country = this.countryTypeItems.find(item => item.name === countryName);
    return country ? country.countryId : null;
  }
  getCityIdFromName(cityName) {
    const city = this.cityTypeItems.find(item => item.name === cityName);
    return city ? city.cityId : null;
  }

  getCurrencyIdFromName(name) {
    const currency = this.currencyTypeItems.find(item => item.currencyCode === name);
    return currency ? currency.currencyTypeId : null;
  }

  getTravelTypeIdFromName(name) {
    const travel = this.travelTypeItems.find(item => item.travelByName === name);
    return travel ? travel.travelById : null;
  }
  getTravelClassIdFromName(name) {
    const travel = this.travelClassItems.find(item => item.travelClassName === name);
    return travel ? travel.travelClassId : null;
  }
  getTravelPreferenceTimeIdFromName(time) {
    const preference = this.travelPreferenceItems.find(item => item.fromTime === time);
    return preference ? preference.preferenceTimeId : null;
  }

  downloadAttachment(attachmentUrl: string): void {

    this._BS.downloadAttachment(attachmentUrl).subscribe(blob => {
      const image = blob;
      console.log("image", image)
    });
  }

  getLeaveQuote() {
    this._lS.getLeaveQoutaByEmployeeId(Number(localStorage.getItem('userId'))).subscribe((res) => {
      this.leaveQuota = res;
      this.leaveQuota.acquired = res.totalLeaves - res.remainingLeaves;
      console.log("leave quota", this.leaveQuota.acquired);
    })
  }
}
