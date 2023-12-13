import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { City } from 'src/app/modal/City';
import { CityService } from '../city.service';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss'],
  providers: [MessageService]
})
export class CityListComponent implements OnInit {
  city !: City[];
  items: MenuItem[] | undefined;

  constructor(private cityService: CityService, private messageService: MessageService) { }

  ngOnInit() {
    this.items = [{ label: 'City' }];
    this.loadCity();
  }

  loadCity() {
    this.cityService.getCity().subscribe((cities: City[]) => {
      this.city = cities;
    });
  }
  deleteCityById(id: Number) {
    this.cityService.deleteCityById(id).subscribe((res) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Delete Successfully',
        detail: 'City has been deleted',
      });
      this.loadCity();
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Delete Error', detail: error.error });
      });
  }
}

