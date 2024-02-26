import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { JobTitle } from 'src/app/modal/job-title';
import { ProductFieldServiceService } from '../../product-field/service/product-field-service.service';
import { ProductField } from 'src/app/modal/ProductField';
import { JobTitleService } from '../job-title.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-job-title',
  templateUrl: './add-job-title.component.html',
  styleUrls: ['./add-job-title.component.scss'],
  providers: [MessageService]
})
export class AddJobTitleComponent implements OnInit{

  items: MenuItem[] | undefined;
  jobTitles : JobTitle = {
    id: undefined,
    jobTitle: undefined,
    division: undefined,
    department: undefined,
    section: undefined,
    fleetClassification: undefined,
    vehicleEligible: undefined,
    status: undefined,
  }

  division: ProductField | null | undefined;
  section: ProductField | undefined;
  department: ProductField | undefined;
  fleetClassification: ProductField | undefined;
  vehicleEligible: ProductField | undefined;
  jobTitleId: Number;
  isUpdateMode: Boolean = false;
  jobTitle: ProductField | undefined;

  constructor(
    private productFieldService: ProductFieldServiceService,
    private jobTitleService: JobTitleService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
    ) {
      this.jobTitleId = +this.route.snapshot.paramMap.get('id')!;
      if(this.jobTitleId) {
        this.isUpdateMode = true;
      }
    }

  ngOnInit(): void {
    this.getAllSubscription();
    this.getJobTitleById(this.jobTitleId);
  }

  getAllSubscription() {
    const fieldNames = [
      'Division',
      'Department',
      'Section',
      'Fleet Classification',
      'Vehicle Eligible'
    ]
    const observables = fieldNames.map(fieldName => this.productFieldService.getProductFieldByName(fieldName));

    forkJoin(observables).subscribe(
      (responses: ProductField[]) => {
        this.division = responses[0];
        this.department = responses[1];
        this.section = responses[2];
        this.fleetClassification = responses[3];
        this.vehicleEligible = responses[4];
      }
    )

    // this.productFieldService.getProductFieldByName('Job Title').subscribe((res: ProductField) => {
    //   this.jobTitle = res;
    // });

    // this.productFieldService.getProductFieldByName('Division').subscribe((res: ProductField) => {
    //   this.division = res;
    // });

    // this.productFieldService.getProductFieldByName('Department').subscribe((res: ProductField) => {
    //   this.department = res;
    // });

    // this.productFieldService.getProductFieldByName('Section').subscribe((res: ProductField) => {
    //   this.section = res;
    // });

    // this.productFieldService.getProductFieldByName('Fleet Classification').subscribe((res: ProductField) => {
    //   this.fleetClassification = res;
    // });

    // this.productFieldService.getProductFieldByName('Vehicle Eligible').subscribe((res: ProductField) => {
    //   this.vehicleEligible = res;
    // });
  }

  getJobTitleById( id: Number ) {
    this.jobTitleService.getJobTitleById(id).subscribe((res: JobTitle) => {
      this.jobTitles = res;
    })
  }

  onSubmit() {

    if(this.isUpdateMode) {
      this.jobTitleService.updateJobTitle( this.jobTitleId, this.jobTitles ).subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: ' Added Successfully',
            detail: 'Job Title has been updated'
          });
          this.router.navigate(['/job-title-list'])
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Add Error',
          detail: error.error
        });
      }
      )
    }
    else {
      this.jobTitleService.addJobTitle(this.jobTitles).subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: ' Added Successfully',
            detail: 'Job Title has been added'
          });
          this.router.navigate(['/job-title-list'])
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Add Error',
            detail: error.error
          });
        }
        )
      }
    }

}
