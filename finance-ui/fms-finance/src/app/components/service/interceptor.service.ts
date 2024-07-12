import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { AuthGuardService } from './auth-guard.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

  constructor( private router: Router) { }

  private jwthelper : JwtHelperService = new JwtHelperService();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem("accessToken");
    if (!(this.isTokenExpired(token!))) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
    }
      );

      return next.handle(authReq);
    }else{
      this.router.navigate(["/login"])
    }

    return next.handle(req);
  }
  isTokenExpired( token : string):boolean{
    return this.jwthelper.isTokenExpired(token);
  }
}
