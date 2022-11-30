import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActivityTaskComponent } from './edit-activity-task.component';

describe('EditActivityTaskComponent', () => {
  let component: EditActivityTaskComponent;
  let fixture: ComponentFixture<EditActivityTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditActivityTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditActivityTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
