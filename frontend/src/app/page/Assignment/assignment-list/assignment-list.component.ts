import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { VehicleAssignmentService } from '../vehicle-assignment.service';
import { VehicleAssignment } from 'src/app/modal/vehicle-assignment';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.scss'],
  providers: [MessageService]
})
export class AssignmentListComponent {
  
  vehicleAssignment !: VehicleAssignment[]
  
  constructor(private vehicleAssignmentService: VehicleAssignmentService,
    private messageService: MessageService) { }
  

  products:any=[{name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},];
  items: MenuItem[] | undefined;

 

  ngOnInit() {
      this.items = [{ label: 'Vehicle Assignment'}];
    
      this.getAllVehicleAssignment();
    }

  getAllVehicleAssignment() {
    this.vehicleAssignmentService.getAllVehicleAssignment().subscribe((res: VehicleAssignment[]) => {

      this.vehicleAssignment = res
      console.log(this.vehicleAssignment);
      
      
    })
  }

  deleteVehicleAssignment(id: Number) {

    this.vehicleAssignmentService.deleteVehicleAssignment(id).subscribe((res) => {

      this.messageService.add({ severity: 'success', summary: 'Delete Successfully', detail: 'Employee has been deleted' });  

      this.getAllVehicleAssignment();
      
    })
  
}

}
