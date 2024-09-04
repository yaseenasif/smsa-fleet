import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../modal/vehicle';
import { VehicleHistory } from '../modal/vehicleHistory';
import { PaginatedResponse } from '../modal/paginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  _url = environment.URL;

  constructor( private http: HttpClient) { }

  searchVehicleByPlateNumber(plateNumber: string): Observable<Vehicle> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Vehicle>(`${this._url}/search-by-vehicle/${plateNumber}`, {headers})
  }

  getVehicleHistoryById(id: Number): Observable<VehicleHistory[]> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<VehicleHistory[]>(`${this._url}/vehicle-history/${id}`, {headers})
  }

  searchAllVehicles(value?: string | null, vehicleStatus?: string | null, query?: { page: number, size: number }): Observable<PaginatedResponse<Vehicle>> {
    if (value) {
      query = { page: 0, size: 10 };
    }
    return this.http.get<PaginatedResponse<Vehicle>>(`${this._url}/search-all-vehicle?value=${JSON.stringify(value ? value : '')}&vehicleStatus=${vehicleStatus ? vehicleStatus : ''}&page=${query?.page ? query.page : ''}&size=${query?.size ? query.size : ''}`);
  }
}
