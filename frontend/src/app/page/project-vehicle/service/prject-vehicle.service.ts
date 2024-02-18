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
}
