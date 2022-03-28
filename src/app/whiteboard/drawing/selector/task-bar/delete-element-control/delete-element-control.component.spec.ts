import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteElementControlComponent } from './delete-element-control.component';

describe('DeleteElementControlComponent', () => {
  let component: DeleteElementControlComponent;
  let fixture: ComponentFixture<DeleteElementControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteElementControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteElementControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
