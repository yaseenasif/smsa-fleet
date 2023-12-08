import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileMetaData } from 'src/app/modal/file-meta-data';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndividualFileListService {
  constructor(private http: HttpClient) { }
  baseurl = environment.baseurl;
   getIndividualFileList(url:string):Observable<FileMetaData[]>{
   return this.http.get<FileMetaData[]>(this.baseurl.concat(url));
   }

   downloadAttachments(fileName:string):Observable<Blob>{
    return this.http.get(`${this.baseurl}/download/${fileName}`,{
      responseType: 'blob'
    });
    }
    deleteAttachmentById(id:number):Observable<any>{
      return this.http.delete(`${this.baseurl}/delete-attachment/${id}`)
    }

  
}
