import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VehicleAssignment } from 'src/app/modal/vehicle-assignment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleAssignmentService {

  constructor(private http:HttpClient) { }

  url = environment.baseurl;

  addVehicleAssignment(vehicleAssignment: VehicleAssignment): Observable<VehicleAssignment> {
    return this.http.post<VehicleAssignment>(this.url.concat('/add-vehicle-assignment'), vehicleAssignment);
}

  getAllVehicleAssignment(): Observable<VehicleAssignment[]> {
  return this.http.get<VehicleAssignment[]>(this.url.concat('/vehicle-assignment'));
  }

  getVehicleAssignmentById(id: Number) {
  return this.http.get<VehicleAssignment>(`${this.url}/vehicle-assignment/${id}`);
  }

updateVehicleAssignment(id: Number, updateVehicleAssignment: VehicleAssignment): Observable<VehicleAssignment> {
  debugger
  return this.http.patch<VehicleAssignment>(`${this.url}/vehicle-assignment/${id}`, updateVehicleAssignment);
}

deleteVehicleAssignment(id: Number) {
  return this.http.delete<any>(`${this.url}/vehicle-assignment/${id}`)
}

getAllVehicleAssignmentByPlateNumber(plateNumber: String): Observable<VehicleAssignment> {
  return this.http.get<VehicleAssignment>(`${this.url}/vehicle-assignment-plateNumber/${plateNumber}`);
}
}