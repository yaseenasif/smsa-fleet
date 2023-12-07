import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Vehicle } from 'src/app/modal/vehicle';
import { VehicleService } from '../service/vehicle.service';


@Component({
  selector: 'app-view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.scss']
})
export class ViewVehicleComponent {

  items: MenuItem[] | undefined;
  vehicle!: Vehicle;
  vehicleId: Number | undefined;

  constructor(private vehicleService: VehicleService,private route: ActivatedRoute) { }

  ngOnInit(){
    this.items = [{ label: 'Vehicle',routerLink:'/vehicle'},{ label: 'View Vehicle'}];
    this.vehicleId = +this.route.snapshot.paramMap.get('id')!;
    this.getVehicleById(this.vehicleId);
  }

  getVehicleById(id: Number) {
    this.vehicleService.getVehicleById(id).subscribe((res: Vehicle) => {
      this.vehicle = res;
    })
  }
}
