import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditorDialogComponent } from './add-editor-dialog.component';

describe('AddEditorDialogComponent', () => {
  let component: AddEditorDialogComponent;
  let fixture: ComponentFixture<AddEditorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
