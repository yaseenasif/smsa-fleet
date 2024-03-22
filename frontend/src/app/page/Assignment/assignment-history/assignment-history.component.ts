import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as saveAs from 'file-saver';
import { MenuItem } from 'primeng/api';
import { DashboardRedirectServiceService } from 'src/app/CommonServices/dashboard-redirect-service.service';
import { Vehicle } from 'src/app/modal/vehicle';
import { VehicleAssignment } from 'src/app/modal/vehicle-assignment';
import { VehicleHistory } from 'src/app/modal/vehicle-history';
import { VehicleService } from '../../vehicle-screen/service/vehicle.service';
import { VehicleAssignmentService } from '../vehicle-assignment.service';

@Component({
  selector: 'app-assignment-history',
  templateUrl: './assignment-history.component.html',
  styleUrls: ['./assignment-history.component.scss']
})
export class AssignmentHistoryComponent {
  items: MenuItem[] | undefined;


  vehicleAssignmentId: Number | undefined
  vehicleHistory !: VehicleHistory[]
  vehicle !: Vehicle

  constructor(private vehicleService: VehicleService, private route: ActivatedRoute, 
              private vehicleAssignmentService: VehicleAssignmentService,
              private dashboardRedirectService: DashboardRedirectServiceService
    ) {

  }
  
  ngOnInit() {
    this.items = [{ label: 'Vehicle Assignment',routerLink:'/assignment'},{ label: 'Vehicle Assignment History'}];
    this.vehicleAssignmentId = +this.route.snapshot.paramMap.get('id')!;
    this.getVehicleById(this.vehicleAssignmentId)
    this.getVehicleHistoryById(this.vehicleAssignmentId)
    this.dashboardRedirectService.setDashboardValue('Assignment');
  }

  getVehicleHistoryById(id: Number){
  
    this.vehicleService.getVehicleHistoryById(id).subscribe((res)=>{
      this.vehicleHistory = res.map((el)=> {
        
        [el.createdAtDate, el.createdAtTime] = el.createdAt.split('T');

        if(el.type == 'Assignment' || el.type == 'Released'){
          return {...el,icon: 'bi bi-clipboard2-check', color: '#F59E0B'}
        }else{
          return {...el,icon: 'bi bi-arrow-repeat', color: '#3B82F6'}
        }

        
      });
      
    })
  } 

  getVehicleById(id: Number){
    
    this.vehicleService.getVehicleById(id).subscribe((res)=>{
    this.vehicle = res;
    
  });
}

downloadPdf(id: Number){
  this.vehicleService.generateVehicleHistoryPdf(id).subscribe(blob => saveAs(blob,"vehicle_history_"+id));
}

}
