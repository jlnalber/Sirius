import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillPickerComponent } from './fill-picker.component';

describe('FillPickerComponent', () => {
  let component: FillPickerComponent;
  let fixture: ComponentFixture<FillPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FillPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FillPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
