import { Component, enableProdMode } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Employee } from 'src/app/modal/employee';
import { EmployeeService } from '../service/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { City } from 'src/app/modal/City';
import { CityService } from '../../city/city.service';
import { RegionService } from '../../region/service/region.service';
import { Region } from 'src/app/modal/Region';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.scss'],
  providers: [MessageService, DatePipe]
})
export class UpdateEmployeeComponent {

  items: MenuItem[] | undefined;

  city: City = {
    id: undefined,
    name: undefined,
    region: undefined,
    status: undefined
  };

  cityData: any = [];

  selectedCity !: City
  // region: string | undefined | null;

  employee: Employee = {
    id: undefined,
    employeeNumber: undefined,
    budgetRef: undefined,
    empName: undefined,
    gender: undefined,
    maritalStatus: undefined,
    dateOfBirth: undefined,
    joiningDate: undefined,
    jobTitle: undefined,
    status: undefined,
    region: undefined,
    location: undefined,
    organization: undefined,
    division: undefined,
    deptCode: undefined,
    department: undefined,
    section: undefined,
    iqamaNumber: undefined,
    svEmployeeNumber: undefined,
    svEmployeeName: undefined,
    city: undefined,
    age: undefined,
    portOfDestination: undefined,
    nationality: undefined,
    companyEmailAddress: undefined,
    grade: undefined,
    licenseNumber: undefined,
    vehicleBudget: undefined,
    contactNumber: undefined,
    country: undefined,
  }

  country!: Region[];
  region!: Region[];

  employeeId: Number | undefined;
  isDeleteButtonDisabled: boolean = true; // Set the initial value based on your logic


  dummyData: any = [
    { id: '21', name: 'STN' }
  ]

  visible!: boolean;

  constructor(private employeeService: EmployeeService,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private regionService: RegionService
  ) { }


  name!: string;

  size = 100000
  uploadedFiles: any[] = [];

  onUpload(event: any) {

  }

  onUpload1(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  ngOnInit(): void {
    this.items = [{ label: 'Employee', routerLink: '/employee' }, { label: 'Edit Employee' }];
    this.employeeId = +this.route.snapshot.paramMap.get('id')!;
    this.getEmployeeById(this.employeeId)
  }

  getEmployeeById(id: Number) {
    this.employeeService.getEmployeeById(id).subscribe((res: Employee) => {
      res.joiningDate = res.joiningDate ? new Date(res.joiningDate) : new Date();
      res.dateOfBirth = res.dateOfBirth ? new Date(res.dateOfBirth) : new Date();

      this.employee = res;
      this.getCountry();
      console.log(this.employee);

    })
  }

  getCountry(): void {
    this.regionService.getRegion().subscribe(
      (res: Region[]) => {
        const uniqueCountries = this.getUniqueCountries(res, 'country');
        this.country = uniqueCountries;
        this.getRegions(this.employee.country);
      },
      (err) => {
      }
    );
  }

  getUniqueCountries(regions: Region[], propertyName: string): Region[] {
    const uniqueCountries: Region[] = [];
    const uniqueCountryNames: Set<string> = new Set();

    for (const region of regions) {
      const countryName = region[propertyName];

      if (!uniqueCountryNames.has(countryName)) {
        uniqueCountryNames.add(countryName);
        uniqueCountries.push(region);
      }
    }

    return uniqueCountries;
  }

  getRegions(country: any): void {
    this.regionService.getRegionByCountry(country).subscribe((res: Region[]) => {
      this.region = [];
      res.forEach((r: any) => {
        const parsedCities = JSON.parse(r.cities);
        this.region.push({ ...r, cities: parsedCities });
      });
      this.getAllCity(this.employee.region);
    }, err => {
    });
  }

  getAllCity(region: any): void {
    this.regionService.getCitiesByRegion(region).subscribe(
      (res: Region) => {
        this.cityData = [];
        let getCities = [];
        getCities.push(res);
        getCities.forEach((element: any) => {
          const parsedCities = JSON.parse(element.cities)
          this.cityData.push(...parsedCities);
        });
        this.cityData = this.cityData.map((city: Region, index: number) => ({
          cities: city,
          id: index + 1,
        }));
        debugger
      }, err => {
      });
  }



  updateEmployee(employee: Employee) {
    debugger
    this.employeeService.updateEmployee(this.employeeId!, employee).subscribe((res) => {


      this.messageService.add({ severity: 'success', summary: 'Update Successfully', detail: 'Message Content' });

      setTimeout(() => {
        this.router.navigate(['/employee'])
      }, 5000)

    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Edit Error', detail: error.error });
      })

  }

  onSubmit() {
    this.updateEmployee(this.employee);
  }

  closeDialog() {
    this.visible = false;
  }

  showDialog() {
    this.visible = true;
  }

  deleteEmployee() {

    this.employeeService.deleteEmployee(this.employeeId!, this.employee).subscribe((res) => {
      this.employee = res;
      this.messageService.add({ severity: 'success', summary: 'Delete Successfully', detail: 'Employee has been deleted' });
      setTimeout(() => {
        this.router.navigate(['/employee'])
      }, 1000)
    })
  }

  // getAutoFilledRegion(city: City): void {
  //   this.region = this.employee.region;
  // }
}

