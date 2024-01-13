import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectVehicleComponent } from './edit-project-vehicle.component';

describe('EditProjectVehicleComponent', () => {
  let component: EditProjectVehicleComponent;
  let fixture: ComponentFixture<EditProjectVehicleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditProjectVehicleComponent]
    });
    fixture = TestBed.createComponent(EditProjectVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
