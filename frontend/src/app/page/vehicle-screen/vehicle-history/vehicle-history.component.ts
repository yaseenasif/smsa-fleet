import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Vehicle } from 'src/app/modal/vehicle';
import { VehicleHistory } from 'src/app/modal/vehicle-history';
import { VehicleService } from '../service/vehicle.service';


// import { DatePipe } from '@angular/common';

interface EventItem {
  event?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
  plateNumber?: number;
  employ?: {name:string,employNumber:number};
}


@Component({
  selector: 'app-vehicle-history',
  templateUrl: './vehicle-history.component.html',
  styleUrls: ['./vehicle-history.component.scss']
})
export class VehicleHistoryComponent {
  items: MenuItem[] | undefined;
  events: EventItem[];

  vehicleId: Number | undefined;
  vehicleHistory!: VehicleHistory[];
  vehicle!: Vehicle;

  constructor(private vehicleService: VehicleService,              
              private route: ActivatedRoute) {
      this.events = [
          { event: 'Replace',plateNumber:10234, date: '15/10/2020 10:30', icon: 'bi bi-arrow-repeat', color: '#3B82F6'},
          { event: 'Assignment',employ: {name:'Ali Azlan',employNumber:12342}, date: '15/10/2020 14:00', icon: 'bi bi-clipboard2-check', color: '#F59E0B' },
          { event: 'Replace',plateNumber:102234, date: '15/10/2020 16:15', icon: 'bi bi-arrow-repeat', color: '#3B82F6' },
          { event: 'Assignment',employ: {name:'Yaseen',employNumber:23321}, date: '16/10/2020 10:00', icon: 'bi bi-clipboard2-check', color: '#F59E0B' }
      ];
  }

  ngOnInit(){
    this.items = [{ label: 'Vehicle',routerLink:'/vehicle'},{ label: 'Vehicle History'}];
    this.vehicleId = +this.route.snapshot.paramMap.get('id')!;
    this.getVehicleHistoryById(this.vehicleId);
    this.getVehicleById(this.vehicleId)
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
      
}
