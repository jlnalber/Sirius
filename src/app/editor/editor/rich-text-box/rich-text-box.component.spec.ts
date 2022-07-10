import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RichTextBoxComponent } from './rich-text-box.component';

describe('RichTextBoxComponent', () => {
  let component: RichTextBoxComponent;
  let fixture: ComponentFixture<RichTextBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RichTextBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RichTextBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
