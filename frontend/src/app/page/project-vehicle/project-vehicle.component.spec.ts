import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectVehicleComponent } from './project-vehicle.component';

describe('ProjectVehicleComponent', () => {
  let component: ProjectVehicleComponent;
  let fixture: ComponentFixture<ProjectVehicleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectVehicleComponent]
    });
    fixture = TestBed.createComponent(ProjectVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
