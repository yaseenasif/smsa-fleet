import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Region } from 'src/app/modal/Region';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  url = environment.baseurl;

  constructor(private http: HttpClient) { }

  addRegion(region: Region): Observable<Region> {
    return this.http.post<Region>(`${this.url}/add-region`, region);
  }

  getRegion(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.url}/get-active-region`);
  }

  getRegionByCountry(country: string): Observable<Region[]> {
    const params = new HttpParams().set('country', country);
    return this.http.get<Region[]>(`${this.url}/get-region-by-country`, { params });
  }

  getCitiesByRegion(region: string): Observable<Region> {
    const params = new HttpParams().set('name', region);
    return this.http.get<Region>(`${this.url}/get-cities-by-region`, { params });
  }


  updateRegion(id: number, updateRegion: Region): Observable<Region> {

    const updateUrl = `${this.url}/update-region/${id}`;
    return this.http.patch<Region>(updateUrl, updateRegion);
  }
  getRegionbyId(id: number): Observable<Region> {
    return this.http.get<Region>(`${this.url}/get-region/${id}`);

  }
  deleteRegionById(id: number): Observable<Region> {
    return this.http.delete<Region>(`${this.url}/delete-region/${id}`)
  }
}

