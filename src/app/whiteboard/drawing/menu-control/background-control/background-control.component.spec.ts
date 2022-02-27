import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundControlComponent } from './background-control.component';

describe('BackgroundControlComponent', () => {
  let component: BackgroundControlComponent;
  let fixture: ComponentFixture<BackgroundControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
