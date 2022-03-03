import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportAsPdfControlComponent } from './export-as-pdf-control.component';

describe('ExportAsPdfControlComponent', () => {
  let component: ExportAsPdfControlComponent;
  let fixture: ComponentFixture<ExportAsPdfControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportAsPdfControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportAsPdfControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
