import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWhiteboardDialogComponent } from './add-whiteboard-dialog.component';

describe('AddWhiteboardDialogComponent', () => {
  let component: AddWhiteboardDialogComponent;
  let fixture: ComponentFixture<AddWhiteboardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWhiteboardDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWhiteboardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
