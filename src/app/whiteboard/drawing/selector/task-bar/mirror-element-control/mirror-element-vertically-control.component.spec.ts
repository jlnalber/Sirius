import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MirrorElementVerticallyControlComponent } from './mirror-element-vertically-control.component';

describe('MirrorElementControlComponent', () => {
  let component: MirrorElementVerticallyControlComponent;
  let fixture: ComponentFixture<MirrorElementVerticallyControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MirrorElementVerticallyControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MirrorElementVerticallyControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
