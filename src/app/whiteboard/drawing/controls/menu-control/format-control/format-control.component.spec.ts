import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatControlComponent } from './format-control.component';

describe('FormatControlComponent', () => {
  let component: FormatControlComponent;
  let fixture: ComponentFixture<FormatControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormatControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
