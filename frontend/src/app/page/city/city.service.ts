import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from 'src/app/modal/City';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  url = environment.baseurl;

  constructor(private http: HttpClient) { }

  addCity(city: City): Observable<City> {
    return this.http.post<City>(`${this.url}/add-city`, city);
  }

  getCity(): Observable<City[]> {
    return this.http.get<City[]>(`${this.url}/get-active-city`);
  }

  updateCity(id: Number, updateCity: City): Observable<City> {
    const updateUrl = `${this.url}/update-city/${id}`;
    return this.http.patch<City>(updateUrl, updateCity);
  }
  getCitybyId(id: Number) {
    return this.http.get<City>(`${this.url}/get-city/${id}`);

  }
  deleteCityById(id: Number) {
    return this.http.delete<any>(`${this.url}/delete-city/${id}`)
  }
}
