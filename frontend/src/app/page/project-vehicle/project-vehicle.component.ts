import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { PrjectVehicleService } from './service/prject-vehicle.service';
import { ProjectVehicle } from 'src/app/modal/project-vehicle';

@Component({
  selector: 'app-project-vehicle',
  templateUrl: './project-vehicle.component.html',
  styleUrls: ['./project-vehicle.component.scss'],
  providers:[MessageService]
})
export class ProjectVehicleComponent implements OnInit{
constructor(private projectVehicleService : PrjectVehicleService,
  private messageService : MessageService
  ){}
  projectVehicles! : ProjectVehicle[];
  projectVehicleId: number | undefined;
  items: MenuItem[] | undefined;
ngOnInit(): void {
    this.getAllProjectVehicle()
}
getAllProjectVehicle() {
    this.projectVehicleService.getAllProjectVehicle().subscribe((projectVehicle: ProjectVehicle[]) => {
          this.projectVehicles = projectVehicle;
          console.log(projectVehicle);
    })
}
deleteProjectVehicleById(id:number){
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
