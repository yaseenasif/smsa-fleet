import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { VehicleAssignmentService } from '../vehicle-assignment.service';
import { VehicleAssignment } from 'src/app/modal/vehicle-assignment';
import { PaginatedResponse } from 'src/app/modal/paginatedResponse';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.scss'],
  providers: [MessageService]
})
export class AssignmentListComponent {
  
  vehicleAssignment !: VehicleAssignment[]

  query !: {
    page: number,
    size: number
  };

  value: string | null = null;
  totalRecords: number = 0;

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
    this.vehicleAssignmentService.searchAssignmentByPlateNumber(this.value, this.query).subscribe((res: PaginatedResponse<VehicleAssignment>) => {
      this.vehicleAssignment = res.content;
      this.query = { page: res.pageable.pageNumber, size: res.size }
      this.totalRecords = res.totalElements;
    })

  }

  deleteVehicleAssignment(id: Number) {

    this.vehicleAssignmentService.deleteVehicleAssignment(id).subscribe((res) => {

      this.messageService.add({ severity: 'success', summary: 'Delete Successfully', detail: 'Employee has been deleted' });  

      this.getAllVehicleAssignment();
      
    })
  
}
  onPageChange(event?: any) {
    this.query.page = event.page;
    this.query.size = event.rows;
    this.getAllVehicleAssignment()
  }

}
