import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForGuestOnlyComponent } from './for-guest-only.component';

describe('ForGuestOnlyComponent', () => {
  let component: ForGuestOnlyComponent;
  let fixture: ComponentFixture<ForGuestOnlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForGuestOnlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForGuestOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
