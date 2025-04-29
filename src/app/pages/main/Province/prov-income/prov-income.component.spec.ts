import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvIncomeComponent } from './prov-income.component';

describe('ProvIncomeComponent', () => {
  let component: ProvIncomeComponent;
  let fixture: ComponentFixture<ProvIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvIncomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
