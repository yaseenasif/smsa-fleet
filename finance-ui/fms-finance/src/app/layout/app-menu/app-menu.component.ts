import { Component, Input, OnInit } from '@angular/core';
import { LayoutService } from '../service/layout.service';

@Component({
  selector: 'app-app-menu',
  templateUrl: './app-menu.component.html',
  styleUrl: './app-menu.component.scss'
})
export class AppMenuComponent implements OnInit{


  model: any[] = [];
  isSidebarCollapsed: boolean = true;

  constructor( private layoutService: LayoutService) {
    this.layoutService.staticMenuDesktopInactive$.subscribe(( inactive: boolean) => {
      this.isSidebarCollapsed = inactive;
    })
  }

  ngOnInit(): void {

    this.model = [

          {
            label: "Dashboard",
            icon: "pi pi-fw pi-home",
            routerLink: ["/"],
          },
          {
            label: "Vehicles",
            icon: "pi pi-fw pi-car",
            routerLink: ["/vehicle-list"],
          },
          {
            label: "Invoice",
            icon: "pi pi-fw pi-file-arrow-up",
            routerLink: ["/invoice-upload"],
          },
          {
            label: "Report Section",
            icon: "pi pi-fw pi-file-arrow-up",
            routerLink: ["/report-section"],
          }
    ]
  }

}
