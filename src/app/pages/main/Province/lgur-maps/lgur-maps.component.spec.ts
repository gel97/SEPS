import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LgurMapsComponent } from './lgur-maps.component';

describe('LgurMapsComponent', () => {
  let component: LgurMapsComponent;
  let fixture: ComponentFixture<LgurMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LgurMapsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LgurMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
