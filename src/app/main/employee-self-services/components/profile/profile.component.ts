import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { FormControl, Validators, FormGroup, FormControlName, FormBuilder, FormArray, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { profile } from 'src/app/shared/models/ProfileDto';

import { EmployeeService } from 'src/app/main/console/services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { DependentService } from '../../services/dependent.service';
import { Address, BankDetails, Employee, Genders, MaritalStatus } from 'src/app/main/console/models/employee';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { CustomValidators } from 'src/app/validators/custom.validators';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: profile = new profile();
  currentId: any = 0;
  updatedId: any = 0;
  updatedName: string = ""
  dependents: any = [];
  searchText = "";
  startDate = "";
  endDate = "";
  genders = Genders;
  martialStatus: any[] = [];
  employeeTypes: any = [];
  designations: any = [];
  teams: any = [];
  jobTitles: any = [];
  managers: any = [];
  cities: any[] = [];
  employee = new Employee();
  address = new Address();
  bankDetails = new BankDetails();
  isDetails: boolean = true;
  isAddress: boolean = false;
  isBank: boolean = false;
  file: File
  relations: any[] = [];
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  text = ""
  emplyeeDocsItems: any = [];
  imageBaseUrl = environment.imageBaseUrl;
  columnNames = ['Name', 'LAST MODIFIED'];
  isDocuments = false;
  UserId = Number(localStorage.getItem('userId'));
  getEnumKeys(enumObject: any): string[] {
    return Object.keys(enumObject).filter(key => isNaN(Number(enumObject[key])));
  }

  employeeForm: FormGroup;
  dependentForm = new FormGroup({
    id: new FormControl(0, [Validators.required, Validators.maxLength(200)]),
    name: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    // cnic: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    relationshipId: new FormControl(0, [Validators.required, Validators.maxLength(100)]),
    relation: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    userId: new FormControl(this.UserId)
  });

  selectedFiles: File[] = [];
  selectedProfileImage: File;
  employeeDocumentForm = new FormGroup({
    UserId: new FormControl(''),
    Files: new FormArray([])
  });
  showOffcanvas: boolean = false;
  employeeDetails: any = {};
  isEditToggle: boolean = false;
  isDeleteToggle: boolean = false;
  qualifications1: any = [];
  qualifications2: any = [];
  banks: any[] = [];
  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  closeOffset(content: TemplateRef<any>) {
    this.offcanvasService.dismiss(content);
  }
  constructor(private _empS: EmployeeService, private _hS: HeaderService, private _aR: ActivatedRoute, private _r: Router, private fb: FormBuilder
    , private _toastS: ToasterService, private _DDS: DropDownApiService, private _depS: DependentService,
    private spinner: NgxSpinnerService, private _datePipe: DatePipe, private _per: MenuPermissionService) {
    let tabs = [];
    let isTabActive = true;

    if (this._per.hasPermission('My Profile')) {

      tabs.push({ title: 'My Profile', url: 'connect/employee-self-services/my-information', isActive: true }, { title: 'My Requests', url: 'connect/employee-self-services/profile-requests', isActive: false })
    }
    if (this._per.hasPermission('Team Profile')) {
      tabs.push({ title: 'Team Requests', url: 'connect/employee-self-services/profile-team-requests', isActive: false })
    }

    this._hS.updateHeaderData({
      title: 'Profile Details',
      tabs: tabs,
      isTab: isTabActive,
    })

  }

  employeeBasicProfileForm = this.fb.group({
    userId: [this.UserId],
    personalNumber: ['', Validators.required],
    residenceNumber: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    cnicExpiry: [new Date(), Validators.required],
    maritalStatusId: ['', Validators.required],
    maritalStatusName: ['', Validators.required],
  })
  employeeBankDetailsForm = this.fb.group({
    userId: [this.UserId],
    bankId: [''],
    bankName: [''],
    bankIban: ['', Validators.required],
    bankAccount: ['', Validators.required],
  })
  employeeAddressForm = this.fb.group({
    userId: [this.UserId],
    id: [0],
    currentAddress: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required]
  })
  employeeEducationForm = this.fb.group({
    userId: [this.UserId],
    employeeEducationId: [0],
    institute: ['', Validators.required],
    countryName: ['', Validators.required],
    countryCode: ['', Validators.required],
    qualification1Id: ['', Validators.required],
    qualification1: ['', Validators.required],
    qualification2Id: [0],
    qualification2: ['', Validators.required],
  })
  employeeworkExperienceForm = this.fb.group({
    userId: [this.UserId],
    workExperienceId: [0],
    designation: ['', Validators.required],
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    responsibility: ['', Validators.required]
  })
  setmaritalStatusName(): void {
    const maritalStatus = this.martialStatus.find((item) => item.maritalStatusId === this.employeeBasicProfileForm.value['maritalStatusId'])
    this.employeeBasicProfileForm.get('maritalStatusName').setValue(maritalStatus.maritalStatusName)
  }
  setBankName(): void {
    const bank = this.banks.find((item) => item.bankId === this.employeeBankDetailsForm.value['bankId'])
    this.employeeBankDetailsForm.get('bankName').setValue(bank.bankName)
  }
  setQualification1(): void {
    const Qual = this.qualifications1.find((item) => item.qualification1Id === this.employeeEducationForm.value['qualification1Id'])
    this.employeeEducationForm.get('qualification1').setValue(Qual.qualification1Name)
  }
  setQualification2(): void {
    const Qual = this.qualifications2.find((item) => item.qualification2Id == this.employeeEducationForm.value['qualification2Id'])
    this.employeeEducationForm.get('qualification2').setValue(Qual.qualification2Name)
  }
  setRelation(): void {
    const Relation = this.relations.find((item) => item.relationshipId === this.dependentForm.value['relationshipId'])
    this.dependentForm.get('relation').setValue(Relation.relation)
  }


  get isDateGreater(): boolean {
    const fromDate = this.employeeworkExperienceForm.get('fromDate').value;
    const toDate = this.employeeworkExperienceForm.get('toDate').value;
    if (fromDate === "" || toDate === "") {
      return false;
    }
    return (toDate !== null && fromDate !== null && toDate <= fromDate);
  }
  ngOnInit(): void {
    //this.initForm();
    this.UserId = Number(localStorage.getItem('userId'));
    this.spinner.show();
    this.getProfile()
    this.getQualifications();
    this.getBanks();
    this.getDependantDetailsByEmployeeId();
    this.getRelations();
    this.getMartialStatus();
    this.getEmployeeDocs();
    // const perms = JSON.parse(localStorage.getItem('Permissions'));
    // console.log("Permissions Name", perms);
    // const menus = JSON.parse(localStorage.getItem('Menus'));
    // console.log("Menus Name", menus)

  }
  getQualifications() {
    this._DDS.getQualification1ForDD().subscribe((res) => {
      this.qualifications1 = res.data;
    })
    this._DDS.getQualification2ForDD().subscribe((res) => {
      this.qualifications2 = res.data;
    })
  }
  getBanks() {
    this._DDS.getBanksForDD().subscribe((res) => {
      this.banks = res.data;
    })

  }

  getProfile() {

    this._empS.getEmployeeById(Number(this.UserId)).subscribe((res: any) => {

      this.employeeDetails = res.data
      if (res.data.cnicExpiry) {
        res.data.cnicExpiry = this._datePipe.transform(res.data.cnicExpiry, 'yyyy-MM-dd');
        console.log(res.data.cnicExpiry);
      }
      this.updateEmployeeForm(res.data)
    })
  }
  updateEmployeeForm(data: any) {
    this.employeeBasicProfileForm.patchValue({
      personalNumber: data.personalNumber,
      residenceNumber: data.residenceNumber,
      phoneNumber: data.phoneNumber,
      cnicExpiry: data.cnicExpiry,
      maritalStatusId: data.maritalStatusId,
      maritalStatusName: data.maritalStatusName,
    })
    this.employeeBankDetailsForm.patchValue({
      bankId: data.bankId,
      bankName: data.bankName,
      bankIban: data.bankIban,
      bankAccount: data.bankAccount,
    })
    this.employeeAddressForm.patchValue({
      id: data.address.id,
      currentAddress: data.address.currentAddress,
      city: data.address.city,
      state: data.address.state
    })
  }
  getDependantDetailsByEmployeeId() {
    this.currentId = Number(this.UserId);
    if (this.currentId !== 0 && this.currentId !== undefined) {
      this._depS.getDependantByEmployeeId(this.currentId).subscribe((res) => {
        this.dependents = res.data;
        this.spinner.hide();
      })
    }
  }
  getRelations() {
    this._DDS.getRelationForDD().subscribe((res) => {
      this.relations = res.data;
    })
  }
  getMartialStatus() {
    this._DDS.getMaritalStatusForDD().subscribe((res) => {
      this.martialStatus = res.data;
    })
  }

  getEmployeeDocs() {
    this.spinner.show();
    this._empS.getEmployeeDocuments(this.pageNumber, this.pageSize, this.searchText).subscribe((res) => {
      res.data.forEach(element => {
        if (element.modifiedDate === null) {
          element.modifiedDate = element.createdDate
        }

      });
      this.emplyeeDocsItems = res.data;
      this.totalPages = res.totalPages;
      this.totalRecords = res.totalRecords;
      this.spinner.hide();
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

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getEmployeeDocs();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getEmployeeDocs();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getEmployeeDocs();
    }
  }


  resetEndDate() {
    this.endDate = '';
  }
  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getEmployeeDocs();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  generalFilter() {
    this.getEmployeeDocs();
  }
  resetinput() {
    this.searchText = '';
    this.getEmployeeDocs();
  }
  get dF() {
    return this.dependentForm.controls
  }




  deleteId(depId, depname) {
    this.updatedId = depId;
    this.updatedName = depname;
  }




  resetEducation() {
    this.employeeEducationForm.reset({
      userId: this.UserId,
      employeeEducationId: 0,
      institute: '',
      countryName: '',
      countryCode: '',
      qualification1Id: '',
      qualification2Id: 0,
    })
  }
  resetDependent() {
    this.dependentForm.reset({
      id: 0,
      name: '',
      relationshipId: 0,
      relation: '',
      userId: this.UserId
    })
  }
  resetWorkExperience() {
    this.employeeworkExperienceForm.reset({
      userId: this.UserId,
      workExperienceId: 0,
      designation: '',
      fromDate: '',
      toDate: '',
      city: '',
      country: '',
      responsibility: ''
    })
  }

  editEducation(item) {
    item.userId = this.UserId;
    this.employeeEducationForm.patchValue(item)
  }
  editWorkExperience(item) {
    item.userId = this.UserId;
    item.fromDate = this._datePipe.transform(item.fromDate, 'yyyy-MM-dd')
    item.toDate = this._datePipe.transform(item.toDate, 'yyyy-MM-dd')
    this.employeeworkExperienceForm.patchValue(item)
  }
  editDependent(item) {

    item.userId = this.UserId;
    this.dependentForm.patchValue(item)
    this.dependentForm.get('id').setValue(item.dependentId);
    this.dependentForm.get('relation').setValue(item.relationship.relation)
  }


  submitProfilePicture() {
    if (this.currentId !== 0 && this.currentId !== undefined) {

      const formData = new FormData();

      if (this.selectedProfileImage) {
        formData.append('File', this.selectedProfileImage, this.selectedProfileImage?.name);
      }
      formData.append('UserId', String(this.UserId))
      this._empS.updateProfilePicture(formData).subscribe(
        (res) => {
          if (res.statusCode === 200) {
            const toasterObject = {
              isShown: true,
              isSuccess: true,
              toastHeading: "Successfully",
              toastParagrahp: "Your Profile change request has been sent for approval."
            };
            this._toastS.updateToastData(toasterObject);
            this.getProfile();
            this._toastS.hide();
          }
        },
        (error: any) => {
          const toasterObject = {
            isShown: true,
            isSuccess: false,
            toastHeading: "Failed",
            toastParagrahp: "Internal Server Error!"
          };
          this._toastS.updateToastData(toasterObject);
          this._toastS.hide();
        }
      );
    }
  }
  submitProfileBasic(content) {
    if (this.currentId !== 0 && this.currentId !== undefined) {
      const data = this.employeeBasicProfileForm.value;
      this._empS.updateEmployeeBasicProfile(data).subscribe(
        (res) => {
          this.closeOffset(content)
          if (res.statusCode === 200) {
            const toasterObject = {
              isShown: true,
              isSuccess: true,
              toastHeading: "Successfully",
              toastParagrahp: "Your Profile change request has been sent for approval."
            };
            this._toastS.updateToastData(toasterObject);
            this.getProfile();
            this._toastS.hide();
          }
        },
        (error: any) => {
          const toasterObject = {
            isShown: true,
            isSuccess: false,
            toastHeading: "Failed",
            toastParagrahp: "Internal Server Error!"
          };
          this._toastS.updateToastData(toasterObject);
          this._toastS.hide();
        }
      );
    }
  }
  submitBankDetails(content) {
    if (this.currentId !== 0 && this.currentId !== undefined) {
      const data = this.employeeBankDetailsForm.value;
      this._empS.updateEmployeeBankDetails(data).subscribe(
        (res) => {
          this.closeOffset(content)
          if (res.statusCode === 200) {
            const toasterObject = {
              isShown: true,
              isSuccess: true,
              toastHeading: "Successfully",
              toastParagrahp: "Your Profile change request has been sent for approval."
            };
            this._toastS.updateToastData(toasterObject);
            this.getProfile();
            this._toastS.hide();
          }
        },
        (error: any) => {
          const toasterObject = {
            isShown: true,
            isSuccess: false,
            toastHeading: "Failed",
            toastParagrahp: "Internal Server Error!"
          };
          this._toastS.updateToastData(toasterObject);
          this._toastS.hide();
        }
      );
    }
  }
  submitAddress(content) {
    if (this.currentId !== 0 && this.currentId !== undefined) {
      const data = this.employeeAddressForm.value;
      this._empS.updateEmployeeAddress(data).subscribe(
        (res) => {
          this.closeOffset(content)
          if (res.statusCode === 200) {
            const toasterObject = {
              isShown: true,
              isSuccess: true,
              toastHeading: "Successfully",
              toastParagrahp: "Your Profile change request has been sent for approval."
            };
            this._toastS.updateToastData(toasterObject);
            this.getProfile();
            this._toastS.hide();
          }
        },
        (error: any) => {
          const toasterObject = {
            isShown: true,
            isSuccess: false,
            toastHeading: "Failed",
            toastParagrahp: "Internal Server Error!"
          };
          this._toastS.updateToastData(toasterObject);
          this._toastS.hide();
        }
      );
    }
  }
  submitEducation() {

    if (this.currentId !== 0 && this.currentId !== undefined) {
      const data = this.employeeEducationForm.value;
      this._empS.updateEmployeeEducation(data).subscribe(
        (res) => {
          this.resetEducation()
          //this.closeOffset(content)
          if (res.statusCode === 200) {
            const toasterObject = {
              isShown: true,
              isSuccess: true,
              toastHeading: "Successfully",
              toastParagrahp: "Your Profile change request has been sent for approval."
            };
            this._toastS.updateToastData(toasterObject);
            this.getProfile();
            this._toastS.hide();
          }
        },
        (error: any) => {
          const toasterObject = {
            isShown: true,
            isSuccess: false,
            toastHeading: "Failed",
            toastParagrahp: "Internal Server Error!"
          };
          this._toastS.updateToastData(toasterObject);
          this._toastS.hide();
        }
      );
    }
  }
  submitExperience() {
    if (this.currentId !== 0 && this.currentId !== undefined) {
      const data = this.employeeworkExperienceForm.value;
      this._empS.updateEmployeeWorkExperience(data).subscribe(
        (res) => {
          //this.closeOffset(content)
          if (res.statusCode === 200) {
            const toasterObject = {
              isShown: true,
              isSuccess: true,
              toastHeading: "Successfully",
              toastParagrahp: "Your Profile change request has been sent for approval."
            };
            this._toastS.updateToastData(toasterObject);
            this.getProfile();
            this._toastS.hide();
          }
        },
        (error: any) => {
          const toasterObject = {
            isShown: true,
            isSuccess: false,
            toastHeading: "Failed",
            toastParagrahp: "Internal Server Error!"
          };
          this._toastS.updateToastData(toasterObject);
          this._toastS.hide();
        }
      );
    }
  }
  submitDependent() {

    if (this.currentId !== 0 && this.currentId !== undefined) {
      const data = this.dependentForm.value;
      this._depS.updateDependant(data).subscribe(
        (res) => {
          this.resetDependent();
          //this.closeOffset(content)
          if (res.statusCode === 200) {
            const toasterObject = {
              isShown: true,
              isSuccess: true,
              toastHeading: "Successfully",
              toastParagrahp: "Your Profile change request has been sent for approval."
            };
            this._toastS.updateToastData(toasterObject);
            this.getProfile();
            this._toastS.hide();
          }
        },
        (error: any) => {
          const toasterObject = {
            isShown: true,
            isSuccess: false,
            toastHeading: "Failed",
            toastParagrahp: "Internal Server Error!"
          };
          this._toastS.updateToastData(toasterObject);
          this._toastS.hide();
        }
      );
    }
  }

  deleteEducation() {
    this._empS.deleteEducation(this.updatedId).subscribe((res) => {
      if (res.statusCode === 200) {
        const education = this.employeeDetails?.employeeEducationList.find(d => d.employeeEducationId === this.updatedId)
        this.getProfile();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: `You have successfully removed from the education` }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
      }
    }, (error: any) => {

      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })
  }

  deleteWorkExperience() {
    this._empS.deleteWorkExperience(this.updatedId).subscribe((res) => {
      if (res.statusCode === 200) {
        const experience = this.employeeDetails?.employeeWorkExperienceList.find(d => d.workExperienceId === this.updatedId)
        this.getProfile();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: `You have successfully removed  from the work experience` }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();

      }
    }, (error: any) => {

      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })
  }
  deleteDependent() {

    this._depS.deleteDependant(this.updatedId).subscribe((res) => {
      if (res.statusCode === 200) {
        const depName = this.dependents.find(d => d.dependentId === this.updatedId)

        //const dependents = this.dependents.filter((item: any) => item.dependentId !== this.updatedId);
        //this.dependents = dependents;
        this.getDependantDetailsByEmployeeId();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: `You have successfully removed ${depName.name} from the dependents` }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();

      }
    }, (error: any) => {

      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })
  }




  deleteEmployeeDoc(id: any) {

    this._empS.deleteEmployeeDocument(id).subscribe((res) => {
      if (res.statusCode === 200) {
        this.getEmployeeDocs();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Employee Document Deleted Successfully!" }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
      }
    }, (error: any) => {
      console.error("Internal Server Error", error);
      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })

  }

  get pF() {
    return this.employeeDocumentForm.controls
  }
  showDocs() {
    this.isDocuments = true;
  }
  hideDocs() {
    this.isDocuments = false;
  }
  onFileSelected(event: Event) {

    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      this.selectedFiles = [];
      for (let i = 0; i < fileInput.files.length; i++) {
        this.selectedFiles.push(fileInput.files[i]);
      }
    }
  }
  onProfileFileSelected(event: Event) {

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedProfileImage = inputElement.files[0];
    }

    this.submitProfilePicture()
  }


  //selectedProfileImage
  removeFile(index) {
    this.selectedFiles.splice(index, 1);
    // if (this.formFileInput) {
    //   console.log("Removed file",this.selectedFiles.length)
    //
    //   this.formFileInput.nativeElement.value = `${this.selectedFiles.length} files}`;
    // }
  }

  submitDocumentForm() {

    const formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('Files', this.selectedFiles[i]);
    }
    console.log()
    formData.append('UserId', String(this.UserId));
    this._empS.createEmployeeDocuments(formData).subscribe((res) => {
      console.log(res)
      if (res.statusCode === 200) {
        this.selectedFiles = [];
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Added", toastParagrahp: "Document Added Successfully!" }
        this._toastS.updateToastData(toasterObject)
        this.getEmployeeDocs();
        this._toastS.hide();
      }
    }, (error: any) => {
      console.error("Internal Server Error", error);
      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })


  }

  getIconClass(url: string): string {
    const extension = this.getFileExtension(url);
    switch (extension) {
      case 'pdf':
        return 'fal fa-file-pdf';
      case 'doc':
      case 'docx':
        return 'fal fa-file-alt';
      case 'rar':
      case 'zip':
        return 'fal fa-file-archive';
      case 'png':
      case 'jpg':
      case 'jpeg':
        return 'fal fa-image';
      default:
        return 'fal fa-file';
    }
  }


  getFileExtension(url: string): string {
    return url.split('.').pop();
  }
}

