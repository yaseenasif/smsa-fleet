import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ErrorService } from 'src/app/CommonServices/Error/error.service';
import { PageEvent } from 'src/app/modal/pageEvent';
import { Vehicle } from 'src/app/modal/vehicle';
import { VehicleService } from '../service/vehicle.service';
import { BackenCommonErrorThrow } from 'src/app/modal/BackendCommonErrorThrow';
import { PaginatedResponse } from 'src/app/modal/paginatedResponse';

@Component({
  selector: 'app-deleted-vehicles',
  templateUrl: './deleted-vehicles.component.html',
  styleUrls: ['./deleted-vehicles.component.scss']
})
export class DeletedVehiclesComponent {

  items: MenuItem[] | undefined;
  value: string | null = null;
  vehicles!: Array<Vehicle>;
  totalRecords: number = 0;

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
    this.searchAllVehicles('Deleted');
  }

  searchAllVehicles(vehiclestatus: string) {
    this.vehicleService.searchAllVehicles(this.value, vehiclestatus, this.query).subscribe((res: PaginatedResponse<Vehicle>) => {
      this.vehicles = res.content
      this.query = { page: res.pageable.pageNumber, size: res.size }
      this.totalRecords = res.totalElements;
    })
  }

  onPageChange(value?: string | null, event?: any) {
    this.query.page = event.page;
    this.query.size = event.rows;
    this.searchAllVehicles('Deleted')
  }

}
