import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleHistoryComponent } from './vehicle-history.component';

describe('VehicleHistoryComponent', () => {
  let component: VehicleHistoryComponent;
  let fixture: ComponentFixture<VehicleHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleHistoryComponent]
    });
    fixture = TestBed.createComponent(VehicleHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
