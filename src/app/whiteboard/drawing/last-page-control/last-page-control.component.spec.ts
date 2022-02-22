import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastPageControlComponent } from './last-page-control.component';

describe('LastPageControlComponent', () => {
  let component: LastPageControlComponent;
  let fixture: ComponentFixture<LastPageControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastPageControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LastPageControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
