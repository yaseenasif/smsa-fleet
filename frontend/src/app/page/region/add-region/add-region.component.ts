import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Region } from 'src/app/modal/Region';
import { RegionService } from '../service/region.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-region',
  templateUrl: './add-region.component.html',
  styleUrls: ['./add-region.component.scss'],
  providers: [MessageService]
})
export class AddRegionComponent {
  regionValue: string | null | undefined;
  countryValue: string | null | undefined;
  idFromQueryParam: number | undefined;
  buttonName: String = 'Add';
  visible!: boolean;
  error: string = '';
  items: MenuItem[] | undefined;
  region: Region = {
    id: undefined,
    name: undefined,
    country: undefined,
    cities: undefined,
    status: undefined,
  };


  constructor(
    private regionService: RegionService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { } 

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.items = [{ label: 'Region List', routerLink: '/get-all-region' }, { label: 'Add Region' }];
        this.buttonName = 'Add'
      } else {
        this.items = [{ label: 'Region List', routerLink: '/get-all-region' }, { label: 'Update Region' }];
        this.buttonName = 'Update';
        this.regionService.getRegionbyId(this.idFromQueryParam).subscribe((res: Region) => {
          this.region = {
            ...res,
            cities: typeof res.cities === 'string' ? JSON.parse(res.cities) : res.cities || [],
          };
        }, error => {
          this.showError(error);
          this.visible = true;
        })
      }
    })
  }

  onSubmit() {

    const regionWithCitiesAsString = { ...this.region, cities: this.region.cities ? JSON.stringify(this.region.cities) : null };

    const serviceCall = this.idFromQueryParam
      ? this.regionService.updateRegion(this.idFromQueryParam, regionWithCitiesAsString)
      : this.regionService.addRegion(regionWithCitiesAsString);

    serviceCall.subscribe(
      (res: Region) => {
        const action = this.idFromQueryParam ? 'Updated' : 'Added';
        this.messageService.add({
          severity: 'success',
          summary: `${action} Successfully`,
          detail: `Region has been ${action}`,
        });
        setTimeout(() => this.router.navigate(['/get-all-regions']), 900);
      }, error => {

        this.showError(error);
      });
  }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
  }
}
