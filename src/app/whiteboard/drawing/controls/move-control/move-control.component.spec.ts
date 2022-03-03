import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveControlComponent } from './move-control.component';

describe('MoveControlComponent', () => {
  let component: MoveControlComponent;
  let fixture: ComponentFixture<MoveControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
