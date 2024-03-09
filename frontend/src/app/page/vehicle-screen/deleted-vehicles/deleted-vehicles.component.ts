import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ErrorService } from 'src/app/CommonServices/Error/error.service';
import { PageEvent } from 'src/app/modal/pageEvent';
import { Vehicle } from 'src/app/modal/vehicle';
import { VehicleService } from '../service/vehicle.service';
import { BackenCommonErrorThrow } from 'src/app/modal/BackendCommonErrorThrow';

@Component({
  selector: 'app-deleted-vehicles',
  templateUrl: './deleted-vehicles.component.html',
  styleUrls: ['./deleted-vehicles.component.scss']
})
export class DeletedVehiclesComponent {

  items: MenuItem[] | undefined;
  vehicleList: Vehicle[] = [];

  query: PageEvent = {
    page: 0,
    size: 7,
  };

  constructor(
    private errorService: ErrorService,
    private vehicleService: VehicleService,
  ) { }

  ngOnInit(): void {
    this.items = [{ label: 'Deleted Vehicles' }];
    this.getAllVehicles();
  }

  getAllVehicles() {
    // this.vehicleService.xyz.subscribe(
    //   (res: Vehicle[]) => {
    //     this.vehicleList = res;
    //   }, (error: BackenCommonErrorThrow) => {
    //     this.errorService.showError(error.error!);
    //   });
  }

}
