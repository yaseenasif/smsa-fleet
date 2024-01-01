import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Token } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private router:Router) { }
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
// export const httpInterceptorProviders = [
//   { provide: HTTP_INTERCEPTORS,
//      useClass: TokenInterceptor, 
//      multi: true },
// ];