import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-menu',
  templateUrl: './app-menu.component.html',
  styleUrl: './app-menu.component.scss'
})
export class AppMenuComponent implements OnInit{

  model: any[] = [];


  ngOnInit(): void {

    this.model = [
      {
        label: "Dashboard",
        icon: "pi pi-fw pi-home",
        routerLink: ["/"],
      }
    ]
  }

}
