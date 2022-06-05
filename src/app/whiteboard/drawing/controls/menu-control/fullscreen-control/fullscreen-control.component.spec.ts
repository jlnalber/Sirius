import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenControlComponent } from './fullscreen-control.component';

describe('FullscreenControlComponent', () => {
  let component: FullscreenControlComponent;
  let fixture: ComponentFixture<FullscreenControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullscreenControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullscreenControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
