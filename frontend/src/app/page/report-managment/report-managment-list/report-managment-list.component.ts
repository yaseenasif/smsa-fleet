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

@Component({
  selector: 'app-report-managment-list',
  templateUrl: './report-managment-list.component.html',
  styleUrls: ['./report-managment-list.component.scss']
})
export class ReportManagmentListComponent implements OnInit {

  items: MenuItem[] | undefined;
  vehicles !: Array<Vehicle>
  searchOption: any;
  selectedSearchOption = {name:'All'};
  vendor : Vendor[] = [];
  selectedVendor !: Vendor
  region: Region[] = [];
  selectedRegion !: Region;
  selectedUsageType = {name:'All'}
  usageType: any;
  vehicleStatus: any;
  selectedStatus = {name:'TBA'};
  leaseStartDate !: Date;
  leaseExpiryDate !: Date;

  query: PageEvent = {
    page: 0,
    size: 7,
  };

  constructor(
    private vendorService: VendorService,
    private regionService: RegionService,
    private vehicleService: VehicleService,
    private reportManagmentService: ReportManagmentService
  ) {}

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
        name: 'Optional'
      },
      {
        name: 'Non-Optional'
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

  searchVehiclesByRegion() {
    if(this.selectedRegion) {
      this.reportManagmentService.searchVehiclesByRegion(this.selectedRegion.name, this.query)
      .subscribe(( res: PaginatedResponse<Vehicle>) => {
        this.vehicles = res.content;
      })
    }
  }

  searchVehiclesByVendor() {
    if(this.selectedVendor) {
      this.reportManagmentService.searchVehiclesByVendor(this.selectedVendor.vendorName, this.query).subscribe(( res: PaginatedResponse<Vehicle> ) => {
        this.vehicles = res.content;
      })
    }
  }

  searchVehiclesByUsageType() {
    if(this.selectedUsageType) {
      this.reportManagmentService.searchVehiclesByUsageType(this.selectedUsageType.name, this.query)
      .subscribe(( res: PaginatedResponse<Vehicle>) => {
        this.vehicles = res.content;
      })
    }
  }

  searchVehiclesByLeaseExpiry() {
    if(this.leaseStartDate && this.leaseExpiryDate) {
      this.reportManagmentService.searchVehiclesByLeaseExpiry(this.leaseStartDate, this.leaseExpiryDate, this.query)
      .subscribe(( res: PaginatedResponse<Vehicle>) => {
        this.vehicles = res.content;
      })
    }
  }

}
