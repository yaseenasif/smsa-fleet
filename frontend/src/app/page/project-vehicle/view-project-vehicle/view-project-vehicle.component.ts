import { Component, OnInit } from '@angular/core';
import { ProjectVehicle, ProjectVehicleValues } from 'src/app/modal/project-vehicle';
import { PrjectVehicleService } from '../service/prject-vehicle.service';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../../vendor-screen/service/vendor.service';
import { Vendor } from 'src/app/modal/vendor';
import { DashboardRedirectServiceService } from 'src/app/CommonServices/dashboard-redirect-service.service';

@Component({
  selector: 'app-view-project-vehicle',
  templateUrl: './view-project-vehicle.component.html',
  styleUrls: ['./view-project-vehicle.component.scss']
})
export class ViewProjectVehicleComponent implements OnInit {
  items: MenuItem[] | undefined;
  vendors!: Vendor[];
  duration:number[]=[];
  minDueDate: Date | null | undefined;  projectVehicle: ProjectVehicle = {
    id: null,
    projectName: null,
    date: null,
    projectVehicleValuesList: [{
      id: null,
      plateNumber: null,
      leaseCost: null,
      type: null,
      origin: null,
      destination: null,
      rentalDate: null,
      rentalDateTo: null,
      startLease: null,
      expiryLease: null,
      duration: null,
      vendor: {
        id: null,
        vendorName: null,
        officeLocation: null,
        contactPersonList: [],
        attachments: null
      },
      month: undefined
    }]
  };
  projectVehicleId: number | undefined | null;

  constructor(
    private projectVehicleService: PrjectVehicleService,
    private router: Router,
    private route: ActivatedRoute,
    private vendorService: VendorService,
    private dashboardRedirectService: DashboardRedirectServiceService
  ) { }

  ngOnInit(): void {
    this.items = [{ label: 'Project Vehicle', routerLink: '/project-vehicle' }, { label: 'View Project Vehicle' }];
    this.getAllVendors();
    this.projectVehicleId = +this.route.snapshot.paramMap.get('id')!;
    this.getProjectVehicleById(this.projectVehicleId);
    this.dashboardRedirectService.setDashboardValue('ProjectVehicle');
  }
  getProjectVehicleById(id: number) {
    this.projectVehicleService.getProjectVehicleById(id).subscribe(
      (res: ProjectVehicle) => {
        this.patchProjectVehicle(res)
      }, error => {

      })

  }
  patchProjectVehicle(obj: ProjectVehicle) {
    obj.date = new Date
    this.convertInDate(obj)
    this.projectVehicle = obj
    console.log(obj);
    for (let index = 0; index < obj.projectVehicleValuesList.length; index++) {
    this.updateDuration(index)

    }

  }
  calculateDuration(startLease: Date | null | undefined, expiryLease: Date | null | undefined): number {
    if (startLease && expiryLease) {
      const startLeaseDate = new Date(startLease);
      const expiryLeaseDate = new Date(expiryLease);

      if (!isNaN(startLeaseDate.getTime()) && !isNaN(expiryLeaseDate.getTime())) {
        const durationInMilliseconds = expiryLeaseDate.getTime() - startLeaseDate.getTime();
        const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);
        return durationInDays;
      }
    }

    return -1; // Indicate an error or invalid date(s)
  }
  getAllVendors() {
    this.vendorService.getVendor().subscribe((res: Vendor[]) => {
      this.vendors = res;
    });
  }
  updateDuration(i: number) {
    if (this.projectVehicle.projectVehicleValuesList[i].startLease) {
        this.minDueDate = new Date(this.projectVehicle.projectVehicleValuesList[i].startLease!);
    } else {
        this.minDueDate = null;
    }


    if (this.projectVehicle.projectVehicleValuesList[i].startLease && this.projectVehicle.projectVehicleValuesList[i].expiryLease) {

        const startLeaseTime = this.projectVehicle.projectVehicleValuesList[i].startLease!.getTime();
        const expiryLeaseTime = this.projectVehicle.projectVehicleValuesList[i].expiryLease!.getTime();

        if (expiryLeaseTime < startLeaseTime) {
            this.duration[i] = Number(null); // Convert null to number type
            console.error('Expiry date is before start date.');
        } else {
            const timeDifference = expiryLeaseTime - startLeaseTime;
            const durationInDays = timeDifference / (1000 * 60 * 60 * 24);

            this.duration[i] = durationInDays;
            console.log('Duration:', this.duration);
        }
    } else {
        this.duration[i] = 0;
        console.error('Start date or expiry date is undefined.');
    }
  }
  private convertInDate(obj: ProjectVehicle) {
    if (typeof obj.date === 'string') {
        obj.date = new Date(obj.date);
    }
    obj.projectVehicleValuesList.forEach((value) => {
        if (typeof value.rentalDate === 'string') {
            value.rentalDate = new Date(value.rentalDate);
        }
        if (typeof value.startLease === 'string') {
            value.startLease = new Date(value.startLease);
        }
        if (typeof value.expiryLease === 'string') {
            value.expiryLease = new Date(value.expiryLease);
        }
    });
}
}
