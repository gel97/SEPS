import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainInducedComponent } from './rain-induced.component';

describe('RainInducedComponent', () => {
  let component: RainInducedComponent;
  let fixture: ComponentFixture<RainInducedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RainInducedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RainInducedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
