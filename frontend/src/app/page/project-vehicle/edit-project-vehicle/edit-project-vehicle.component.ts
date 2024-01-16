import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ProjectVehicle } from 'src/app/modal/project-vehicle';
import { PrjectVehicleService } from '../service/prject-vehicle.service';
import { Vendor } from 'src/app/modal/vendor';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-project-vehicle',
  templateUrl: './edit-project-vehicle.component.html',
  styleUrls: ['./edit-project-vehicle.component.scss'],
  providers : [MessageService]
})
export class EditProjectVehicleComponent implements OnInit {
  constructor(private projectVehicleService : PrjectVehicleService,
    private messageService : MessageService,
    private route: ActivatedRoute
    ){}
    projectVehicleId: number | undefined;
  items: MenuItem[] | undefined;
  vendors !: Vendor[]
  projectVehicle : ProjectVehicle[] = [
    {
      id: undefined,
      projectName: undefined,
      plateNumber: undefined,
      vendor: {
        id: undefined,
        vendorName: undefined,
        officeLocation: undefined,
        contactPersonList: [],
        attachments: undefined
      }
    }
  ]
  ngOnInit(): void {
    this.items = [{ label: 'Project-Vehicle List', routerLink: '/project-vehicle' }, { label: 'Edit Grade' }];
    this.projectVehicleId = +this.route.snapshot.paramMap.get('id')!;
    this.getProjectVehicleById(this.projectVehicleId);
  }
  getProjectVehicleById(id: number) {
    this.projectVehicleService.getProjectVehicleById(id).subscribe((res: ProjectVehicle[]) => {
      this.projectVehicle = res;
      console.log(res);
      
    });
  }

  // updateProjectVehicle(projectVehicle: ProjectVehicle) {
  //   this.projectVehicleService.updateProjectVehicle(this.projectVehicleId!, projectVehicle).subscribe(
  //     (res) => {
  //       this.messageService.add({ severity: 'success', summary: ' Edit Successfully', detail: 'Project Vehicle has been edit' });  
  //     },
  //     (error) => {
  //       this.messageService.add({ severity: 'error', summary: 'Edit Error', detail: error.error });
  //     }
  //   );
  // }
  

  onSubmit() {
    // if (this.projectVehicleId && this.projectVehicle.length > 0) {
    //   this.updateProjectVehicle(this.projectVehicleId, this.projectVehicle[0]).subscribe(
    //     (res) => {
    //       this.messageService.add({ severity: 'success', summary: ' Edit Successfully', detail: 'Project Vehicle has been edit' });
    //     },
    //     (error) => {
    //       this.messageService.add({ severity: 'error', summary: 'Edit Error', detail: error.error });
    //     }
    //   );
    // }
  }
}
