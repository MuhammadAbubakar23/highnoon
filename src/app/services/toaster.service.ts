import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private toasterData = new BehaviorSubject<any>({
    isShown: false,
    toastHeading: "",
    toastParagrahp: ""
  });

  toastData = this.toasterData.asObservable();
  updateToastData(data) {
    this.toasterData.next(data);
  }
  hide() {
    setTimeout(() => {
      const toasterObject = { isShown: false, toastHeading: "", toastParagrahp: "" }
      this.updateToastData(toasterObject)
    }, 3000);
  }
  constructor() { }
}

