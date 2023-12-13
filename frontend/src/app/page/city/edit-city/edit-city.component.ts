import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { City } from 'src/app/modal/City';
import { CityService } from '../city.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-city',
  templateUrl: './edit-city.component.html',
  styleUrls: ['./edit-city.component.scss'],
  providers: [MessageService]
})
export class EditCityComponent {

  items: MenuItem[] | undefined;

  cityId: number | undefined;

  city: City = {
    id: undefined,
    name: undefined,
    region: undefined,
    status: undefined,
  };

  constructor(
    private cityService: CityService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.items = [{ label: 'City List', routerLink: '/city-list' }, { label: 'Add City' }];

    this.cityId = +this.route.snapshot.paramMap.get('id')!;

    this.getCityById(this.cityId);
  }

  getCityById(id: number) {
    this.cityService.getCitybyId(id).subscribe((res: City) => {
      this.city = res;
    });
  }

  updateCity(city: City) {
    this.cityService.updateCity(this.cityId!, city).subscribe(
      (res) => {
        this.messageService.add({ severity: 'success', summary: ' Edit Successfully', detail: 'City has been edit' });
        setTimeout(() => {
          this.router.navigate(['/city-list']);
        }, 3000);
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Edit Error', detail: error.error });
      }
    );
  }


  onSubmit() {
    this.updateCity(this.city);
  }
}
