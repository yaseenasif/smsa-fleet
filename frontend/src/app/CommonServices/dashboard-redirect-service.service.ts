import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardRedirectServiceService {

  private stringValueSubject = new BehaviorSubject<string>('');
  
  constructor() { }


  setDashboardValue(value: string) {
    this.stringValueSubject.next(value);
  }

  getDashboardValue() {
    return this.stringValueSubject.asObservable();
  }

}
