import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url = environment.baseurl;
  
  constructor(private http: HttpClient) { }

  getDashboardCounts(): Observable<any> {
    return this.http.get(`${this.url}/counts`);
  }

}
