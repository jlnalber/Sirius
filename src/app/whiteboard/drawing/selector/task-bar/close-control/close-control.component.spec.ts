import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseControlComponent } from './close-control.component';

describe('CloseControlComponent', () => {
  let component: CloseControlComponent;
  let fixture: ComponentFixture<CloseControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
