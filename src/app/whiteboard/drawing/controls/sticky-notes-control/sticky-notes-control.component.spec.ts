import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyNotesControlComponent } from './sticky-notes-control.component';

describe('StickyNotesControlComponent', () => {
  let component: StickyNotesControlComponent;
  let fixture: ComponentFixture<StickyNotesControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StickyNotesControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StickyNotesControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
