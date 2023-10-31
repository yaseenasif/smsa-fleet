import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { VehicleService } from '../service/vehicle.service';
import { Vehicle } from 'src/app/modal/vehicle';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent implements OnInit{
  
  constructor(
    private vehicleService: VehicleService
    ) { }
  
  vehicles!: Vehicle[];

  products:any=[{name:"Demo"},
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

 

  ngOnInit() {
      this.items = [{ label: 'Vehicle'}];

      this.getAllVehicles();

  }


  getAllVehicles() {

    this.vehicleService.getAllVehicles().subscribe((res: Vehicle[]) => {
      
      this.vehicles = res;      
      
    })

  }

  deleteVehicle(id: Number) {

    this.vehicleService.deleteVehicle(id).subscribe((res) => {
      this.getAllVehicles();
      
    })
  }

}