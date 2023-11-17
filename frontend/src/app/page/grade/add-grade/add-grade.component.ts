import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { GradeService } from '../grade.service';
import { Grade } from 'src/app/modal/grade';

@Component({
  selector: 'app-add-grade',
  templateUrl: './add-grade.component.html',
  styleUrls: ['./add-grade.component.scss']
})
export class AddGradeComponent {
  items: MenuItem[] | undefined;

  grade: Grade = {
    id: undefined,
    name: undefined,
    vehicleBudget: undefined
  };

  constructor(private gradeService: GradeService) { }

  ngOnInit(): void {
    this.items = [{ label: 'Grade List', routerLink: '/grade-list' }, { label: 'Add Grade' }];
  }
  
  onSubmit() {
    debugger
    console.log('Form Values:', this.grade); 
    this.gradeService.addGrade(this.grade).subscribe((res) => {
      console.log('API Response:', res);
    });
  }
}
