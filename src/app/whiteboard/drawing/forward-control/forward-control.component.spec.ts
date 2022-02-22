import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardControlComponent } from './forward-control.component';

describe('ForwardControlComponent', () => {
  let component: ForwardControlComponent;
  let fixture: ComponentFixture<ForwardControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForwardControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
