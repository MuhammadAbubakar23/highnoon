import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpenseTypeService } from '../../services/expense-type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-create-expense-type',
  templateUrl: './create-expense-type.component.html',
  styleUrls: ['./create-expense-type.component.css']
})
export class CreateExpenseTypeComponent {
  currentId: any = 0;
  expenseTypeForm = new FormGroup({
    name: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    id: new FormControl(null),
  });


  constructor(private _epS: ExpenseTypeService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService,private _hS:HeaderService) {
    this.changeHeader('create');


  }
  ngOnInit(): void {
this.getExpenseTypeDetails();

  }
  changeHeader(title:string){
    if(title ==='create'){
      this._hS.updateHeaderData({
        title: 'ExpenseTypes',
        tabs: [{ title: 'Create', url: 'connect/console/create-expense-type', isActive: true }],
        isTab: false,
      })
    }
    else{
      this._hS.updateHeaderData({
        title: 'ExpenseTypes',
        tabs: [{ title: 'Update', url: 'connect/console/update-expense-type', isActive: true }],
        isTab: false,
      })
    }
  }
  getExpenseTypeDetails() {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update')
        this._epS.getExpenseTypeById(this.currentId).subscribe((res) => {
          this.expenseTypeForm.patchValue({
            name: res.data.expenseTypeName,
            // isActive:res.data.isActive
          })
        })
      }
    })
  }
  get lF() {
    return this.expenseTypeForm.controls
  }
  submitForm() {
    

    if (this.currentId !== 0 && this.currentId !== undefined) {
      console.log(this.expenseTypeForm)
      const data = {
        id: this.currentId,
        name: this.expenseTypeForm.get('name').value,
        // isActive: this.ExpenseTypeForm.get('isActive').value
      }
      this._epS.updateExpenseType(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Updated", toastParagrahp: "Expense Type Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/expense-types']);
          this._toastS.hide();
        }

      }, (error: any) => {
        console.error("Internal Server Error", error);
        const toasterObject = { isShown: true,isSuccess:false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
      })

    }
    else {

      const data = {
        id: 0,
        name: this.expenseTypeForm.get('name').value,
        //isActive: this.ExpenseTypeForm.get('isActive').value
      }
      this._epS.createExpenseType(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Added", toastParagrahp: "Expense Type Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/expense-types']);
          this._toastS.hide();
        }
      }, (error: any) => {
        console.error("Internal Server Error", error);
        const toasterObject = { isShown: true,isSuccess:false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
      })

    }
  }
}
