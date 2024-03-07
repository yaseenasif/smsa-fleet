import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Vehicle } from 'src/app/modal/vehicle';
import { VendorService } from '../../vendor-screen/service/vendor.service';
import { Vendor } from 'src/app/modal/vendor';
import { RegionService } from '../../region/service/region.service';
import { Region } from 'src/app/modal/Region';
import { VehicleService } from '../../vehicle-screen/service/vehicle.service';
import { ReportManagmentService } from './service/report-managment.service';
import { PageEvent } from 'src/app/modal/pageEvent';
import { PaginatedResponse } from 'src/app/modal/paginatedResponse';
import { ErrorService } from 'src/app/CommonServices/Error/error.service';
import { BackenCommonErrorThrow } from 'src/app/modal/BackendCommonErrorThrow';

@Component({
  selector: 'app-report-managment-list',
  templateUrl: './report-managment-list.component.html',
  styleUrls: ['./report-managment-list.component.scss']
})
export class ReportManagmentListComponent implements OnInit {

  items: MenuItem[] | undefined;
  vehicles !: Array<Vehicle>
  searchOption: any;
  selectedSearchOption = { name: 'All' };
  vendor: Vendor[] = [];
  selectedVendor: Vendor | undefined
  region: Region[] = [];
  selectedRegion: Region | undefined;
  selectedUsageType: { name: string | undefined; } | undefined
  usageType: any;
  vehicleStatus: any;
  selectedStatus: { name: string | undefined; } | undefined;
  leaseStartDate: Date | undefined;
  leaseExpiryDate: Date | undefined;

  query: PageEvent = {
    page: 0,
    size: 7,
  };

  vehicle: Vehicle = {
    id: undefined,
    processOrderNumber: undefined,
    plateNumber: undefined,
    make: undefined,
    year: undefined,
    design: undefined,
    model: undefined,
    type: undefined,
    capacity: undefined,
    power: undefined,
    registrationExpiry: undefined,
    fuelType: undefined,
    vendor: {
      id: undefined,
      vendorName: undefined,
      officeLocation: undefined,
      attachments: undefined,
    },
    insuranceExpiry: undefined,
    leaseCost: undefined,
    leaseStartDate: undefined,
    leaseExpiryDate: undefined,
    usageType: undefined,
    category: undefined,
    replacementDate: undefined,
    replaceLeaseCost: undefined,
    vehicleStatus: undefined,
    region: undefined,
    vehicleReplacement: undefined,
    replacementVehicleStatus: undefined,
    registrationStatus: undefined,
    insuranceStatus: undefined
  }
  oneIsSelected: boolean | undefined;

  constructor(
    private errorService: ErrorService,
    private vendorService: VendorService,
    private regionService: RegionService,
    private vehicleService: VehicleService,
    private reportManagmentService: ReportManagmentService
  ) { }

  ngOnInit(): void {

    this.searchOption = [
      {
        name: 'All'
      },
      {
        name: 'Search By Lease Expiry'
      },
      {
        name: 'Search By Vendor'
      },
      {
        name: 'Search By Usage Type'
      },
      {
        name: 'Search By Region'
      },
      {
        name: 'Search By Vehicle Status'
      }
    ];

    this.usageType = [
      {
        name: 'All'
      },
      {
        name: 'Operational'
      },
      {
        name: 'Non-Operational'
      }
    ];

    this.vehicleStatus = [
      {
        name: 'TBA'
      },
      {
        name: 'Active'
      },
      {
        name: 'In-Active'
      },
      {
        name: 'Under Maintenance'
      },
      {
        name: 'Replacement'
      }
    ];

    this.getAllVendors();
    this.getAllRegion();
    this.getAllVehicles();

  }

  getAllVehicles() {
    this.vehicleService.getAllVehicles().subscribe((res) => {
      this.vehicles = res;
    })
  }

  getAllVendors() {
    this.vendorService.getVendor().subscribe((res) => {
      this.vendor = res;

    })
  };

  getAllRegion() {
    this.regionService.getRegion().subscribe((res) => {
      this.region = res
    })
  }

  // searchVehiclesByRegion() {
  //   if (this.selectedRegion) {
  //     this.reportManagmentService.searchVehiclesByRegion(this.selectedRegion.name, this.query)
  //       .subscribe((res: PaginatedResponse<Vehicle>) => {
  //         this.vehicles = res.content;
  //       })
  //   }
  // }

  // searchVehiclesByVendor() {
  //   if (this.selectedVendor) {
  //     this.reportManagmentService.searchVehiclesByVendor(this.selectedVendor.vendorName, this.query).subscribe((res: PaginatedResponse<Vehicle>) => {
  //       this.vehicles = res.content;
  //     })
  //   }
  // }

  // searchVehiclesByUsageType() {
  //   if (this.selectedUsageType) {
  //     this.reportManagmentService.searchVehiclesByUsageType(this.selectedUsageType.name, this.query)
  //       .subscribe((res: PaginatedResponse<Vehicle>) => {
  //         this.vehicles = res.content;
  //       })
  //   }
  // }

  // searchVehiclesByLeaseExpiry() {
  //   if(this.leaseStartDate && this.leaseExpiryDate) {
  //     this.reportManagmentService.searchVehiclesByLeaseExpiry(this.leaseStartDate, this.leaseExpiryDate, this.query)
  //     .subscribe(( res: PaginatedResponse<Vehicle>) => {
  //       this.vehicles = res.content;
  //     })
  //   }
  // }

  checkBothSelected() {
    debugger
    this.vehicle.leaseStartDate = this.leaseStartDate;
    this.vehicle.leaseExpiryDate = this.leaseExpiryDate;
    if (this.vehicle.leaseStartDate && !this.vehicle.leaseExpiryDate) {
      this.oneIsSelected = true;
    } else if (!this.vehicle.leaseStartDate && this.vehicle.leaseExpiryDate) {
      this.oneIsSelected = true;
    } else {
      this.oneIsSelected = false;
    }
  }

  onSelectVendors(event: string[]) {
    debugger
    this.vehicle.vendor.vendorName = JSON.stringify(event);
  }
  onSelectUsageType(event: string[]) {
    debugger
    this.vehicle.usageType = JSON.stringify(event);
  }
  onSelectRegion(event: string[]) {
    debugger
    this.vehicle.region = JSON.stringify(event);
  }
  onSelectVehicleStatus(event: string[]) {
    debugger
    this.vehicle.vehicleStatus = JSON.stringify(event);
  }

  dynamicSearch() {
    debugger
    this.reportManagmentService.searchVehiclesWithDynamicValues(this.vehicle).subscribe(
      (res: Vehicle[]) => {
        this.vehicles = res;
      },
      (error: BackenCommonErrorThrow) => {
        this.errorService.showError(error.error!);
      });
  }

  clear() {
    this.leaseStartDate = undefined;
    this.leaseExpiryDate = undefined;
    this.oneIsSelected = false;
    this.selectedUsageType = undefined;
    this.selectedRegion = undefined;
    this.selectedStatus = undefined;
    this.selectedVendor = undefined;
    this.getAllVehicles();
  }
}
