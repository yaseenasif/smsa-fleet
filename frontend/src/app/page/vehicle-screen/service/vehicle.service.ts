import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Region } from 'src/app/modal/Region';
import { PaginatedResponse } from 'src/app/modal/paginatedResponse';
import { Vehicle } from 'src/app/modal/vehicle';
import { VehicleHistory } from 'src/app/modal/vehicle-history';
import { VehicleReplacement } from 'src/app/modal/vehicleReplacement';
import { Vendor } from 'src/app/modal/vendor';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  url = environment.baseurl;

  constructor(private http: HttpClient) { }


  addVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.url.concat('/add-vehicle'), vehicle);
  }

  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.url}/get-all-vehicle`);

  }
  availableForReplacement(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.url.concat('/vehicle-available-for-replacement'));
  }

  searchVehicle(value?: string | null, query?: { page: number, size: number }): Observable<PaginatedResponse<Vehicle>> {
    if (value) {
      query = { page: 0, size: 10 };
    }
    return this.http.get<PaginatedResponse<Vehicle>>(`${this.url}/search-vehicle?value=${JSON.stringify(value ? value : '')}&page=${query?.page ? query.page : ''}&size=${query?.size ? query.size : ''}`);
  }

  searchUnAssignedVehicles(value?: string | null, query?: { page: number, size: number }): Observable<PaginatedResponse<Vehicle>> {
    if (value) {
      query = { page: 0, size: 10 };
    }
    return this.http.get<PaginatedResponse<Vehicle>>(`${this.url}/search-unassigned-vehicle?value=${JSON.stringify(value ? value : '')}&page=${query?.page ? query.page : ''}&size=${query?.size ? query.size : ''}`);
  }



  getVehicleById(id: Number) {
    return this.http.get<Vehicle>(`${this.url}/vehicle/${id}`);
  }

  updateVehicle(id: Number, updatedVehicle: Vehicle): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.url}/update-vehicle/${id}`, updatedVehicle);
  }

  inactiveVehicleById(id: Number) {
    return this.http.delete<any>(`${this.url}/inactive-vehicle/${id}`)
  }

  saveFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.url}/add-bulk-vehicle`, formData);
  }

  getAllVendor(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.url}/get-active-vendors/`)
  }

  replaceVehicle(vehicleId: number, replaceWith: VehicleReplacement): Observable<VehicleReplacement> {
    return this.http.patch<VehicleReplacement>(`${this.url}/replace-vehicle/${vehicleId}`, replaceWith);
  }

  getVehicleHistoryById(id: Number): Observable<VehicleHistory[]> {
    return this.http.get<VehicleHistory[]>(`${this.url}/vehicle-history/${id}`)
  }

  searchInactiveVehicle(value?: string | null, query?: { page: number, size: number }): Observable<PaginatedResponse<Vehicle>> {
    if (value) {
      query = { page: 0, size: 10 };
    }
    return this.http.get<PaginatedResponse<Vehicle>>(`${this.url}/search-vehicle-inactive?value=${JSON.stringify(value ? value : '')}&page=${query?.page ? query.page : ''}&size=${query?.size ? query.size : ''}`);
  }

  generateVehicleHistoryPdf(id: Number): Observable<Blob> {
    return this.http.get(`${this.url}/vehicle-history-download/${id}`, {
      responseType: 'blob'
    });
  }

  activateVehicle(id: Number): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.url}/vehicle-active/${id}`, {})
  }
  getAllNotAssignedVehicles(): Observable<Vehicle[]> {
      return this.http.get<Vehicle[]>(this.url.concat('/not-assigned-vehicle'));
    }
  getVehicleBudget(vehicleBudget : Number):Observable<Vehicle[]>{
        return this.http.get<Vehicle[]>(`${this.url}/vehicles-under-driver-budget/${vehicleBudget}`);
      }

  downloadAttachments(fileName:string):Observable<Blob>{
        return this.http.get(`${this.url}/download/${fileName}`,{
          responseType: 'blob'
        });
        }

  searchAllVehicles(value?: string | null, vehicleStatus?: string | null, query?: { page: number, size: number }): Observable<PaginatedResponse<Vehicle>>{
    if (value) {
      query = { page: 0, size: 10 };
    }
    return this.http.get<PaginatedResponse<Vehicle>>(`${this.url}/search-all-vehicle?value=${JSON.stringify(value ? value : '')}&vehicleStatus=${vehicleStatus ? vehicleStatus : ''}&page=${query?.page ? query.page : ''}&size=${query?.size ? query.size : ''}`);
    }
    getRegion(): Observable<Region[]> {
      return this.http.get<Region[]>(`${this.url}/get-active-region`);
    }

}
