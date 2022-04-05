import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportAsSvgControlComponent } from './export-as-svg-control.component';

describe('ExportAsSvgControlComponent', () => {
  let component: ExportAsSvgControlComponent;
  let fixture: ComponentFixture<ExportAsSvgControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportAsSvgControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportAsSvgControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
