import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeControlComponent } from './shape-control.component';

describe('ShapeControlComponent', () => {
  let component: ShapeControlComponent;
  let fixture: ComponentFixture<ShapeControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShapeControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
