import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Vehicle } from 'src/app/modal/vehicle';
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

  constructor(private vehicleService: VehicleService,private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(){
    this.items = [{ label: 'Vehicle',routerLink:'/vehicle'},{ label: 'View Vehicle'}];
    // this.vehicleId = +this.route.snapshot.paramMap.get('id')!;
    this.route.queryParams.subscribe(params => {
      this.assignmentCheck = params['assignmentCheck'] === 'true';
      this.vehicleId = params['id'];
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
  }

  getVehicleById(id: Number) {
    this.vehicleService.getVehicleById(id).subscribe((res: Vehicle) => {
      this.vehicle = res;
    })
  }

  navigateFromBack(){
    if(this.assignmentCheck){
      this.router.navigate(['/assignment'])
    }else {
      this.router.navigate(['/vehicle'])
    }
  }
}
