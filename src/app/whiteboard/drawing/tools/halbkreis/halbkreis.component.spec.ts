import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalbkreisComponent } from './halbkreis.component';

describe('HalbkreisComponent', () => {
  let component: HalbkreisComponent;
  let fixture: ComponentFixture<HalbkreisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HalbkreisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HalbkreisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
