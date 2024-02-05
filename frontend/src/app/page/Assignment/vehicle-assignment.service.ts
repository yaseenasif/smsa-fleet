import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from 'src/app/modal/paginatedResponse';
import { VehicleAssignment } from 'src/app/modal/vehicle-assignment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleAssignmentService {

  constructor(private http: HttpClient) { }

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

    return this.http.patch<VehicleAssignment>(`${this.url}/vehicle-assignment/${id}`, updateVehicleAssignment);
  }

  deleteVehicleAssignment(id: Number) {
    return this.http.delete<any>(`${this.url}/vehicle-assignment/${id}`)
  }

  getAllVehicleAssignmentByPlateNumber(plateNumber: String): Observable<VehicleAssignment> {
    return this.http.get<VehicleAssignment>(`${this.url}/vehicle-assignment-plateNumber/${plateNumber}`);
  }

  searchAssignmentByPlateNumber(value?: string | null, query?: { page: number, size: number }): Observable<PaginatedResponse<VehicleAssignment>> {
    if (value) {
      query = { page: 0, size: 10 };
    }
    return this.http.get<PaginatedResponse<VehicleAssignment>>(`${this.url}/search-assignment?value=${JSON.stringify(value ? value : '')}&page=${query?.page ? query.page : ''}&size=${query?.size ? query.size : ''}`);
  }

  searchAssignmentByRegion(value?: string | null,vehicleStatus?: string | null, query?: { page: number, size: number }): Observable<PaginatedResponse<VehicleAssignment>> {
    if (!query) {
      query = { page: 0, size: 10 };
    }
    return this.http.get<PaginatedResponse<VehicleAssignment>>(
      `${this.url}/search-assignment-by-region`,
      {
        params: {
          value: value ? JSON.stringify(value) : '',
          vehicleStatus: vehicleStatus || '',
          page: query?.page?.toString() || '0',
          size: query?.size?.toString() || '10',
        },
      }
    );
  }
  searchAssignmentByDepartment(value?: string | null, vehicleStatus?: string | null, query?: { page: number, size: number }): Observable<PaginatedResponse<VehicleAssignment>> {
    return this.http.get<PaginatedResponse<VehicleAssignment>>(
      `${this.url}/search-assignment-by-department`,
      {
        params: {
          value: value ? JSON.stringify(value) : '',
          vehicleStatus: vehicleStatus || '',
          page: query?.page?.toString() || '0',
          size: query?.size?.toString() || '10',
        },
      }
    );
  }
  searchAssignmentBySection(value?: string | null,vehicleStatus?: string | null,  query?: { page: number, size: number }): Observable<PaginatedResponse<VehicleAssignment>> {
    if (!query) {
      query = { page: 0, size: 10 };
    }
    return this.http.get<PaginatedResponse<VehicleAssignment>>(
      `${this.url}/search-assignment-by-section`,
      {
        params: {
          value: value ? JSON.stringify(value) : '',
          vehicleStatus: vehicleStatus || '',
          page: query?.page?.toString() || '0',
          size: query?.size?.toString() || '10',
        },
      }
    );
  }
  searchAssignmentByEmployeeNumber(value?: string | null, query?: { page: number, size: number }): Observable<PaginatedResponse<VehicleAssignment>> {
    if (value) {
      query = { page: 0, size: 10 };
    }
    return this.http.get<PaginatedResponse<VehicleAssignment>>(`${this.url}/search-assignment-empno?value=${JSON.stringify(value ? value : '')}&page=${query?.page ? query.page : ''}&size=${query?.size ? query.size : ''}`);
  }

  getAssignmentByVehicleId(vehicleId: Number): Observable<VehicleAssignment> {
    return this.http.get<VehicleAssignment>(`${this.url}/get-by-vehicleId/${vehicleId}`);
  }

  // searchAssignmentByAnyValue(value?: string | null,vehicleStatus?: string | null,  query?: { page: number, size: number }): Observable<PaginatedResponse<VehicleAssignment>> {
  //   return this.http.get<PaginatedResponse<VehicleAssignment>>(
  //     `${this.url}/search-assignment-by-any`,
  //     {
  //       params: {
  //         value: value ? JSON.stringify(value) : '',
  //         vehicleStatus: vehicleStatus!,
  //         page: query?.page?.toString() || '0',
  //         size: query?.size?.toString() || '10',
  //       },
  //     }
  //   );
  // }

  searchAssignmentByAnyValue(pageInfo?: { page: number, size: number }, search?: any): Observable<PaginatedResponse<VehicleAssignment>> {
    let params = new HttpParams();

    if (pageInfo?.hasOwnProperty('page')) {
      params = params.set('pageNumber', pageInfo.page);
      params = params.set('pageSize', pageInfo.size);
    }
    return this.http.post<PaginatedResponse<VehicleAssignment>>(`${this.url}/search-assignment-by-any`, search ? search : {}, { params });
  }
}
