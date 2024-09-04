import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../../common-service/vehicle.service';
import { PageEvent } from '../../../modal/PageEvent';
import { PaginatedResponse } from '../../../modal/paginatedResponse';
import { Vehicle } from '../../../modal/vehicle';
import { VehicleHistory } from '../../../modal/vehicleHistory';
import { ToolbarModule } from 'primeng/toolbar';


@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss'
})
export class VehicleListComponent {

  vehicleId: Number | undefined;


  // pieData: any;
  // pieOptions: any;
  // pieDataAccount: any;
  // pieDataAwb: any;
  // pieAwbOptions: any;
  // awbData: any;

  // refresh: boolean = true;

  value !: string;
  // vehicle : Vehicle = {
  //   id: undefined,
  //   processOrderNumber: undefined,
  //   plateNumber: undefined,
  //   make: undefined,
  //   year: undefined,
  //   design: undefined,
  //   model: undefined,
  //   type: undefined,
  //   capacity: undefined,
  //   power: undefined,
  //   region: undefined,
  //   country: undefined,
  //   location: undefined,
  //   registrationExpiry: undefined,
  //   fuelType: undefined,
  //   vendor: {
  //     id: undefined,
  //     vendorName: undefined,
  //     officeLocation: undefined,
  //     attachments: undefined
  //   },
  //   insuranceExpiry: undefined,
  //   leaseCost: undefined,
  //   replaceLeaseCost: undefined,
  //   leaseStartDate: undefined,
  //   leaseExpiryDate: undefined,
  //   usageType: undefined,
  //   category: undefined,
  //   vehicleStatus: undefined,
  //   replacementVehicleStatus: undefined,
  //   registrationStatus: undefined,
  //   insuranceStatus: undefined,
  //   replacementDate: undefined,
  //   replacementReason: undefined,
  //   replacementRemarks: undefined,
  //   replacementVehicle: undefined
  // };
  vehicles!: Array<Vehicle>;

  vehicleHistory!: VehicleHistory[];
  selectedStatus = { name: 'All' };
  query: PageEvent = {
    page: 0,
    size: 7,
  };
  totalRecords: number = 0;

  flag = 'TBA'
  vehicleStatus: any;

  constructor( private vehicleService: VehicleService ) {}

  ngOnInit(): void {
    this.vehicleStatus = [
      {
        name: 'All'
      },
      {
        name: 'Active'
      },
      {
        name: 'Replacement'
      },
      {
        name: 'Under Maintenance'
      },
      {
        name: 'In-Active'
      },
      {
        name: 'TBA'
      },
    ]
    this.setSelectedStatusAndGetAllVehicles()
  }


  OnSelectChange() {
    if (this.selectedStatus.name !== this.flag) {
      this.query.page = 0;
      this.flag = this.selectedStatus.name;
      sessionStorage.setItem('selectedStatus', this.selectedStatus.name);
    }
    this.searchAllVehicles(this.selectedStatus.name);
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
    this.searchAllVehicles(this.selectedStatus.name)
  }

  setSelectedStatusAndGetAllVehicles() {
    const status = sessionStorage.getItem('selectedStatus');
    this.selectedStatus.name = status ? status : "All";
    this.searchAllVehicles(this.selectedStatus.name);
  }

}
