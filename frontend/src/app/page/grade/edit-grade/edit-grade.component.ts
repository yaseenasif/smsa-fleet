import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { GradeService } from '../grade.service';
import { Grade } from 'src/app/modal/grade';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-grade',
  templateUrl: './edit-grade.component.html',
  styleUrls: ['./edit-grade.component.scss'],
  providers: [MessageService]
})
export class EditGradeComponent {
  items: MenuItem[] | undefined;

  gradeId: number | undefined;

  grade: Grade = {
    id: undefined,
    name: undefined,
    vehicleBudget: undefined
  };

  constructor(private gradeService: GradeService, private route: ActivatedRoute,private messageService: MessageService) {}

  ngOnInit(): void {
    this.items = [{ label: 'Grade List', routerLink: '/grade-list' }, { label: 'Add Grade' }];

    this.gradeId = +this.route.snapshot.paramMap.get('id')!;

    this.getGradeById(this.gradeId);
  }

  getGradeById(id: number) {
    this.gradeService.getGradebyId(id).subscribe((res: Grade) => {
      this.grade = res;
    });
  }

  updateGrade(grade: Grade) {
    this.gradeService.updateGrade(this.gradeId!, grade).subscribe(
      (res) => {
        this.messageService.add({ severity: 'success', summary: ' Edit Successfully', detail: 'grade has been edit' });  
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Edit Error', detail: error.error });
      }
    );
  }
  

  onSubmit() {
    this.updateGrade(this.grade);
  }
}
