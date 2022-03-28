import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneElementControlComponent } from './clone-element-control.component';

describe('CloneElementControlComponent', () => {
  let component: CloneElementControlComponent;
  let fixture: ComponentFixture<CloneElementControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneElementControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneElementControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
