import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectVehicle, ProjectVehicleValues } from 'src/app/modal/project-vehicle';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrjectVehicleService {
  constructor(private http: HttpClient) { }
  url = environment.baseurl;

  addProjectVehicle(projectVehicle: ProjectVehicle): Observable<ProjectVehicle> {
    return this.http.post<ProjectVehicle>(`${this.url}/add-project-vehicle`, projectVehicle);
  }

  getAllProjectVehicle(): Observable<ProjectVehicle[]> {
    return this.http.get<ProjectVehicle[]>(this.url.concat('/get-all-project-vehicle'));
  }
  deleteGradeByProjectVehicle(id: Number) {
    return this.http.delete<ProjectVehicle>(`${this.url}/delete-project-vehicle/${id}`)
  }
  updateProjectVehicle(id: number, updateProjectVehicle: ProjectVehicle): Observable<ProjectVehicle> {
    const updateUrl = `${this.url}/update-project-vehicle/${id}`;
    return this.http.patch<ProjectVehicle>(updateUrl, updateProjectVehicle);
  }
  getProjectVehicleById(id: Number) {
    return this.http.get<ProjectVehicle>(`${this.url}/project-vehicle/${id}`);
  }

  getAllProjectVehicleValuesBySearchSpecification(projectVehicleId: number, projectVehicleValues: ProjectVehicleValues): Observable<ProjectVehicleValues[]> {
    return this.http.post<ProjectVehicleValues[]>(`${this.url}/get-all-by-searchSpecification-with/${projectVehicleId}`, projectVehicleValues);
  }

}

// getAllProjectVehicleValuesByLeaseDates(projectVehicleId: number,startLease: Date, expiryLease: Date): Observable<ProjectVehicleValues[]> {
//   const startLeaseMilliseconds = startLease.getTime();
//   const expiryLeaseMilliseconds = expiryLease.getTime();

//   let params = new HttpParams();
//   params = params.set('startLease', startLeaseMilliseconds.toString());
//   params = params.set('expiryLease', expiryLeaseMilliseconds.toString());

//   return this.http.get<ProjectVehicleValues[]>(`${this.url}/get-all-project-vehicle-by-leaseDates-with/${projectVehicleId}`, { params: params });
// }
