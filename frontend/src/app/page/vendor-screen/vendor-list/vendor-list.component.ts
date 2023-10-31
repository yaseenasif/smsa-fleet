import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit{

  constructor() {

  }

  employee:any=[{name:"Demo"},
  {name:"Demo"},
  {name:"Demo"},
  {name:"Demo"},
  {name:"Demo"},
  {name:"Demo"},
  {name:"Demo"},
  {name:"Demo"},
  {name:"Demo"},
  {name:"Demo"},];
  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [{
      label: 'Vendor'
    }]
  }

}
