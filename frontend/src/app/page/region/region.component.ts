import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Region } from 'src/app/modal/Region';
import { RegionService } from './service/region.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss'],
  providers: [MessageService]
})
export class RegionComponent {
  region !: Region[];
  items: MenuItem[] | undefined;
  cities: any[] = [];;

  constructor(
    private regionService: RegionService,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.items = [{ label: 'Region' }];
    this.loadRegion();
  }

  loadRegion() {
    this.regionService.getRegion().subscribe((regions: Region[]) => {
      this.region = regions;
      this.region.forEach((region: any) => {
        this.cities.push(JSON.parse(region.cities))
      })
      
    });
  }

  editRegion(id: number) {
    this.router.navigate(['/add-region/id'], { queryParams: { id: id } });
  }

  deleteRegionById(id: number) {
    this.regionService.deleteRegionById(id).subscribe((res: Region) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Delete Successfully',
        detail: 'Country has been deleted',
      });
      this.loadRegion();
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Delete Error', detail: error.error });
      });
  }
}


