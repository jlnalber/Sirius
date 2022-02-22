import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPageControlComponent } from './new-page-control.component';

describe('NewPageControlComponent', () => {
  let component: NewPageControlComponent;
  let fixture: ComponentFixture<NewPageControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPageControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPageControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
