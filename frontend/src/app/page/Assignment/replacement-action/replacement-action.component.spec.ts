import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementActionComponent } from './replacement-action.component';

describe('ReplacementActionComponent', () => {
  let component: ReplacementActionComponent;
  let fixture: ComponentFixture<ReplacementActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReplacementActionComponent]
    });
    fixture = TestBed.createComponent(ReplacementActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
