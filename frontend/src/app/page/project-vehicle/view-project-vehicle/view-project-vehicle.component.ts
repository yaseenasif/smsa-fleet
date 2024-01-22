import { Component, OnInit } from '@angular/core';
import { ProjectVehicle, ProjectVehicleValues } from 'src/app/modal/project-vehicle';
import { PrjectVehicleService } from '../service/prject-vehicle.service';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../../vendor-screen/service/vendor.service';
import { Vendor } from 'src/app/modal/vendor';

@Component({
  selector: 'app-view-project-vehicle',
  templateUrl: './view-project-vehicle.component.html',
  styleUrls: ['./view-project-vehicle.component.scss']
})
export class ViewProjectVehicleComponent implements OnInit {
  items: MenuItem[] | undefined;
  vendors!: Vendor[];

  projectVehicle: ProjectVehicle = {
    id: null,
    projectName: null,
    date: null,
    projectVehicleValuesList: [{
      id: null,
      plateNumber: null,
      leaseCost: null,
      rentalLease: null,
      vendor: {
        id: null,
        vendorName: null,
        officeLocation: null,
        contactPersonList: [],
        attachments: null
      }
    }]
  };
  projectVehicleId: number | undefined | null;

  constructor(
    private projectVehicleService: PrjectVehicleService,
    private router: Router,
    private route: ActivatedRoute,
    private vendorService: VendorService
  ) { }

  ngOnInit(): void {
    this.items = [{ label: 'Project Vehicle', routerLink: '/project-vehicle' }, { label: 'View Project Vehicle' }];
    this.getAllVendors();
    this.projectVehicleId = +this.route.snapshot.paramMap.get('id')!;
    this.getProjectVehicleById(this.projectVehicleId);
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
    this.projectVehicle = obj
  }
  getAllVendors() {
    this.vendorService.getVendor().subscribe((res: Vendor[]) => {
      this.vendors = res;
    });
  }

}
