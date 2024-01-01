import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnAssignedVehiclesComponent } from './un-assigned-vehicles.component';

describe('UnAssignedVehiclesComponent', () => {
  let component: UnAssignedVehiclesComponent;
  let fixture: ComponentFixture<UnAssignedVehiclesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnAssignedVehiclesComponent]
    });
    fixture = TestBed.createComponent(UnAssignedVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
