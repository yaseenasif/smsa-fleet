import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from 'src/app/modal/vehicle';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  url = environment.baseurl;

  constructor(private http: HttpClient) {   }


  addVehicle(vehicle: Vehicle): Observable<Vehicle> {
      return this.http.post<Vehicle>(this.url.concat('/add-vehicle'), vehicle);
  }

  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.url.concat('/get-all-vehicle'));
  }

  getVehicleById(id: Number) {
    return this.http.get<Vehicle>(`${this.url}/vehicle/${id}`);
  }

  updateVehicle(id: Number, updatedVehicle: Vehicle): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.url}/update-vehicle/${id}`, updatedVehicle);
  }

  deleteVehicle(id: Number) {
    return this.http.delete<any>(`${this.url}/delete-vehicle/${id}`)
  }

}
