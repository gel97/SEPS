import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SusceptibleFloodComponent } from './susceptible-flood.component';

describe('SusceptibleFloodComponent', () => {
  let component: SusceptibleFloodComponent;
  let fixture: ComponentFixture<SusceptibleFloodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SusceptibleFloodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SusceptibleFloodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
