import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UntergruppenComponent } from './untergruppen.component';

describe('EinheitenComponent', () => {
  let component: UntergruppenComponent;
  let fixture: ComponentFixture<UntergruppenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UntergruppenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UntergruppenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
