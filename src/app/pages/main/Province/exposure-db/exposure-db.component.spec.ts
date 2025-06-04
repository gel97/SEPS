import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExposureDBComponent } from './exposure-db.component';

describe('ExposureDBComponent', () => {
  let component: ExposureDBComponent;
  let fixture: ComponentFixture<ExposureDBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExposureDBComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExposureDBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
