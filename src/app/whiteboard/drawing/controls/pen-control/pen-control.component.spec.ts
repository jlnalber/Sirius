import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenControlComponent } from './pen-control.component';

describe('PenControlComponent', () => {
  let component: PenControlComponent;
  let fixture: ComponentFixture<PenControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PenControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PenControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
