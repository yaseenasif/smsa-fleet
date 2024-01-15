import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-project-vehicle',
  templateUrl: './project-vehicle.component.html',
  styleUrls: ['./project-vehicle.component.scss']
})
export class ProjectVehicleComponent {

  projectVehicles! : any

  items: MenuItem[] | undefined;


}
