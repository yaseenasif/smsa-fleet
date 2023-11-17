import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { GradeService } from '../grade.service';
import { Grade } from 'src/app/modal/grade';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-grade',
  templateUrl: './edit-grade.component.html',
  styleUrls: ['./edit-grade.component.scss']
})
export class EditGradeComponent {
  items: MenuItem[] | undefined;

  gradeId: number | undefined;

  grade: Grade = {
    id: undefined,
    name: undefined,
    vehicleBudget: undefined
  };

  constructor(private gradeService: GradeService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.items = [{ label: 'Grade List', routerLink: '/grade-list' }, { label: 'Add Grade' }];

    // Ensure the gradeId is correctly initialized
    this.gradeId = +this.route.snapshot.paramMap.get('id')!;
    console.log('Grade ID:', this.gradeId);

    // Fetch grade details by ID
    this.getGradeById(this.gradeId);
  }

  getGradeById(id: number) {
    this.gradeService.getGradebyId(id).subscribe((res: Grade) => {
      console.log('Fetched Grade:', res);
      this.grade = res;
      console.log(this.grade);

    });
  }

  updateGrade(grade: Grade) {
    this.gradeService.updateGrade(this.gradeId!, grade).subscribe(
      (res) => {
        console.log('Update Successful:', res);
      },
      (error) => {
        console.error('Update Failed:', error);
      }
    );
  }
  

  onSubmit() {
    this.updateGrade(this.grade);
  }
}
