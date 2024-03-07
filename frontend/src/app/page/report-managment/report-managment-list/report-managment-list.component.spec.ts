import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportManagmentListComponent } from './report-managment-list.component';

describe('ReportManagmentListComponent', () => {
  let component: ReportManagmentListComponent;
  let fixture: ComponentFixture<ReportManagmentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportManagmentListComponent]
    });
    fixture = TestBed.createComponent(ReportManagmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
