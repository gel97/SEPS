import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CDRAComponent } from './cdra.component';

describe('CDRAComponent', () => {
  let component: CDRAComponent;
  let fixture: ComponentFixture<CDRAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CDRAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CDRAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
