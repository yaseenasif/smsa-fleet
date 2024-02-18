// import { Injectable } from '@angular/core';
// import { HttpClient} from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
// import { Driver } from 'src/app/modal/driver';
// import { PaginatedResponse } from 'src/app/modal/paginatedResponse';

// @Injectable({
//   providedIn: 'root'
// })
// export class DriverService {

//   constructor(private http:HttpClient) { }

//   url = environment.baseurl;

//   addDriver(driver: Driver): Observable<Driver> {
//     return this.http.post<Driver>(this.url.concat('/driver'), driver);
// }

//   getAllDriver(): Observable<Driver[]> {
//   return this.http.get<Driver[]>(this.url.concat('/driver'));
//   }

//   getDriverById(id: Number) {
//   return this.http.get<Driver>(`${this.url}/driver/${id}`);
//   }

// updateDriver(id: Number,plateNumber: String | null, updatedDriver: Driver): Observable<Driver> {
//   return this.http.patch<Driver>(`${this.url}/driver/${id}?plateNumber=${plateNumber ? plateNumber : ''}`, updatedDriver);
// }

// deleteDriver(id: Number) {
//   return this.http.delete<any>(`${this.url}/driver/${id}`)
// }

// searchDriver(value?: number | null, query?: { page: number, size: number }): Observable<PaginatedResponse<Driver>> {
//   if(value){
//     query = {page: 0 , size:10};
//   }
//   return this.http.get<PaginatedResponse<Driver>>(`${this.url}/search-driver?value=${value ? value : ''}&page=${query?.page ? query.page : ''}&size=${query?.size ? query.size : ''}`);
// }

// getUnasignedDrivers(): Observable<Driver[]> {
//   return this.http.get<Driver[]>(this.url.concat('/unassigned-drivers'));
//   }

//   searchInactiveDriver(value?: string | null, query?: { page: number, size: number }): Observable<PaginatedResponse<Driver>> {
//     
//     if (value) {
//       query = { page: 0, size: 10 };
//     }
//     value
//     return this.http.get<PaginatedResponse<Driver>>(`${this.url}/search-driver-inactive?value=${(value ? value : '')}&page=${query?.page ? query.page : ''}&size=${query?.size ? query.size : ''}`);
//   }
//   activateDriver(id: Number): Observable<Driver> {
//     return this.http.patch<Driver>(`${this.url}/driver-active/${id}`,{})
//   }
// }
