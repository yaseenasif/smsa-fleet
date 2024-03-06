import { HttpClient } from '@angular/common/http';
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

  searchVehiclesByRegion(value?: String | null, query?: { page: number, size: number } ): Observable<PaginatedResponse<Vehicle>> {
    if (value) {
      query = { page: 0, size: 10 };
    }
    return this.http.get<PaginatedResponse<Vehicle>>(`${this.url}/search-vehicles-by-region?value=${JSON.stringify(value ? value : '')} &page=${query?.page ? query.page : ''}&size=${query?.size ? query.size : ''}`);

  }

  searchVehiclesByVendor(value?: String | null, query?: { page: number, size: number } ): Observable<PaginatedResponse<Vehicle>> {
    if (value) {
      query = { page: 0, size: 10 };
    }
    return this.http.get<PaginatedResponse<Vehicle>>(`${this.url}/search-vehicles-by-vendor?value=${JSON.stringify(value ? value : '')} &page=${query?.page ? query.page : ''}&size=${query?.size ? query.size : ''}`);

  }

  searchVehiclesByUsageType(value?: String | null, query?: { page: number, size: number } ): Observable<PaginatedResponse<Vehicle>> {
    if (value) {
      query = { page: 0, size: 10 };
    }
    return this.http.get<PaginatedResponse<Vehicle>>(`${this.url}/search-vehicles-by-usage-type?value=${JSON.stringify(value ? value : '')} &page=${query?.page ? query.page : ''}&size=${query?.size ? query.size : ''}`);

  }

  searchVehiclesByLeaseExpiry(leaseStartDate: Date, leaseExpiryDate: Date, query?: { page: number, size: number } ): Observable<PaginatedResponse<Vehicle>> {
      query = { page: 0, size: 10 };
    return this.http.get<PaginatedResponse<Vehicle>>(`${this.url}/search-vehicles-by-lease-expiry?leaseStartDate=${leaseStartDate}&leaseExpiryDate=${leaseExpiryDate} &page=${query?.page ? query.page : ''}&size=${query?.size ? query.size : ''}`);

  }
}
