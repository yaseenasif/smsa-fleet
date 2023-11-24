import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { GradeService } from '../grade.service';
import { Grade } from 'src/app/modal/grade';

@Component({
  selector: 'app-add-grade',
  templateUrl: './add-grade.component.html',
  styleUrls: ['./add-grade.component.scss'],
  providers: [MessageService]
})
export class AddGradeComponent {
  items: MenuItem[] | undefined;

  grade: Grade = {
    id: undefined,
    name: undefined,
    vehicleBudget: undefined
  };

  constructor(private gradeService: GradeService,private messageService: MessageService ) { }

  ngOnInit(): void {
    this.items = [{ label: 'Grade List', routerLink: '/grade-list' }, { label: 'Add Grade' }];
  }
  
  onSubmit() {
    this.gradeService.addGrade(this.grade).subscribe((res) => {
      this.messageService.add({ severity: 'success', summary: ' Added Successfully', detail: 'grade has been added' });  
    },
    (error) => {
      this.messageService.add({ severity: 'error', summary: 'Add Error', detail: error.error });
    });
  }
}
