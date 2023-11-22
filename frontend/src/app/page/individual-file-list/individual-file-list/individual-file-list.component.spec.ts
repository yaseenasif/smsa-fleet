import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualFileListComponent } from './individual-file-list.component';

describe('IndividualFileListComponent', () => {
  let component: IndividualFileListComponent;
  let fixture: ComponentFixture<IndividualFileListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndividualFileListComponent]
    });
    fixture = TestBed.createComponent(IndividualFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
