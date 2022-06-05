import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeodreieckComponent } from './geodreieck.component';

describe('GeodreieckComponent', () => {
  let component: GeodreieckComponent;
  let fixture: ComponentFixture<GeodreieckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeodreieckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeodreieckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
