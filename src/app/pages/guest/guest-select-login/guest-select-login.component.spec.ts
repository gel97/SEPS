import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestSelectLoginComponent } from './guest-select-login.component';

describe('GuestSelectLoginComponent', () => {
  let component: GuestSelectLoginComponent;
  let fixture: ComponentFixture<GuestSelectLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestSelectLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestSelectLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
