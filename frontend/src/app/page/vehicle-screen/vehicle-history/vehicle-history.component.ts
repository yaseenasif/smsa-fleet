import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
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

  constructor() {
      this.events = [
          { event: 'Replace',plateNumber:10234, date: '15/10/2020 10:30', icon: 'bi bi-arrow-repeat', color: '#3B82F6'},
          { event: 'Assignment',employ: {name:'Ali Azlan',employNumber:12342}, date: '15/10/2020 14:00', icon: 'bi bi-clipboard2-check', color: '#F59E0B' },
          { event: 'Replace',plateNumber:102234, date: '15/10/2020 16:15', icon: 'bi bi-arrow-repeat', color: '#3B82F6' },
          { event: 'Assignment',employ: {name:'Yaseen',employNumber:23321}, date: '16/10/2020 10:00', icon: 'bi bi-clipboard2-check', color: '#F59E0B' }
      ];
  }

  ngOnInit(){
    this.items = [{ label: 'Vehicle',routerLink:'/vehicle'},{ label: 'Vehicle History'}];
  }
}
