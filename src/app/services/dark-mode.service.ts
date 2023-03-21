import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Dark_ModeService {

  constructor() { }

  dMode:any = localStorage.getItem("dark-mode");
  dModeObj:any = JSON.parse(this.dMode) ;
  darkMode:any = this.dModeObj.darkMode

  private myVariable = new Subject<boolean>();

  getMyVariable(): Observable<boolean> {
    return this.myVariable.asObservable();
  }
  
  updateMyVariable(value: boolean) {
    this.myVariable.next(value);
  }

}
