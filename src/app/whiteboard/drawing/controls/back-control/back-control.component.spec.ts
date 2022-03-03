import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackControlComponent } from './back-control.component';

describe('BackControlComponent', () => {
  let component: BackControlComponent;
  let fixture: ComponentFixture<BackControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
