import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowVehicleComponent } from './show-vehicle.component';

describe('ShowVehicleComponent', () => {
  let component: ShowVehicleComponent;
  let fixture: ComponentFixture<ShowVehicleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowVehicleComponent]
    });
    fixture = TestBed.createComponent(ShowVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
