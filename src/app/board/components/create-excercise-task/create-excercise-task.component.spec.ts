import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExcerciseTaskComponent } from './create-excercise-task.component';

describe('CreateExcerciseTaskComponent', () => {
  let component: CreateExcerciseTaskComponent;
  let fixture: ComponentFixture<CreateExcerciseTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateExcerciseTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateExcerciseTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
