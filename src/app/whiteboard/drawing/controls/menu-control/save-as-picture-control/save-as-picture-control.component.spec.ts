import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAsPictureControlComponent } from './save-as-picture-control.component';

describe('SaveAsPictureControlComponent', () => {
  let component: SaveAsPictureControlComponent;
  let fixture: ComponentFixture<SaveAsPictureControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveAsPictureControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveAsPictureControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
