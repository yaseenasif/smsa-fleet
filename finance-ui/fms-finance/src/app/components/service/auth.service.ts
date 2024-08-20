import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { Router, RouterStateSnapshot } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface PermissionRoute {
  permission: string;
  route: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private permissionRoutes: PermissionRoute[] = [
    { permission: 'Dashboard', route: ['/finance-dashboard', "/"] },
    { permission: 'ViewVehicles', route: ['/view-vehicle'] },
    { permission: 'InvoiceUpload', route: ['/invoice-upload'] },
    { permission: 'InvoiceDetails', route: ['/invoice-details','/invoice-details/:id/:supplierName'] },
    { permission: 'InvoiceSupplier', route: ['/invoice-supplier/:id'] },

  ]

  constructor( private router: Router) { }


  isAuthenticated(state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('accessToken');

    if (!this.tokenExists(token)) {
      this.router.navigate(['/login']);
      return false;
    }

    const decodedToken = this.getDecodedAccessToken(token!);
    const userPermissions = decodedToken?.PERMISSIONS ?? [];

    const permissionName = this.getPermissionByUrl(state.url);

    if (userPermissions.includes(permissionName!)) {
      return true;
    } else if (state.url === '/international-tile' && (this.hasPermission('International Shipment By Road') || this.hasPermission('International Shipment By Air'))) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }

  private getPermissionByUrl(url: string): string | null {
    const matchingRoute = this.permissionRoutes.find((permissionRoute) =>
      permissionRoute.route.some((route) => this.isRouteMatch(url, route))
    );

    return matchingRoute?.permission ?? null;
  }

  private isRouteMatch(url: string, route: string): boolean {
    const regex = new RegExp('^' + route.replace(/:[^\/]+/g, '[^\/]+') + '$');
    return regex.test(url);
  }

  private tokenExists(token: string | null): boolean {
    return !!token;
  }

  getDecodedAccessToken(token: string): { PERMISSIONS: string[], ROLES: string[], sub: string } | null {
    try {
      return jwtDecode(token) as { PERMISSIONS: string[], ROLES: string[], sub: string };
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  hasPermission(requiredPermission: string): boolean {
    const token = localStorage.getItem('accessToken');
    const decodedToken = this.getDecodedAccessToken(token!);
    const userPermissions: string[] = decodedToken?.PERMISSIONS ?? [];
    return userPermissions.includes(requiredPermission);
  }

}
