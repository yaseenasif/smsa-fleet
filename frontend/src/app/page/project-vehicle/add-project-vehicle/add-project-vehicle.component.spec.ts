import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectVehicleComponent } from './add-project-vehicle.component';

describe('AddProjectVehicleComponent', () => {
  let component: AddProjectVehicleComponent;
  let fixture: ComponentFixture<AddProjectVehicleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProjectVehicleComponent]
    });
    fixture = TestBed.createComponent(AddProjectVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
