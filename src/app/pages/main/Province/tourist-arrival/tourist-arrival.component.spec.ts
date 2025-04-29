import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristArrivalComponent } from './tourist-arrival.component';

describe('TouristArrivalComponent', () => {
  let component: TouristArrivalComponent;
  let fixture: ComponentFixture<TouristArrivalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouristArrivalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristArrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
