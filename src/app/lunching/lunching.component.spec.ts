import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LunchingComponent } from './lunching.component';

describe('LunchingComponent', () => {
  let component: LunchingComponent;
  let fixture: ComponentFixture<LunchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LunchingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LunchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
