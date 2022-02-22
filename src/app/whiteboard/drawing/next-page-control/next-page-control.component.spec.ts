import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextPageControlComponent } from './next-page-control.component';

describe('NextPageControlComponent', () => {
  let component: NextPageControlComponent;
  let fixture: ComponentFixture<NextPageControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextPageControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NextPageControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
