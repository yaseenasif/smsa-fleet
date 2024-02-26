import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTitleListComponent } from './job-title-list.component';

describe('JobTitleListComponent', () => {
  let component: JobTitleListComponent;
  let fixture: ComponentFixture<JobTitleListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobTitleListComponent]
    });
    fixture = TestBed.createComponent(JobTitleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
