import { Component, Input, OnInit } from '@angular/core';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent implements OnInit {
 isShown: boolean;
 toastHeading=""
 toastParagrahp=""
 isSuccess:boolean

 constructor(private toastService: ToasterService){

 }
 ngOnInit(): void {
  this.toastService.toastData.subscribe((res)=>{
   this.isShown=res.isShown;
   this.toastHeading=res.toastHeading;
   this.toastParagrahp=res.toastParagrahp;
   this.isSuccess=res.isSuccess;
  })
  this.startTimer();
 }
 ngOnChanges(): void {
  if (this.isShown) {
    this.startTimer();
  }
}
private startTimer(): void {
  setTimeout(() => {
    this.isShown = false;
  }, 3000);
}
hideSuccessToast(){
  this.isShown=false;
}
}






