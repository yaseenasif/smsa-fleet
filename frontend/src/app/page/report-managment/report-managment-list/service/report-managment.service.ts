import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from 'src/app/modal/paginatedResponse';
import { Vehicle } from 'src/app/modal/vehicle';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportManagmentService {

  url = environment.baseurl;

  constructor(
    private http: HttpClient
  ) { }

  searchVehiclesWithDynamicValues(vehicleInterFace: Vehicle, stringifyPoNumbers?: string): Observable<Vehicle[]> {
    const params = new HttpParams().set('stringifyPoNumbers', stringifyPoNumbers ? stringifyPoNumbers : '');
    return this.http.post<Vehicle[]>(`${this.url}/dynamic-search`, vehicleInterFace, { params });
  }


}
