import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobTitle } from 'src/app/modal/job-title';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobTitleService {

  url = environment.baseurl;

  constructor( private http: HttpClient) { }

  getJobTitle(): Observable<JobTitle[]> {
    return this.http.get<JobTitle[]>(`${this.url}/get-all-job-title`)
  }

  getJobTitleById( id: Number ) {
    return this.http.get<JobTitle>(`${this.url}/job-title/${id}`)
  }

  addJobTitle( jobTitle: JobTitle ): Observable<JobTitle> {
    return this.http.post<JobTitle>(`${this.url}/add-job-title`, jobTitle);
  }

  updateJobTitle( id: Number, jobTitle: JobTitle ): Observable<JobTitle> {
    return this.http.put<JobTitle>(`${this.url}/update-job-title/${id}`, jobTitle);
  }

  deleteJobTitle( id: Number ) {
    return this.http.delete<any>(`${this.url}/delete-job-title/${id}`)
  }

}
