import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PYAPComponent } from './pyap.component';

describe('PYAPComponent', () => {
  let component: PYAPComponent;
  let fixture: ComponentFixture<PYAPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PYAPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PYAPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
