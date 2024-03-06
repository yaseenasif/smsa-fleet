import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthguardService } from 'src/app/auth-service/authguard/authguard.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    private authguardService: AuthguardService,
    private router: Router
  ) { }

  configTurner: boolean = false;

  ngOnInit(): void {
  }

  turner() {
    this.configTurner = !this.configTurner;
  }
  hasPermission(permission: string): boolean {
    return this.authguardService.hasPermission(permission)
  }
  goToVehicle() {
    if (sessionStorage.getItem("selectedStatus")) {
      sessionStorage.removeItem("selectedStatus");
    }
    this.router.navigate(['/vehicle']);
  }
}
