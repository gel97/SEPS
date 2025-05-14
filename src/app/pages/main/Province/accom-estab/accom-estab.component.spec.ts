import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccomEstabComponent } from './accom-estab.component';

describe('AccomEstabComponent', () => {
  let component: AccomEstabComponent;
  let fixture: ComponentFixture<AccomEstabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccomEstabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccomEstabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
