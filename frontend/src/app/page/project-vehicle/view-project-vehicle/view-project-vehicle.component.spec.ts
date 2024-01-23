import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProjectVehicleComponent } from './view-project-vehicle.component';

describe('ViewProjectVehicleComponent', () => {
  let component: ViewProjectVehicleComponent;
  let fixture: ComponentFixture<ViewProjectVehicleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewProjectVehicleComponent]
    });
    fixture = TestBed.createComponent(ViewProjectVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
