import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExcelImportService {
  url = environment.baseurl;

  constructor(private http: HttpClient) {   }


  uploadExcel(file: File) {
    const formData: FormData = new FormData();
    formData.append('excelFile', file);

    return this.http.post(this.url.concat('/add-vehicle'), formData);
  }
}
