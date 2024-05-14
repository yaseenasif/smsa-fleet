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
  countLease: number | undefined | null;
  countRental: number | undefined | null;
  totalCost: number | undefined | null;
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
    this.projectVehicleService.getAllProjectVehicle().subscribe((projectVehicles: ProjectVehicle[]) => {
      this.projectVehicles = projectVehicles;
      this.calculateTotals();
    });
  }

  calculateTotals() {
    this.projectVehicles.forEach(project => {
      let totalRental = 0;
      let totalLease = 0;
      let totalRentalCost = 0;

      project.projectVehicleValuesList.forEach(value => {
        if (value.type === 'Rental') {
          totalRental++;
          totalRentalCost += value.leaseCost || 0;
        } else if (value.type === 'Leased') {
          totalLease++;
        }
      });

      project.totalRental = totalRental;
      project.totalLease = totalLease;
      project.totalRentalCost = totalRentalCost;
    });
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
