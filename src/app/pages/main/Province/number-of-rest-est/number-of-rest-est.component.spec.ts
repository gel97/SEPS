import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberOfRestEstComponent } from './number-of-rest-est.component';

describe('NumberOfRestEstComponent', () => {
  let component: NumberOfRestEstComponent;
  let fixture: ComponentFixture<NumberOfRestEstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberOfRestEstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberOfRestEstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
