import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsControlComponent } from './tools-control.component';

describe('ToolsControlComponent', () => {
  let component: ToolsControlComponent;
  let fixture: ComponentFixture<ToolsControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolsControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
