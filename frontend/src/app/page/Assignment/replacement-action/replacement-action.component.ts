import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { DashboardRedirectServiceService } from 'src/app/CommonServices/dashboard-redirect-service.service';
import { Employee } from 'src/app/modal/employee';
import { ReplacementActionRequest } from 'src/app/modal/replacement-action-request';
import { Vehicle } from 'src/app/modal/vehicle';
import { VehicleAssignment } from 'src/app/modal/vehicle-assignment';
import { EmployeeService } from '../../employee-screen/service/employee.service';
import { VehicleService } from '../../vehicle-screen/service/vehicle.service';
import { VehicleAssignmentService } from '../vehicle-assignment.service';

@Component({
  selector: 'app-replacement-action',
  templateUrl: './replacement-action.component.html',
  styleUrls: ['./replacement-action.component.scss']
})
export class ReplacementActionComponent {

  items: MenuItem[] | undefined;
  replacementVehicleId!: Number;
  replacementVehicle: Vehicle = {
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
    region: undefined,
    country: undefined,
    location: undefined,
    registrationExpiry: undefined,
    fuelType: undefined,
     vendor:
     {
        id: undefined,
        vendorName: undefined,
        officeLocation: undefined,
        attachments: undefined,

    },
    insuranceExpiry: undefined,
    leaseCost: undefined,
    replaceLeaseCost: undefined,
    leaseStartDate: undefined,
    leaseExpiryDate: undefined,
    usageType: undefined,
    category: undefined,
    vehicleStatus: undefined,
    replacementVehicleStatus: undefined,
    registrationStatus: undefined,
    insuranceStatus: undefined,
    replacementDate: undefined,
    replacementReason: undefined,
    replacementRemarks: undefined,
    replacementVehicle: undefined
  }
  originalVehicle: Vehicle = {
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
    region: undefined,
    country: undefined,
    location: undefined,
    registrationExpiry: undefined,
    fuelType: undefined,
     vendor:
     {
        id: undefined,
        vendorName: undefined,
        officeLocation: undefined,
        attachments: undefined,

    },
    insuranceExpiry: undefined,
    leaseCost: undefined,
    replaceLeaseCost: undefined,
    leaseStartDate: undefined,
    leaseExpiryDate: undefined,
    usageType: undefined,
    category: undefined,
    vehicleStatus: undefined,
    replacementVehicleStatus: undefined,
    registrationStatus: undefined,
    insuranceStatus: undefined,
    replacementDate: undefined,
    replacementReason: undefined,
    replacementRemarks: undefined,
    replacementVehicle: undefined
  };

  replacementActionRequest: ReplacementActionRequest = {
    changedAssignedEmployee: undefined,
    permanentVehicle: undefined,
    action: undefined
  };

  visible: boolean = false
  replacementAssignment!: VehicleAssignment;
  unassignedEmployees!: Employee[];
  selectedUnassignedEmployee!: Employee;
  empName: string | null | undefined;
  actionCheck: boolean = false;


  constructor(private route: ActivatedRoute, private vehicleService: VehicleService,
    private vehicleAssignmentService: VehicleAssignmentService,
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private router: Router, private dashboardRedirectService: DashboardRedirectServiceService) {
  }

  ngOnInit() {
    this.items = [{ label: 'Vehicle Assignment', routerLink: '/assignment' }, { label: 'Take Action' }];
    this.replacementVehicleId = this.route.snapshot.queryParams['id']!;
    this.getVehiclebyId(this.replacementVehicleId);
    this.getAssignmentByVehicleId();
    this.getUnassignedEmployee();
    this.dashboardRedirectService.setDashboardValue('Assignment');
  }


  getVehiclebyId(id: Number) {
    this.vehicleService.getVehicleById(id).subscribe((res) => {
      this.replacementVehicle = res
      this.originalVehicle = res.replacementVehicle!
    })
  }

  getAssignmentByVehicleId() {
    this.vehicleAssignmentService.getAssignmentByVehicleId(this.replacementVehicleId).subscribe((res) => {
      this.replacementAssignment = res
    })
  }

  getUnassignedEmployee() {
    this.employeeService.getAllUnAssignedEmployees().subscribe((res) => {
      this.unassignedEmployees = res;
    })
  }

  showEmpName() {
    this.empName = this.selectedUnassignedEmployee.empName
  }

  showDialog() {
    this.visible = true
  }

  closeDialog() {
    this.visible = false
  }

  takeAction(action: String) {
    this.replacementActionRequest.action = action
    this.replacementActionRequest.changedAssignedEmployee = this.selectedUnassignedEmployee
    this.replacementActionRequest.permanentVehicle = null
    this.vehicleService.replacementVehicleAction(this.replacementVehicleId, this.replacementActionRequest).subscribe((res) => {
      this.messageService.add({ severity: 'success', summary: 'Vehicle Assigned Successfully' });

      this.router.navigate(['/assignment'])

    })
  }

  takeActionWithoutChangedAssignment(action: String) {
    this.replacementActionRequest.action = action
    this.replacementActionRequest.changedAssignedEmployee = null
    this.replacementActionRequest.permanentVehicle = null
    this.vehicleService.replacementVehicleAction(this.replacementVehicleId, this.replacementActionRequest).subscribe((res) => {
      this.messageService.add({ severity: 'success', summary: 'Vehicle Assigned Successfully' });

      this.router.navigate(['/assignment'])

    })
  }

  navigateToAddVehicle() {
    this.actionCheck = true;
    this.router.navigate(['/add-vehicle/actionCheck/vId'], {
      queryParams: {
        actionCheck: this.actionCheck,
        vId: this.replacementVehicleId,
        screenType: "assignment"
      }
    });
  }
}
