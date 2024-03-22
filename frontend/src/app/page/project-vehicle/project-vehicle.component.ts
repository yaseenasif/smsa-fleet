import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { PrjectVehicleService } from './service/prject-vehicle.service';
import { ProjectVehicle, ProjectVehicleValues } from 'src/app/modal/project-vehicle';
import { DashboardRedirectServiceService } from 'src/app/CommonServices/dashboard-redirect-service.service';

@Component({
  selector: 'app-project-vehicle',
  templateUrl: './project-vehicle.component.html',
  styleUrls: ['./project-vehicle.component.scss'],
  providers: [MessageService]
})
export class ProjectVehicleComponent implements OnInit {
  countLease: number[] | undefined | null;
  countRental: number[] | undefined | null;
  totalCost: number[] | undefined | null;
  totalRentalCost: number = 0;
  constructor(private projectVehicleService: PrjectVehicleService,
    private messageService: MessageService, private dashboardRedirectService: DashboardRedirectServiceService
  ) { }
  projectVehicles!: ProjectVehicle[];
  projectVehicleId: number | undefined;
  items: MenuItem[] | undefined;
  ngOnInit(): void {
    this.getAllProjectVehicle()
    this.dashboardRedirectService.setDashboardValue('ProjectVehicle');
  }
  getAllProjectVehicle() {
    this.projectVehicleService.getAllProjectVehicle().subscribe((projectVehicle: ProjectVehicle[]) => {
      this.projectVehicles = projectVehicle;
      console.log(projectVehicle);
  
      this.countLease = [];
      this.countRental = [];
      this.totalCost = []; // Reset totalCost array
  
      for (let index = 0; index < this.projectVehicles.length; index++) {
        this.projectVehicles[index].projectVehicleValuesList.forEach((item: ProjectVehicleValues) => {
          
          if (item.type === "Leased") {
            if (this.countLease) {
              this.countLease.push((this.countLease[this.countLease.length - 1] || 0) + 1);
            } else {
              this.countLease = [1];
            }
          } else if (item.type === "Rental") {
            // Accumulate rental costs
            if (item.leaseCost) { // Ensure leaseCost exists
              this.totalCost?.push(item.leaseCost!);
            }
  
            if (this.countRental) {
              this.countRental.push((this.countRental[this.countRental.length - 1] || 0) + 1);
            } else {
              this.countRental = [1];
            }
          }
        });
      }
      // Calculate and store the total rental cost
      this.totalRentalCost = this.getTotalRentalCost();
    });
  }
  
  getTotalRentalCost(): number {
    let total = 0;
  
    if (this.totalCost) {
      this.totalCost.forEach((value: number) => {
        total += value;
      });
    }
  
    return total;
  }
  deleteProjectVehicleById(id: number) {
    this.projectVehicleService.deleteGradeByProjectVehicle(id).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Delete Successfully',
        detail: 'Project Vehicle has been deleted',
      });

      this.getAllProjectVehicle();
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Delete Error', detail: error.error });
      });
  }
}
