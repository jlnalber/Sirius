import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappenComponent } from './mappen.component';

describe('FaecherComponent', () => {
  let component: MappenComponent;
  let fixture: ComponentFixture<MappenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
