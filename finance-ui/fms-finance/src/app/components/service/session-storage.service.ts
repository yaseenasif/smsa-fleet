import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  userPermissions: string[] = [];
  roleName: String | undefined;

  constructor() { }
}
