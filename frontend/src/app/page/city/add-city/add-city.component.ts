import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { City } from 'src/app/modal/City';
import { CityService } from '../city.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.scss'],
  providers: [MessageService]
})
export class AddCityComponent {
  items: MenuItem[] | undefined;

  city: City = {
    id: undefined,
    name: undefined,
    region: undefined,
    status: undefined,
  };

  constructor(
    private cityService: CityService,
    private messageService: MessageService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.items = [{ label: 'City List', routerLink: '/city-list' }, { label: 'Add City' }];
  }

  onSubmit() {
    this.cityService.addCity(this.city).subscribe((res) => {
      this.messageService.add({ severity: 'success', summary: ' Added Successfully', detail: 'city has been added' });
      setTimeout(() => {
        this.router.navigate(['/city-list']);
       }, 500);
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Add Error', detail: error.error });
      });
  }
}
