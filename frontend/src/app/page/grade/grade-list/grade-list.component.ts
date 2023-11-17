import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Grade } from 'src/app/modal/grade';
import { GradeService } from '../grade.service';

@Component({
  selector: 'app-grade-list',
  templateUrl: './grade-list.component.html',
  styleUrls: ['./grade-list.component.scss'],
  providers: [MessageService]

})
export class GradeListComponent implements OnInit {
  grade !: Grade[];
  items: MenuItem[] | undefined;

  constructor(private gradeService: GradeService ,private messageService: MessageService) { }

  ngOnInit() {
    this.items = [{ label: 'Grade' }];
    this.loadGrades();
  }

  loadGrades() {
    this.gradeService.getGrades().subscribe((grades: Grade[]) => {
      this.grade = grades;
      console.log('Grades:', grades);
    });
  }
  deleteGradeById(id: Number) {
    this.gradeService.deleteGradeById(id).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Delete Successfully',
        detail: 'Grade has been deleted',
      });

      this.loadGrades();
    });
}
}

