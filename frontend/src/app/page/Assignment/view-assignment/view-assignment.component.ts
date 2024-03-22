import { Component } from '@angular/core';
import { VehicleAssignmentService } from '../vehicle-assignment.service';
import { ActivatedRoute } from '@angular/router';
import { VehicleAssignment } from 'src/app/modal/vehicle-assignment';
import { MenuItem } from 'primeng/api';
import { DashboardRedirectServiceService } from 'src/app/CommonServices/dashboard-redirect-service.service';
@Component({
  selector: 'app-view-assignment',
  templateUrl: './view-assignment.component.html',
  styleUrls: ['./view-assignment.component.scss']
})
export class ViewAssignmentComponent {
 
  items: MenuItem[] | undefined;
  vehicleAssignment !: VehicleAssignment
  assignmentId: Number | undefined;

  constructor(private vehicleAssignmentService: VehicleAssignmentService,private route: ActivatedRoute,
    private dashboardRedirectService: DashboardRedirectServiceService) { }


  ngOnInit(){
    this.items = [{ label: 'Vehicle Assignment',routerLink:'/assignment'},{ label: 'View Vehicle Assignment'}];
    this.assignmentId = +this.route.snapshot.paramMap.get('id')!;
    this.getVehicleAssignmentById(this.assignmentId);
    
    this.dashboardRedirectService.setDashboardValue('Assignment');
  }

  getVehicleAssignmentById(id: Number) {
    this.vehicleAssignmentService.getVehicleAssignmentById(id).subscribe((res: VehicleAssignment) => {
      this.vehicleAssignment = res;
    })
  }
}
