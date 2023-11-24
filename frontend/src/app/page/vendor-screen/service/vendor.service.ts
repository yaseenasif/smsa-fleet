import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Vendor } from 'src/app/modal/vendor';
@Injectable({
  providedIn: 'root'
})
export class VendorService {

  url = environment.baseurl;

  constructor(private http: HttpClient) { }
  addVendor(vendor: Vendor): Observable<Vendor> {
    return this.http.post<Vendor>(`${this.url}/add-vendor`, vendor);
  }  
  
  getVendor(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.url}/get-active-vendors`);
  }
  updateVendor(id: Number, updateVendor: Vendor): Observable<Vendor> {
    const updateUrl = `${this.url}/update-vendor/${id}`;
    return this.http.patch<Vendor>(updateUrl, updateVendor);
  }
  getVendorbyId(id : Number){
    return this.http.get<Vendor>(`${this.url}/vendor/${id}`);

  }
  deleteVendorById(id: Number) {
    return this.http.delete<any>(`${this.url}/delete-vendor/${id}`)
  }
}
