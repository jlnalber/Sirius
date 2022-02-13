import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrokePickerComponent } from './stroke-picker.component';

describe('StrokePickerComponent', () => {
  let component: StrokePickerComponent;
  let fixture: ComponentFixture<StrokePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrokePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrokePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
