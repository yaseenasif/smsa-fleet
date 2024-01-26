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
  items2: MenuItem[] = []; 
  vehicle!: Vehicle;
  vehicleId: Number | undefined;
  vehicles!: Array<Vehicle>;
  constructor(private vehicleService: VehicleService,private route: ActivatedRoute) { }

  ngOnInit(){
    this.items = [{ label: 'Vehicle',routerLink:'/vehicle'},{ label: 'View Vehicle'}];
    this.vehicleId = +this.route.snapshot.paramMap.get('id')!;
    this.getVehicleById(this.vehicleId);
    this.items2 = [
      {
        icon: 'bi bi-pen p-speeddial-action1',
        command: () => {
        },
        routerLink: ['/edit-vehicle', this.vehicleId],
        pTooltip: 'Edit',
        severity: 'success',
        style: { backgroundColor: 'blue', color: 'white' } // Set background color and text color
      },
      {
        icon: 'bi bi-paperclip',
        command: () => {
        },
        routerLink: ['/vehicle-attachment', this.vehicleId],
        pTooltip: 'Add Attachments',
        severity: 'warning'
      },
      {
        icon: 'bi bi-download',
        routerLink: [`/individual-file-list-component/:call-type/${this.vehicleId}`],
        pTooltip: 'View Attachments',
        severity: 'success'
      },
      {
        icon: 'bi bi-clock-history',
        command: () => {
        },
        routerLink: ['/vehicle-history', this.vehicleId],
        pTooltip: 'View History',
        severity: 'success'
      },
    ];
  }

  getVehicleById(id: Number) {
    this.vehicleService.getVehicleById(id).subscribe((res: Vehicle) => {
      this.vehicle = res;
    })
  }
}
