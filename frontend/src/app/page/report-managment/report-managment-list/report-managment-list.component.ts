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
import * as saveAs from 'file-saver';

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
  selectedPoNumber: string[] | string | undefined | null;
  poNumber: string[] | undefined | null;
  region: Region[] = [];
  selectedRegion: Region | undefined;
  selectedUsageType: { name: string | undefined; } | undefined
  usageType: any;
  vehicleStatus: any;
  selectedStatus: { name: string | undefined; } | undefined;
  leaseStartDate: Date | undefined;
  leaseExpiryDate: Date | undefined;
  selectedCategory: string[] | undefined;

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
    country: undefined,
    location: undefined,
    vehicleReplacement: undefined,
    replacementVehicleStatus: undefined,
    registrationStatus: undefined,
    insuranceStatus: undefined
  }
  oneIsSelected: boolean | undefined;
  poNumberList: { poNumber: string }[] = [];
  category: any;

  constructor(
    private errorService: ErrorService,
    private vendorService: VendorService,
    private regionService: RegionService,
    private vehicleService: VehicleService,
    private reportManagmentService: ReportManagmentService
  ) { }

  ngOnInit(): void {
    this.items = [{ label: 'Report Management' }];
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

    this.category = [
      {
        name: 'Cooling Unit'
      },
      {
        name: 'Dry Unit'
      },
      {
        name: 'NA'
      }
    ];

    this.getAllVendors();
    this.getAllRegion();
    this.getAllVehicles();
    this.ListOfDistinctPoNumbers();
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


  checkBothSelected() {

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

  onSelectPoNumbers(selectedValues: string[]) {
    this.selectedPoNumber = JSON.stringify(selectedValues);
  }

  onSelectVendors(slectedValues: string[]) {
    this.vehicle.vendor.vendorName = JSON.stringify(slectedValues);
  }
  onSelectUsageType(slectedValues: string[]) {
    this.vehicle.usageType = JSON.stringify(slectedValues);
  }
  onSelectCategory(slectedValues: string[]) {
    this.vehicle.category = JSON.stringify(slectedValues);
  }
  onSelectRegion(slectedValues: string[]) {
    this.vehicle.region = JSON.stringify(slectedValues);
  }
  onSelectVehicleStatus(slectedValues: string[]) {
    this.vehicle.vehicleStatus = JSON.stringify(slectedValues);
  }

  dynamicSearch() {
    const selectedPoNumberString: string = this.selectedPoNumber as string;
    this.reportManagmentService.searchVehiclesWithDynamicValues(this.vehicle, selectedPoNumberString).subscribe(
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
    this.selectedPoNumber = undefined;
    this.vehicle = {
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
      country: undefined,
      location: undefined,
      vehicleReplacement: undefined,
      replacementVehicleStatus: undefined,
      registrationStatus: undefined,
      insuranceStatus: undefined
    }
    this.getAllVehicles();
  }

  downloadExcelData() {
    this.vehicleService.downloadExcelData(this.vehicles)
      .subscribe(blob => saveAs(blob, "Report Data.xlsx"));
  }

  ListOfDistinctPoNumbers() {
    this.vehicleService.getAllDistinctPoNumbers().subscribe(
      (res: { poNumber: string }[]) => {
        this.poNumberList = res;
      },
      (error: BackenCommonErrorThrow) => {
        this.errorService.showError(error.error!);
      }
    );
  }

}
