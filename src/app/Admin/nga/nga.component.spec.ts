import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NGAComponent } from './nga.component';

describe('NGAComponent', () => {
  let component: NGAComponent;
  let fixture: ComponentFixture<NGAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NGAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NGAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
