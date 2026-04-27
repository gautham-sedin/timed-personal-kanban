import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddColumnModalComponent } from './add-column-modal';

describe('AddColumnModal', () => {
  let component: AddColumnModalComponent;
  let fixture: ComponentFixture<AddColumnModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddColumnModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddColumnModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
