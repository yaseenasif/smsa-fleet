import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DashboardRedirectServiceService } from 'src/app/CommonServices/dashboard-redirect-service.service';
import { Vehicle } from 'src/app/modal/vehicle';
import { VehicleAssignment } from 'src/app/modal/vehicle-assignment';
import { VehicleAssignmentService } from '../../Assignment/vehicle-assignment.service';
import { VehicleService } from '../service/vehicle.service';


@Component({
  selector: 'app-view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.scss']
})
export class ViewVehicleComponent {

  items: MenuItem[] | undefined;
  items2: MenuItem[] = [];
  vehicle!: Vehicle;
  vehicleId: Number | undefined;
  vehicles!: Array<Vehicle>;
  assignmentCheck!: boolean;
  tooltipItems: MenuItem[] | undefined;
  vehicleAssignment: VehicleAssignment = {
    id: undefined,
    assignToEmpName: undefined,
    assignToEmpId: {
      id:  undefined,
      empName:  undefined,
      employeeNumber:  undefined,
      budgetRef:  undefined,
      gender:  undefined,
      maritalStatus:  undefined,
      dateOfBirth:  undefined,
      joiningDate:  undefined,
      jobTitle:  undefined,
      status:  undefined,
      region:  undefined,
      organization:  undefined,
      division:  undefined,
      deptCode:  undefined,
      department:  undefined,
      contactNumber:  undefined,
      section:  undefined,
      nationalIdNumber:  undefined,
      svEmployeeNumber:  undefined,
      svEmployeeName:  undefined,
      location:  undefined,
      country: undefined,
      nationality:  undefined,
      companyEmailAddress:  undefined,
      grade:  undefined,
      licenseNumber:  undefined,      
      vehicleBudget:  undefined,
      costCentre:  undefined,
  
    },
    vehicle: {
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
      registrationExpiry: undefined,
      fuelType: undefined,
      vendor: {
        id: undefined,
        vendorName: undefined,
        officeLocation: undefined,
        attachments: undefined
      },
      insuranceExpiry: undefined,
      leaseCost: undefined,
      leaseStartDate: undefined,
      leaseExpiryDate: undefined,
      usageType: undefined,
      category: undefined,
      replacementDate: undefined,
      replaceLeaseCost: undefined,
      vehicleStatus: undefined
    }
  }


  constructor(private vehicleService: VehicleService, private route: ActivatedRoute,
    private router: Router, private assignmentService: VehicleAssignmentService,
    private dashboardRedirectService: DashboardRedirectServiceService) { }

  ngOnInit() {
    this.items = [{ label: 'Vehicle', routerLink: '/vehicle' }, { label: 'View Vehicle' }];
    
    this.vehicleId = +this.route.snapshot.paramMap.get('id')!;
    this.route.queryParams.subscribe(params => {
      this.assignmentCheck = params['assignmentCheck'] === 'true';
      if (!this.vehicleId) {
        this.vehicleId = params['id'];
      }
    });

    this.getVehicleById(this.vehicleId!);
    this.items2 = [
      {
        tooltipOptions: {
          tooltipLabel: 'Edit',
          tooltipPosition: 'left'
        },
        icon: 'bi bi-pen p-speeddial-action1',
        command: () => {
        },
        routerLink: ['/edit-vehicle', this.vehicleId],
        severity: 'success',
        style: { backgroundColor: 'blue', color: 'white' }
      },
      {
        tooltipOptions: {
          tooltipLabel: 'Attachment',
          tooltipPosition: 'left'
        },
        icon: 'bi bi-paperclip',

        command: () => {
        },
        routerLink: ['/vehicle-attachment', this.vehicleId],
        pTooltip: 'Add Attachments',
        severity: 'warning'
      },
      {
        tooltipOptions: {
          tooltipLabel: 'Download Attachment',
          tooltipPosition: 'left'
        },
        icon: 'bi bi-download',
        routerLink: [`/individual-file-list-component/:call-type/${this.vehicleId}`],
        severity: 'success'
      },
      {
        tooltipOptions: {
          tooltipLabel: 'View History',
          tooltipPosition: 'left'
        },
        icon: 'bi bi-clock-history',
        command: () => {
        },
        routerLink: ['/vehicle-history', this.vehicleId],
        severity: 'success'
      },
    ];

    this.dashboardRedirectService.setDashboardValue('Vehicle');
  }

  getVehicleById(id: Number) {
    this.vehicleService.getVehicleById(id).subscribe((res: Vehicle) => {
      this.vehicle = res;
      this.getAssignmentByPlateNumber(res.plateNumber!)
    })
  }

  getAssignmentByPlateNumber(plateNumber: String){
    this.assignmentService.getAllVehicleAssignmentByPlateNumber(plateNumber).subscribe((res)=>{
      this.vehicleAssignment = res
    })
  }

  navigateFromBack() {
    if (this.assignmentCheck) {
      this.router.navigate(['/assignment'])
    } else {
      this.router.navigate(['/vehicle'])
    }
  }
}
