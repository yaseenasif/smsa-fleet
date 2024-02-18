import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface PermissionRoute {
  permission: string;
  route: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthguardService {
  private permissionRoutes: PermissionRoute[] = [
    { permission: 'Dashboard', route: ['/home', "/"] },
    { permission: 'Employee', route: ['/employee', '/add-employee', '/edit-employee/:id', '/employee-attachment/:id', 'view-employee/:id'] },
    { permission: 'Driver', route: ['/driver', '/add-driver', '/edit-driver/:id', '/driver-attachment/:id', '/view-driver/:id'] },
    {
      permission: 'Vehicle', route: ['/vehicle','/add-vehicle','/add-vehicle/:replacementCheck/:vId','/edit-vehicle/:id','/vehicle-history/:id','/vehicle-attachment/:id','/vehicle-detail/:id','/vehicle/:vehicletab','/view-vehicle/:id','/view-vehicle/assignmentCheck/:id','/unassigned-vehicle']},
    { permission: 'Assignment', route: ['/assignment', '/add-assignment', '/edit-assignment/:id', '/assignment-attachment/:id', '/view-assignment/:id', '/assignment-history/:id','/replacement-action/:id'] },
    { permission: 'User', route: ['/user', '/add-user', '/edit-user/:id'] },
    { permission: 'Vendor', route: ['/vendor', '/add-vendor', '/edit-vendor/:id', '/vendor-attachment/:id',] },
    { permission: 'Permission', route: ['/permission', '/add-permission', '/edit-permission/:id'] },
    { permission: 'Role', route: ['/role', '/add-role', '/edit-role/:id',] },
    { permission: 'ProjectVehicle', route: ['/project-vehicle', '/add-project-vehicle', '/edit-project-vehicle/:id', '/view-project-vehicle/:id','/show-vehicle/:id'] },
    { permission: 'Grade', route: ['/grade-list', '/add-grade', '/edit-grade/:id',] },
    { permission: 'City', route: ['/city-list', '/add-city', '/edit-city/:id',] },
    { permission: 'ProductField', route: ['/productFields', '/add-ProductField', '/add-ProductField/:id',] },
    { permission: 'Region', route: ['/get-all-regions', '/add-region', '/add-region/:id'] },
    { permission: 'Download Attachment', route: ['/individual-file-list-component/:call-type/:id'] }
  ];

  constructor(private router: Router) { }

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

  getDecodedAccessToken(token: string): { PERMISSIONS: string[] } | null {
    try {
      return jwtDecode(token) as { PERMISSIONS: string[] };
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
