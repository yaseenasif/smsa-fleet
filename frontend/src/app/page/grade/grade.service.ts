import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Grade } from 'src/app/modal/grade';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  url = environment.baseurl;

  constructor(private http: HttpClient) { }

  addGrade(grade: Grade): Observable<Grade> {
    return this.http.post<Grade>(`${this.url}/addGrade`, grade);
  }

  getGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.url}/get-active-grades`);
  }
  
  updateGrade(id: Number, updateGrade: Grade): Observable<Grade> {
    const updateUrl = `${this.url}/update-grade/${id}`;
    return this.http.patch<Grade>(updateUrl, updateGrade);
  }
  getGradebyId(id : Number){
    return this.http.get<Grade>(`${this.url}/get-grade/${id}`);

  }
  deleteGradeById(id: Number) {
    return this.http.delete<any>(`${this.url}/delete-grade/${id}`)
  }
}
