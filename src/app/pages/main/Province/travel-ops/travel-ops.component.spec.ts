import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelOpsComponent } from './travel-ops.component';

describe('TravelOpsComponent', () => {
  let component: TravelOpsComponent;
  let fixture: ComponentFixture<TravelOpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelOpsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelOpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
