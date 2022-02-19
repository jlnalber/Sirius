import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteControlComponent } from './delete-control.component';

describe('DeleteControlComponent', () => {
  let component: DeleteControlComponent;
  let fixture: ComponentFixture<DeleteControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
