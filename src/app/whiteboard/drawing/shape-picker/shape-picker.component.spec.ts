import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapePickerComponent } from './shape-picker.component';

describe('ShapePickerComponent', () => {
  let component: ShapePickerComponent;
  let fixture: ComponentFixture<ShapePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShapePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
