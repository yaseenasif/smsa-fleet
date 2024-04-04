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

  searchVehiclesWithDynamicValues(vehicleInterFace: Vehicle, stringifyPoNumbers?: string,
    value?: number | null, query?: { page: number, size: number }): Observable<PaginatedResponse<Vehicle>> {
    const params = new HttpParams().set('stringifyPoNumbers', stringifyPoNumbers ? stringifyPoNumbers : '');
    if (value) {
      query = { page: 0, size: 10 };
    }
    return this.http.post<PaginatedResponse<Vehicle>>(`${this.url}/dynamic-search`, vehicleInterFace, { params });
  }


}
