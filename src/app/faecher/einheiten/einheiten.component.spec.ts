import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EinheitenComponent } from './einheiten.component';

describe('EinheitenComponent', () => {
  let component: EinheitenComponent;
  let fixture: ComponentFixture<EinheitenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EinheitenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EinheitenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
