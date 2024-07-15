import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../modal/vehicle';
import { VehicleHistory } from '../modal/vehicleHistory';

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
}
