import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearControlComponent } from './clear-control.component';

describe('ClearControlComponent', () => {
  let component: ClearControlComponent;
  let fixture: ComponentFixture<ClearControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
