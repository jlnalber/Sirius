import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesControlComponent } from './pages-control.component';

describe('PagesControlComponent', () => {
  let component: PagesControlComponent;
  let fixture: ComponentFixture<PagesControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagesControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
