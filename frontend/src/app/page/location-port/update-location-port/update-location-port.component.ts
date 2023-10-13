import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-update-location-port',
  templateUrl: './update-location-port.component.html',
  styleUrls: ['./update-location-port.component.scss']
})
export class UpdateLocationPortComponent implements OnInit {

  items: MenuItem[] | undefined;

  constructor() { }
  portName!:string;
  location!:Location[];
  selectedLocation!:Location;

  ngOnInit(): void {
    this.items = [{ label: 'Location Port List',routerLink:'/location-port'},{ label: 'Edit Location Port'}];

    
  this.location=[
    {
      locationName:"karachi",
      id:1
    },
    {
      locationName:"kaAAi",
      id:2
    },
    {
      locationName:"Alld",
      id:3
    },
    {
      locationName:"islamabad",
      id:4
    },
    {
      locationName:"lahore",
      id:5
    },
  ]
  }

}



interface Location{
  locationName:string,
  id:number
}

