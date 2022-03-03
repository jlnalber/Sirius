import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EinheitComponent } from './einheit.component';

describe('EinheitComponent', () => {
  let component: EinheitComponent;
  let fixture: ComponentFixture<EinheitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EinheitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EinheitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
