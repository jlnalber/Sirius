import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorsetComponent } from './colorset.component';

describe('ColorsetComponent', () => {
  let component: ColorsetComponent;
  let fixture: ComponentFixture<ColorsetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorsetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
