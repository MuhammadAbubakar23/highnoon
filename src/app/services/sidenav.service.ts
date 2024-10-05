import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  private siblingMsg2 = new BehaviorSubject<string>('');
  constructor() { }



  getMessage = this.siblingMsg2 .asObservable();

  public updateMessage(menuName: string): void {
    
    this.siblingMsg2.next(menuName);
  }
}





