import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyNotesDialogComponent } from './sticky-notes-dialog.component';

describe('StickyNotesDialogComponent', () => {
  let component: StickyNotesDialogComponent;
  let fixture: ComponentFixture<StickyNotesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StickyNotesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StickyNotesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
