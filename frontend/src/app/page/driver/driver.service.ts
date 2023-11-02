import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Driver } from 'src/app/modal/driver';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(private http:HttpClient) { }

  url = environment.baseurl;

  addDriver(driver: Driver): Observable<Driver> {
    debugger
    return this.http.post<Driver>(this.url.concat('/driver'), driver);
}

  getAllDriver(): Observable<Driver[]> {
  return this.http.get<Driver[]>(this.url.concat('/driver'));
  }

  getDriverById(id: Number) {
  return this.http.get<Driver>(`${this.url}/driver/${id}`);
  }

updateDriver(id: Number, updatedDriver: Driver): Observable<Driver> {
  return this.http.patch<Driver>(`${this.url}/driver/${id}`, updatedDriver);
}

deleteDriver(id: Number) {
  return this.http.delete<any>(`${this.url}/delete/${id}`)
}
  
}
