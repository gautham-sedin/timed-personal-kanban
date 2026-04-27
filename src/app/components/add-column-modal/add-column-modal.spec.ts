import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddColumnModal } from './add-column-modal';

describe('AddColumnModal', () => {
  let component: AddColumnModal;
  let fixture: ComponentFixture<AddColumnModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddColumnModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AddColumnModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
