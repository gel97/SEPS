import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FedPWDComponent } from './fed-pwd.component';

describe('FedPWDComponent', () => {
  let component: FedPWDComponent;
  let fixture: ComponentFixture<FedPWDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FedPWDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FedPWDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
