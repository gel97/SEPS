import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlopeComponent } from './slope.component';

describe('SlopeComponent', () => {
  let component: SlopeComponent;
  let fixture: ComponentFixture<SlopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlopeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
