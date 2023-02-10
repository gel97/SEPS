import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecreationFacilitiesComponent } from './recreation-facilities.component';

describe('RecreationFacilitiesComponent', () => {
  let component: RecreationFacilitiesComponent;
  let fixture: ComponentFixture<RecreationFacilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecreationFacilitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecreationFacilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
