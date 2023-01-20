import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateexcelComponent } from './createexcel.component';

describe('CreateexcelComponent', () => {
  let component: CreateexcelComponent;
  let fixture: ComponentFixture<CreateexcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateexcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateexcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
