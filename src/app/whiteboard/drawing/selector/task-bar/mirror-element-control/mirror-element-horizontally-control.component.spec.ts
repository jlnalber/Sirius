import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MirrorElementHorizontallyControlComponent } from './mirror-element-horizontally-control.component';

describe('MirrorElementControlComponent', () => {
  let component: MirrorElementHorizontallyControlComponent;
  let fixture: ComponentFixture<MirrorElementHorizontallyControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MirrorElementHorizontallyControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MirrorElementHorizontallyControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
